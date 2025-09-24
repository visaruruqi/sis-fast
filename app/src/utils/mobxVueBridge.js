import { reactive, onUnmounted, ref, watch } from 'vue';
import { toJS, reaction, isComputedProp, isObservableProp } from 'mobx';
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
    getters: props.filter(p => isComputedProp(mobxObject, p)),
    properties: props.filter(
      p =>
        isObservableProp(mobxObject, p) &&
        !isComputedProp(mobxObject, p) &&
        typeof mobxObject[p] !== 'function'
    ),
    methods: props.filter(p => typeof mobxObject[p] === 'function'),
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
      get: () => propertyRefs[prop].value,
      set: allowDirectMutation
        ? (value) => {
            // Update Vue ref; the deep watcher below will propagate to MobX.
            const cloned = clone(value);
            if (!isEqual(propertyRefs[prop].value, cloned)) {
              propertyRefs[prop].value = cloned;
            }
          }
        : () => console.warn(`Direct mutation of '${prop}' is disabled`),
      enumerable: true,
      configurable: true,
    });

    // Vue → MobX: deep watcher per data prop
    watch(
      propertyRefs[prop],
      (newVal) => {
        if (updatingFromMobx.has(prop)) return; // avoid echo
        updatingFromVue.add(prop);
        try {
          const next = clone(newVal); // strip Vue proxies
          if (!isEqual(mobxObject[prop], next)) {
            mobxObject[prop] = next;
          }
        } finally {
          updatingFromVue.delete(prop);
        }
      },
      { deep: true }
    );
  });

  // ---- computed getters (read-only) -----------------------------------------
  const getterRefs = {};
  members.getters.forEach(prop => {
    getterRefs[prop] = ref(toJS(mobxObject[prop]));

    Object.defineProperty(vueState, prop, {
      get: () => getterRefs[prop].value,
      set: () => console.warn(`Cannot assign to computed property '${prop}'`),
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

  // ---- MobX → Vue: deepObserve + reactions ---------------------------------
  const subscriptions = [];

  // Single deep observer for ALL nested mutations (and top-level assignments)
  const dsub = deepObserve(mobxObject, (_change, path) => {
    // For each data prop, if the path hits it or its subtree, sync it
    members.properties.forEach(prop => {
      if (path === prop || path.startsWith(prop + '.')) {
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
      }
    });
  });
  subscriptions.push(dsub);

  // Computeds: keep them in sync via reaction (read-only updates)
  members.getters.forEach(prop => {
    const sub = reaction(
      () => toJS(mobxObject[prop]),
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
