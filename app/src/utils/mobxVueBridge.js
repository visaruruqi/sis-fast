import { reactive, onUnmounted, ref } from 'vue'
import { toJS, observe, reaction } from 'mobx'
import { deepObserve } from 'mobx-utils'
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
        mobxObject[prop] = clone(value)
        // Update the ref to trigger Vue reactivity
        propertyRefs[prop].value = toJS(mobxObject[prop])
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

  // Add deep observation for nested objects and arrays using deepObserve
  try {
    const subscription = deepObserve(mobxObject, (change, path) => {
      // Check if this change affects any of our properties
      members.properties.forEach(prop => {
        if (path === prop || path.startsWith(prop + '.')) {
          if (propertyRefs && propertyRefs[prop]) {
            const newValue = toJS(mobxObject[prop])
            if (propertyRefs[prop].value !== newValue) {
              propertyRefs[prop].value = newValue
            }
          }
        }
      })
      
      // Check if this change affects any of our computed properties
      members.getters.forEach(prop => {
        if (path === prop || path.startsWith(prop + '.')) {
          if (getterRefs && getterRefs[prop]) {
            const newValue = toJS(mobxObject[prop])
            if (getterRefs[prop].value !== newValue) {
              getterRefs[prop].value = newValue
            }
          }
        }
      })
    })
    subscriptions.push(subscription)
  } catch (error) {
    // Silently ignore if deepObserve fails
  }

  // Add reaction for computed properties to handle dependencies
  members.getters.forEach(prop => {
    try {
      const subscription = reaction(
        () => toJS(mobxObject[prop]),
        (newValue) => {
          if (getterRefs && getterRefs[prop]) {
            if (getterRefs[prop].value !== newValue) {
              getterRefs[prop].value = newValue
            }
          }
        },
        { fireImmediately: false }
      )
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
