import { reactive, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { observe, toJS, reaction } from 'mobx'

/**
 * Universal MobX-Vue bridge that automatically detects and syncs all observable properties
 * 
 * @param {Object} mobxObject - The MobX observable object (e.g., presenter)
 * @param {Array|string|null} properties - Properties to observe. Can be:
 *   - Array of property names: ['modalOpen', 'search'] 
 *   - String preset: 'all', 'modal', 'list', 'pagination'
 *   - null/undefined: auto-detect all observable properties
 * @param {Object} options - Configuration options
 * @param {string} options.mode - Binding mode: 'two-way' (default), 'read-only', 'action-only'
 * @param {boolean} options.allowDirectMutation - Allow direct state mutation (default: true for convenience)
 * @param {Function} options.onDirectMutation - Callback when direct mutation occurs
 * @returns {Object} Vue reactive state that mirrors MobX state
 */
export function useMobxBridge(mobxObject, properties = null, options = {}) {
  const { 
    autoDetect = true,
    syncComputed = true,
    debounce = 0,
    deep = false,
    mode = 'two-way',  // 'two-way', 'read-only', 'action-only'
    allowDirectMutation = true,  // Default to true for convenience
    onDirectMutation = null
  } = options
  
  // Auto-detect all members if not specified
  let members
  if (!properties || properties === 'all') {
    members = autoDetectObservableMembers(mobxObject)
  } else {
    // If specific properties are provided, categorize them
    members = {
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
      setters: []
    }
  }
  
  // Create Vue reactive state
  const state = reactive({})
  
  // Initialize reactive properties and getters with current MobX values
  const reactiveMembers = [...members.properties, ...members.getters]
  reactiveMembers.forEach(prop => {
    try {
      // Create binding based on mode and property type
      if (members.properties.includes(prop)) {
        // For observable properties: create binding based on mode
        Object.defineProperty(state, prop, {
          get() {
            return deep ? toJS(mobxObject[prop]) : mobxObject[prop]
          },
          set(value) {
            // Handle different binding modes
            if (mode === 'read-only') {
              console.warn(`Direct mutation of '${prop}' is disabled. Use actions instead.`)
              if (onDirectMutation) {
                onDirectMutation(prop, value, 'read-only')
              }
              return
            }
            
            if (mode === 'action-only') {
              console.warn(`Direct mutation of '${prop}' is disabled. Use actions instead.`)
              if (onDirectMutation) {
                onDirectMutation(prop, value, 'action-only')
              }
              return
            }
            
            // Mode: 'two-way' (default)
            if (!allowDirectMutation) {
              console.warn(`Direct mutation of '${prop}' is disabled. Use actions instead.`)
              if (onDirectMutation) {
                onDirectMutation(prop, value, 'disabled')
              }
              return
            }
            
            // Log direct mutation for debugging
            if (onDirectMutation) {
              onDirectMutation(prop, value, 'direct')
            }
            
            // Update MobX property directly
            mobxObject[prop] = value
          },
          enumerable: true,
          configurable: true
        })
      } else {
        // For getters: always read-only access
        state[prop] = deep ? toJS(mobxObject[prop]) : mobxObject[prop]
      }
    } catch (error) {
      console.warn(`Failed to initialize property ${prop}:`, error)
    }
  })
  
  // Expose actions and setters directly (not reactive, but accessible)
  members.methods.forEach(method => {
    try {
      // Check if this is a setter method (starts with 'set')
      if (method.startsWith('set') && method.length > 3) {
        const propertyName = method.charAt(3).toLowerCase() + method.slice(4)
        const descriptor = Object.getOwnPropertyDescriptor(mobxObject, propertyName) || 
                          Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), propertyName)
        if (descriptor && descriptor.set) {
          // Bind the setter
          state[method] = descriptor.set.bind(mobxObject)
        } else {
          // Regular action
          state[method] = mobxObject[method].bind(mobxObject)
        }
      } else {
        // Regular action
        state[method] = mobxObject[method].bind(mobxObject)
      }
    } catch (error) {
      console.warn(`Failed to bind action ${method}:`, error)
    }
  })
  
  members.setters.forEach(setter => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, setter) || 
                        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), setter)
      if (descriptor && descriptor.set) {
        state[setter] = descriptor.set.bind(mobxObject)
      }
    } catch (error) {
      console.warn(`Failed to bind setter ${setter}:`, error)
    }
  })
  
  // Track disposers for cleanup
  let disposers = []
  
        onMounted(() => {
          // Use MobX reaction to observe only getters (properties are handled by getter/setter)
          // Methods and setters are exposed directly without observation
          const getterMembers = members.getters
          if (getterMembers.length > 0) {
            disposers.push(
              reaction(
                () => {
                  // Track only getters
                  const trackedValues = {}
                  getterMembers.forEach(prop => {
                    try {
                      // Access the property to ensure MobX tracks it
                      const value = mobxObject[prop]
                      trackedValues[prop] = value
                    } catch (error) {
                      console.warn(`Failed to track getter ${prop}:`, error)
                    }
                  })
                  return trackedValues
                },
                (trackedValues) => {
                  // Update Vue reactive state when MobX getters change
                  Object.keys(trackedValues).forEach(prop => {
                    try {
                      // Re-access the property to get the latest value
                    const latestValue = mobxObject[prop]
                    state[prop] = deep ? toJS(latestValue) : latestValue
                  } catch (error) {
                    console.warn(`Failed to sync property ${prop}:`, error)
                  }
                })
              },
              {
                fireImmediately: true, // Sync immediately on mount
                equals: (a, b) => {
                  // Custom equality check to avoid unnecessary updates
                  if (Object.keys(a).length !== Object.keys(b).length) return false
                  for (const key in a) {
                    if (a[key] !== b[key]) return false
                  }
                  return true
                }
              }
            )
          )
          }
        })
  
  onUnmounted(() => {
    disposers.forEach(dispose => {
      try {
        dispose()
      } catch (error) {
        console.warn('Error disposing observer:', error)
      }
    })
    disposers = []
  })
  
  return state
}

/**
 * Auto-detect all members in a MobX object (properties, getters, actions, setters)
 * @param {Object} mobxObject - MobX observable object
 * @returns {Object} Object with categorized members
 */
function autoDetectObservableMembers(mobxObject) {
  const members = {
    properties: [],    // Observable properties
    getters: [],       // Computed properties (getters)
    methods: [],       // Actions (methods that modify state)
    setters: []        // Property setters
  }
  
  // Check if this object has explicit MobX configuration
  const hasExplicitConfig = mobxObject.$mobx && mobxObject.$mobx.values
  if (hasExplicitConfig) {
    // Handle explicit makeObservable configuration
    return detectExplicitObservableMembers(mobxObject, members)
  }
  
  // Get all enumerable properties
  for (const prop in mobxObject) {
    if (mobxObject.hasOwnProperty(prop)) {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop)
      
      if (descriptor && !prop.startsWith('_')) {
        if (descriptor.value !== undefined) {
          // Regular property or method
          if (typeof mobxObject[prop] === 'function') {
            members.methods.push(prop) // Actions (methods that modify state)
          } else {
            members.properties.push(prop)
          }
        } else if (descriptor.get) {
          // Getter (computed property)
          members.getters.push(prop)
        }
      }
    }
  }
  
  // Also check prototype for getters, methods, and setters
  let proto = Object.getPrototypeOf(mobxObject)
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop)
      if (descriptor && !prop.startsWith('_')) {
        if (descriptor.get && !members.getters.includes(prop)) {
          // Getter (computed property)
          members.getters.push(prop)
        }
        if (descriptor.set && !members.setters.includes(prop)) {
          // Setter - if it has both getter and setter, we expose the setter as a method
          // If it's a pure setter (no getter), we handle it as a setter
          if (descriptor.get) {
            // Both getter and setter - expose setter as a method
            members.methods.push(`set${prop.charAt(0).toUpperCase() + prop.slice(1)}`)
          } else {
            // Pure setter
            members.setters.push(prop)
          }
        }
        if (descriptor.value && typeof descriptor.value === 'function' && !members.methods.includes(prop)) {
          // Action (method that modifies state)
          members.methods.push(prop)
        }
      }
    })
    proto = Object.getPrototypeOf(proto)
  }
  
  return members
}

/**
 * Detect members in objects with explicit makeObservable configuration
 * @param {Object} mobxObject - MobX observable object with explicit config
 * @param {Object} members - Members object to populate
 * @returns {Object} Object with categorized members
 */
function detectExplicitObservableMembers(mobxObject, members) {
  // Get all enumerable properties (including those defined in makeObservable)
  for (const prop in mobxObject) {
    if (mobxObject.hasOwnProperty(prop) && !prop.startsWith('_')) {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop)
      
      if (descriptor && descriptor.value !== undefined) {
        // Regular property or method
        if (typeof mobxObject[prop] === 'function') {
          members.methods.push(prop) // Actions (methods that modify state)
        } else {
          members.properties.push(prop)
        }
      } else if (descriptor && descriptor.get) {
        // Getter (computed property)
        members.getters.push(prop)
      }
    }
  }
  
  // Also check prototype for getters, methods, and setters
  let proto = Object.getPrototypeOf(mobxObject)
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop)
      if (descriptor && !prop.startsWith('_')) {
        if (descriptor.get && !members.getters.includes(prop)) {
          // Getter (computed property)
          members.getters.push(prop)
        }
        if (descriptor.set && !members.setters.includes(prop)) {
          // Setter - if it has both getter and setter, we expose the setter as a method
          // If it's a pure setter (no getter), we handle it as a setter
          if (descriptor.get) {
            // Both getter and setter - expose setter as a method
            members.methods.push(`set${prop.charAt(0).toUpperCase() + prop.slice(1)}`)
          } else {
            // Pure setter
            members.setters.push(prop)
          }
        }
        if (descriptor.value && typeof descriptor.value === 'function' && !members.methods.includes(prop)) {
          // Action (method that modifies state)
          members.methods.push(prop)
        }
      }
    })
    proto = Object.getPrototypeOf(proto)
  }
  
  return members
}

/**
 * Simple and powerful usePresenterState - auto-detects or uses specific properties
 * 
 * @param {Object} presenter - The MobX presenter
 * @param {Array|string|Object} properties - Configuration:
 *   - Array: specific properties ['modalOpen', 'search']
 *   - 'all' or undefined: auto-detect all observable properties
 *   - Object: full options { properties: [...], debounce: 100, ... }
 * @param {Object} options - Additional options (when properties is array/string)
 * @returns {Object} Vue reactive state
 */
export function usePresenterState(presenter, properties = 'all', options = {}) {
  // Handle different config styles
  if (Array.isArray(properties)) {
    // Array of specific properties: usePresenterState(presenter, ['modalOpen', 'search'])
    return useMobxBridge(presenter, properties, options)
  } else if (typeof properties === 'object') {
    // Full options object: usePresenterState(presenter, { properties: [...], debounce: 100 })
    const { properties: props, ...bridgeOptions } = properties
    return useMobxBridge(presenter, props, bridgeOptions)
  } else {
    // String ('all') or default: usePresenterState(presenter) or usePresenterState(presenter, 'all')
    return useMobxBridge(presenter, properties, options)
  }
}
