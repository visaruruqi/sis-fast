import { reactive, onUnmounted, ref } from 'vue';
import { toJS, reaction, observe, isComputedProp, isObservableProp } from 'mobx';
import { deepObserve } from 'mobx-utils';
import clone from 'clone';

/**
 * 🌉 MobX-Vue Bridge
 */
export function useMobxBridge(mobxObject, options = {}) {
  const allowDirectMutation = options.allowDirectMutation ?? true;
  const vueState = reactive({});

  // Discover props/methods via MobX introspection (don’t rely on raw descriptors)
  const props = Object.getOwnPropertyNames(mobxObject)
    .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(mobxObject)))
    .filter(p => p !== 'constructor' && !p.startsWith('_'));

  const members = {
    getters: props.filter(p => {
      try {
        // First try to check if it's a computed property via MobX introspection
        try {
          return isComputedProp(mobxObject, p);
        } catch (computedError) {
          // If isComputedProp fails (e.g., due to uninitialized nested objects),
          // fall back to checking if it has a getter descriptor
          const descriptor = Object.getOwnPropertyDescriptor(mobxObject, p) || 
                            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(mobxObject), p);
          
          // If it has a getter but no corresponding property, it's likely a computed getter
          return descriptor && typeof descriptor.get === 'function' && 
                 !isObservableProp(mobxObject, p);
        }
      } catch (error) {
        return false;
      }
    }),
    properties: props.filter(p => {
      try {
        // Check if it's an observable property
        if (!isObservableProp(mobxObject, p)) return false;
        
        // Check if it's a function (method)
        if (typeof mobxObject[p] === 'function') return false;
        
        // Check if it's a computed property - if so, it's a getter, not a property
        const isComputed = isComputedProp(mobxObject, p);
        if (isComputed) return false;
        
        return true; // Regular observable property
      } catch (error) {
        return false;
      }
    }),
    methods: props.filter(p => {
      try {
        return typeof mobxObject[p] === 'function';
      } catch (error) {
        return false;
      }
    }),
  };
  

  // ---- utils: guards + equality --------------------------------------------
  const updatingFromMobx = new Set();
  const updatingFromVue = new Set();

  const isEqual = (a, b) => {
    if (Object.is(a, b)) return true;
    try { return JSON.stringify(a) === JSON.stringify(b); }
    catch { return false; }
  };

  // ---- properties (two-way) -------------------------------------------------
  const propertyRefs = {};
  members.properties.forEach(prop => {
    propertyRefs[prop] = ref(toJS(mobxObject[prop]));

    Object.defineProperty(vueState, prop, {
      get: () => {
        const value = propertyRefs[prop].value;
        // If it's an object/array, return a proxy that intercepts nested changes
        if (value && typeof value === 'object') {
          return new Proxy(value, {
            set: (target, key, val) => {
              target[key] = val;
              // Update the Vue ref to trigger reactivity
              propertyRefs[prop].value = clone(propertyRefs[prop].value);
              // Update MobX immediately
              mobxObject[prop] = clone(propertyRefs[prop].value);
              return true;
            }
          });
        }
        return value;
      },
      set: allowDirectMutation
        ? (value) => {
            // Update Vue ref
            const cloned = clone(value);
            if (!isEqual(propertyRefs[prop].value, cloned)) {
              propertyRefs[prop].value = cloned;
            }
            // ALSO update MobX immediately (synchronous)
            if (!isEqual(mobxObject[prop], cloned)) {
              mobxObject[prop] = cloned;
            }
          }
        : () => console.warn(`Direct mutation of '${prop}' is disabled`),
      enumerable: true,
      configurable: true,
    });

  });

  // ---- computed getters (read-only) -----------------------------------------
  const getterRefs = {};
  members.getters.forEach(prop => {
    // Safely get initial value of computed property, handle errors gracefully
    let initialValue;
    try {
      initialValue = toJS(mobxObject[prop]);
    } catch (error) {
      // If computed property throws during initialization (e.g., accessing null.property),
      // set initial value to undefined and let the reaction handle updates later
      initialValue = undefined;
    }
    getterRefs[prop] = ref(initialValue);

    Object.defineProperty(vueState, prop, {
      get: () => getterRefs[prop].value,
      set: () => {
        throw new Error(`Cannot assign to computed property '${prop}'`)
      },
      enumerable: true,
      configurable: true,
    });
  });

  // ---- methods (bound) ------------------------------------------------------
  members.methods.forEach(prop => {
    Object.defineProperty(vueState, prop, {
      get: () => mobxObject[prop].bind(mobxObject),
      set: () => console.warn(`Cannot assign to method '${prop}'`),
      enumerable: true,
      configurable: true,
    });
  });

  // ---- MobX → Vue: individual observe + targeted deepObserve ---------------
  const subscriptions = [];

  // Use individual observe for each property to avoid circular reference issues
  members.properties.forEach(prop => {
    try {
      const sub = observe(mobxObject, prop, (change) => {
        if (!propertyRefs[prop]) return;
        if (updatingFromVue.has(prop)) return; // avoid echo
        updatingFromMobx.add(prop);
        try {
          const next = toJS(mobxObject[prop]);
          if (!isEqual(propertyRefs[prop].value, next)) {
            propertyRefs[prop].value = next;
          }
        } finally {
          updatingFromMobx.delete(prop);
        }
      });
      subscriptions.push(sub);
    } catch (error) {
      // Silently ignore non-observable properties
    }
  });

  // For nested objects, use deepObserve on individual properties to handle deep changes
  // This avoids circular reference issues while still detecting nested mutations
  members.properties.forEach(prop => {
    const value = mobxObject[prop];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      try {
        const sub = deepObserve(value, (change, path) => {
          if (!propertyRefs[prop]) return;
          if (updatingFromVue.has(prop)) return; // avoid echo
          updatingFromMobx.add(prop);
          try {
            const next = toJS(mobxObject[prop]);
            if (!isEqual(propertyRefs[prop].value, next)) {
              propertyRefs[prop].value = next;
            }
          } finally {
            updatingFromMobx.delete(prop);
          }
        });
        subscriptions.push(sub);
      } catch (error) {
        // Silently ignore if deepObserve fails (e.g., circular references in nested objects)
      }
    }
  });

  // Computeds: keep them in sync via reaction (read-only updates)
  members.getters.forEach(prop => {
    const sub = reaction(
      () => {
        try {
          return toJS(mobxObject[prop]);
        } catch (error) {
          // If computed property throws (e.g., accessing null.property), return undefined
          return undefined;
        }
      },
      (next) => {
        if (!getterRefs[prop]) return;
        if (!isEqual(getterRefs[prop].value, next)) {
          getterRefs[prop].value = next;
        }
      }
    );
    subscriptions.push(sub);
  });

  // Cleanup
  onUnmounted(() => {
    subscriptions.forEach(unsub => { try { typeof unsub === 'function' && unsub(); } catch {} });
  });

  return vueState;
}

// Helper alias
export function usePresenterState(presenter, options = {}) {
  return useMobxBridge(presenter, options);
}
