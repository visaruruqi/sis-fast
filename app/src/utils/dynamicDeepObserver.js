/**
 * 🔄 Dynamic Deep Observer
 * 
 * Isolated solution for the deepObserve stale subscription issue.
 * This can be easily removed if it causes problems.
 * 
 * Problem: When obj.property is replaced, deepObserve on the old value becomes stale
 * Solution: Re-establish deepObserve when properties are replaced
 */

import { observe } from 'mobx'
import { deepObserve } from 'mobx-utils'

/**
 * Creates a dynamic deep observer that automatically re-establishes itself
 * when the observed property is replaced.
 * 
 * @param {object} mobxObject - The MobX observable object
 * @param {string} prop - The property name to observe
 * @param {function} onChange - Callback when changes occur
 * @param {function} isEqual - Equality checker function
 * @returns {function} Disposer function
 */
export function createDynamicDeepObserver(mobxObject, prop, onChange, isEqual) {
  let currentDeepObserver = null
  let isDisposed = false
  
  const subscriptions = []
  
  // Helper to establish deepObserve on current value
  function establishDeepObserver() {
    // Dispose previous deepObserver if it exists
    if (currentDeepObserver) {
      try {
        currentDeepObserver()
        currentDeepObserver = null
      } catch (error) {
        // Ignore disposal errors
      }
    }
    
    if (isDisposed) return
    
    const currentValue = mobxObject[prop]
    
    // Only observe objects (not primitives, arrays, or null)
    if (currentValue && typeof currentValue === 'object' && !Array.isArray(currentValue)) {
      try {
        currentDeepObserver = deepObserve(currentValue, (change, path) => {
          if (isDisposed) return
          onChange(change, path)
        })
      } catch (error) {
        // Silently ignore if deepObserve fails
        console.warn(`Failed to establish deepObserve on ${prop}:`, error)
      }
    }
  }
  
  // Observe top-level property changes (replacement)
  try {
    const topLevelObserver = observe(mobxObject, prop, (change) => {
      if (isDisposed) return
      
      // Handle the top-level change
      onChange(change, '')
      
      // Re-establish deepObserver on the new value
      establishDeepObserver()
    })
    
    subscriptions.push(topLevelObserver)
  } catch (error) {
    console.warn(`Failed to establish observe on ${prop}:`, error)
  }
  
  // Establish initial deepObserver
  establishDeepObserver()
  
  // Return disposer function
  return function dispose() {
    if (isDisposed) return
    isDisposed = true
    
    // Dispose all subscriptions
    subscriptions.forEach(disposer => {
      try {
        if (typeof disposer === 'function') {
          disposer()
        }
      } catch (error) {
        // Ignore disposal errors
      }
    })
    
    // Dispose current deepObserver
    if (currentDeepObserver) {
      try {
        currentDeepObserver()
      } catch (error) {
        // Ignore disposal errors
      }
    }
  }
}

/**
 * Enhanced observer for properties that handles both top-level and nested changes
 * while avoiding the stale subscription issue.
 * 
 * @param {object} mobxObject - The MobX observable object
 * @param {array} properties - Array of property names to observe
 * @param {object} propertyRefs - Object containing Vue refs for each property
 * @param {function} toJS - MobX toJS function
 * @param {function} isEqual - Equality checker function
 * @param {Set} updatingFromVue - Set to track Vue -> MobX updates
 * @param {Set} updatingFromMobx - Set to track MobX -> Vue updates
 * @returns {array} Array of disposer functions
 */
export function createEnhancedPropertyObservers(
  mobxObject, 
  properties, 
  propertyRefs, 
  toJS, 
  isEqual, 
  updatingFromVue, 
  updatingFromMobx
) {
  const disposers = []
  
  properties.forEach(prop => {
    try {
      const disposer = createDynamicDeepObserver(
        mobxObject,
        prop,
        (change, path) => {
          if (!propertyRefs[prop]) return
          if (updatingFromVue.has(prop)) return // avoid echo
          
          updatingFromMobx.add(prop)
          try {
            const next = toJS(mobxObject[prop])
            if (!isEqual(propertyRefs[prop].value, next)) {
              propertyRefs[prop].value = next
            }
          } finally {
            updatingFromMobx.delete(prop)
          }
        },
        isEqual
      )
      
      disposers.push(disposer)
    } catch (error) {
      console.warn(`Failed to create enhanced observer for ${prop}:`, error)
    }
  })
  
  return disposers
}
