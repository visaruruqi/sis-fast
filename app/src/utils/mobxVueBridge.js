import { reactive, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { observe, toJS } from 'mobx'

/**
 * Universal MobX-Vue bridge that automatically detects and syncs all observable properties
 * 
 * @param {Object} mobxObject - The MobX observable object (e.g., presenter)
 * @param {Array|string|null} properties - Properties to observe. Can be:
 *   - Array of property names: ['modalOpen', 'search'] 
 *   - String preset: 'all', 'modal', 'list', 'pagination'
 *   - null/undefined: auto-detect all observable properties
 * @param {Object} options - Configuration options
 * @returns {Object} Vue reactive state that mirrors MobX state
 */
export function useMobxBridge(mobxObject, properties = null, options = {}) {
  const { 
    autoDetect = true,
    syncComputed = true,
    debounce = 0,
    deep = false 
  } = options
  
  // Auto-detect observable properties if not specified
  if (!properties || properties === 'all') {
    properties = autoDetectObservableProperties(mobxObject)
  }
  
  // Create Vue reactive state
  const state = reactive({})
  
  // Initialize state with current MobX values
  properties.forEach(prop => {
    try {
      state[prop] = deep ? toJS(mobxObject[prop]) : mobxObject[prop]
    } catch (error) {
      console.warn(`Failed to initialize property ${prop}:`, error)
    }
  })
  
  // Track disposers for cleanup
  let disposers = []
  let timeouts = new Map()
  
  // Function to sync a specific property with optional debouncing
  function syncProperty(prop) {
    if (debounce > 0) {
      if (timeouts.has(prop)) {
        clearTimeout(timeouts.get(prop))
      }
      timeouts.set(prop, setTimeout(() => {
        state[prop] = deep ? toJS(mobxObject[prop]) : mobxObject[prop]
        timeouts.delete(prop)
      }, debounce))
    } else {
      state[prop] = deep ? toJS(mobxObject[prop]) : mobxObject[prop]
    }
  }
  
  // Function to sync all properties
  function syncAllProperties() {
    properties.forEach(prop => {
      try {
        syncProperty(prop)
      } catch (error) {
        console.warn(`Failed to sync property ${prop}:`, error)
      }
    })
  }
  
  // Detect computed properties that might need re-syncing
  const computedTriggers = ['search', 'page', 'filter', 'sort', 'query']
  
  onMounted(() => {
    // Create observers for each property
    properties.forEach(prop => {
      try {
        disposers.push(
          observe(mobxObject, prop, () => {
            syncProperty(prop)
            
            // If this property affects computed properties and syncComputed is enabled
            if (syncComputed && computedTriggers.includes(prop)) {
              // Re-sync all properties to catch computed changes
              setTimeout(syncAllProperties, 0)
            }
          })
        )
      } catch (error) {
        console.warn(`Failed to observe property ${prop}:`, error)
      }
    })
    
    // Initial sync
    syncAllProperties()
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
    
    // Clear any pending timeouts
    timeouts.forEach(timeout => clearTimeout(timeout))
    timeouts.clear()
  })
  
  return state
}

/**
 * Auto-detect observable properties in a MobX object
 * @param {Object} mobxObject - MobX observable object
 * @returns {Array} Array of observable property names
 */
function autoDetectObservableProperties(mobxObject) {
  const properties = []
  
  // Get all enumerable properties
  for (const prop in mobxObject) {
    if (mobxObject.hasOwnProperty(prop)) {
      const descriptor = Object.getOwnPropertyDescriptor(mobxObject, prop)
      
      // Include regular properties and getters (computed)
      if (descriptor && (descriptor.value !== undefined || descriptor.get)) {
        // Skip private properties (starting with _)
        if (!prop.startsWith('_') && typeof mobxObject[prop] !== 'function') {
          properties.push(prop)
        }
      }
    }
  }
  
  // Also check prototype for getters (computed properties)
  let proto = Object.getPrototypeOf(mobxObject)
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop)
      if (descriptor && descriptor.get && !prop.startsWith('_') && !properties.includes(prop)) {
        properties.push(prop)
      }
    })
    proto = Object.getPrototypeOf(proto)
  }
  
  return properties
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
