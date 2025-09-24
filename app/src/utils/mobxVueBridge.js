import { reactive, onUnmounted, markRaw, ref } from 'vue'
import { toJS, observe, reaction, autorun } from 'mobx'
import clone from 'clone'

/**
 * 🌉 MobX-Vue Bridge - A Story of Two Reactive Worlds
 * 
 * Once upon a time, there was a MobX object that wanted to live in Vue's reactive world.
 * This bridge helps them understand each other by translating between their languages.
 * 
 * @param {Object} mobxObject - The MobX character in our story
 * @param {Object} options - The rules for how they should interact
 * @returns {Object} A Vue reactive state that speaks both languages
 */
export function useMobxBridge(mobxObject, options = {}) {
  const allowDirectMutation = options.allowDirectMutation ?? true
  const vueState = reactive({})
  
  // Add loop detection flag to vueState
  vueState._isUpdatingFromMobx = false

  // Get all properties from the MobX object
  const properties = Object.getOwnPropertyNames(mobxObject)
    .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(mobxObject)))
    .filter(prop => !prop.startsWith('_') && prop !== 'constructor')

  // Categorize members
  const members = {
    properties: properties.filter(prop => {
      try {
        const value = mobxObject[prop]
        return typeof value !== 'function'
      } catch {
        return false
      }
    }),
    getters: properties.filter(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop) || 
                        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), prop)
      return descriptor && descriptor.get
    }),
    methods: properties.filter(prop => {
      try {
        return typeof mobxObject[prop] === 'function'
      } catch {
        return false
      }
    }),
    setters: properties.filter(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop) || 
                        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), prop)
      // Include properties that have a setter (regardless of whether they have a getter)
      return descriptor && descriptor.set
    })
  }

  // Map properties to Vue state (two-way binding with reactive refs)
  const propertyRefs = {}
  members.properties.forEach(prop => {
    // Create a reactive ref for each observable property
    propertyRefs[prop] = ref(toJS(mobxObject[prop]))
    
    Object.defineProperty(vueState, prop, {
      get: () => propertyRefs[prop].value,
      set: allowDirectMutation ? (value) => {
        console.log(`SETTER CALLED: Setting ${prop} to:`, value)
        if (isVueReactiveProxy(value)) {
          mobxObject[prop] = markRaw(clone(value))
        } else {
          mobxObject[prop] = clone(value)
        }
        console.log(`SETTER RESULT: MobX ${prop} is now:`, mobxObject[prop])
        // Update the ref to trigger Vue reactivity
        propertyRefs[prop].value = toJS(mobxObject[prop])
        console.log(`SETTER RESULT: Vue ref ${prop} is now:`, propertyRefs[prop].value)
      } : () => console.warn(`Direct mutation of '${prop}' is disabled`),
      enumerable: true,
      configurable: true
    })
  })

  // Map getters to Vue state (read-only with reactive values)
  const getterRefs = {}
  members.getters.forEach(prop => {
    // Create a reactive ref for each computed property
    getterRefs[prop] = ref(toJS(mobxObject[prop]))
    
    Object.defineProperty(vueState, prop, {
      get: () => getterRefs[prop].value,
      set: () => console.warn(`Cannot assign to computed property '${prop}'`),
      enumerable: true,
      configurable: true
    })
  })

  // Map methods to Vue state (bound functions)
  members.methods.forEach(prop => {
    Object.defineProperty(vueState, prop, {
      get: () => mobxObject[prop].bind(mobxObject),
      set: () => console.warn(`Cannot assign to method '${prop}'`),
      enumerable: true,
      configurable: true
    })
  })

  // Map setters to Vue state (bound functions with 'set' prefix)
  members.setters.forEach(prop => {
    const setterName = `set${prop.charAt(0).toUpperCase()}${prop.slice(1)}`
    Object.defineProperty(vueState, setterName, {
      get: () => {
        const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop) || 
                          Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), prop)
        return descriptor.set.bind(mobxObject)
      },
      set: () => console.warn(`Cannot assign to setter '${setterName}'`),
      enumerable: true,
      configurable: true
    })
  })

  // Set up MobX observers for the entire object
  const subscriptions = []
  
  // Use detailed observe for each property to detect specific changes
  members.properties.forEach(prop => {
    try {
      const subscription = observe(mobxObject, prop, (change) => {
        // Only update if the value actually changed and we have a ref
        if (propertyRefs && propertyRefs[prop]) {
          const newValue = toJS(mobxObject[prop])
          if (propertyRefs[prop].value !== newValue) {
            propertyRefs[prop].value = newValue
          }
        }
      })
      subscriptions.push(subscription)
    } catch (error) {
      // Silently ignore non-observable properties
    }
  })
  
  // Use detailed observe for each getter to detect computed property changes
  members.getters.forEach(prop => {
    try {
      const subscription = observe(mobxObject, prop, (change) => {
        // Only update if the value actually changed and we have a ref
        if (getterRefs && getterRefs[prop]) {
          const newValue = toJS(mobxObject[prop])
          if (getterRefs[prop].value !== newValue) {
            getterRefs[prop].value = newValue
          }
        }
      })
      subscriptions.push(subscription)
    } catch (error) {
      // Silently ignore non-observable properties
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    subscriptions.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    })
  })

  return vueState
}

// Helper for usePresenterState - A convenient alias
export function usePresenterState(presenter, options = {}) {
  return useMobxBridge(presenter, options)
}

/**
 * Detect if a value is wrapped with Vue reactivity proxies
 */
function isVueReactiveProxy(value) {
  if (value === null || value === undefined) return false

  return (
    value.__v_isReactive === true ||  // Vue 3 reactive object
    value.__v_isRef === true ||      // Vue 3 ref
    value.__v_isReadonly === true || // Vue 3 readonly
    value.__v_isShallow === true ||  // Vue 3 shallow reactive
    value.__v_skip === true ||       // Vue 3 skip marker
    value.__ob__ !== undefined ||    // Vue 2 observable
    (typeof value === 'object' && value.constructor && value.constructor.name === 'Proxy')
  )
}