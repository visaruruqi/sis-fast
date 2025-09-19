# Universal MobX-Vue Bridge

A powerful utility that automatically bridges MobX observables with Vue reactivity, solving the integration issues with `mobx-vue-lite`.

## ✨ Features

- **Auto-Detection**: Automatically detects all observable properties
- **Multiple API Styles**: Choose your preferred syntax
- **Error Handling**: Graceful error handling with warnings
- **Performance Options**: Debouncing, deep copying, computed sync
- **Lifecycle Management**: Automatic cleanup on component unmount
- **TypeScript Ready**: Full type support (when added)

## 🚀 Quick Start

### 1. Simplest Usage (Auto-Detection) - Recommended
```javascript
import { usePresenterState } from '../utils/mobxVueBridge'

const presenter = container.get(TYPES.StudentsPresenter)
const state = usePresenterState(presenter) // Auto-detects everything!

// Now use state.modalOpen, state.search, state.filtered, etc.
```

### 2. Specific Properties (Performance Optimization)
```javascript
// Specify exactly what you need
const state = usePresenterState(presenter, ['modalOpen', 'selected', 'search'])
```

### 3. Advanced Configuration
```javascript
const state = usePresenterState(presenter, {
  properties: ['modalOpen', 'search'],
  debounce: 100,        // Debounce updates by 100ms
  deep: true,           // Deep copy objects using toJS()
  syncComputed: true    // Auto-sync computed properties
})
```

## 🎯 Three Simple Ways to Use

```javascript
// 1. Auto-detect everything (recommended)
const state = usePresenterState(presenter)

// 2. Specific properties for performance
const state = usePresenterState(presenter, ['modalOpen', 'search'])

// 3. Advanced options
const state = usePresenterState(presenter, { 
  properties: ['search'], 
  debounce: 200 
})
```

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoDetect` | boolean | `true` | Auto-detect observable properties |
| `syncComputed` | boolean | `true` | Re-sync computed properties when triggers change |
| `debounce` | number | `0` | Debounce updates in milliseconds |
| `deep` | boolean | `false` | Use `toJS()` for deep copying objects |

## 🎨 Real-World Examples

### Complete Component Example
```vue
<template>
  <div>
    <button @click="presenter.openModal()">Add Item</button>
    <input v-model="state.search" placeholder="Search..." />
    
    <div v-for="item in state.filtered" :key="item.id">
      {{ item.name }}
    </div>
    
    <Modal v-if="state.modalOpen" 
           :item="state.selected" 
           @save="presenter.save" 
           @close="presenter.closeModal" />
  </div>
</template>

<script setup>
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.ItemsPresenter)
const state = usePresenterState(presenter, 'all')
</script>
```

### Performance-Optimized Example
```javascript
// For high-frequency updates or large objects
const state = usePresenterState(presenter, {
  properties: ['search', 'results'],
  debounce: 200,    // Debounce rapid search updates
  deep: true        // Deep copy large result objects
})
```

### Minimal Example
```javascript
// Ultimate simplicity - just works!
const state = usePresenterState(presenter)
// Automatically gives you ALL observable properties
```

## 🔧 Under the Hood

The bridge works by:

1. **Auto-detecting** all observable properties in your MobX presenter
2. **Creating** a Vue reactive object that mirrors the MobX state
3. **Observing** MobX property changes using `observe()`
4. **Syncing** changes to the Vue reactive state automatically
5. **Managing** lifecycle with proper cleanup on component unmount

## 🚨 Error Handling

The bridge includes comprehensive error handling:

- Warns about failed property initialization
- Catches observer creation errors
- Handles disposal errors gracefully
- Continues working even if some properties fail

## 🎯 Migration Guide

### From Manual Implementation
```javascript
// Before (manual bridge)
const state = reactive({
  modalOpen: presenter.modalOpen,
  search: presenter.search
})

onMounted(() => {
  disposers.push(
    observe(presenter, 'modalOpen', () => {
      state.modalOpen = presenter.modalOpen
    })
  )
})

// After (utility)
const state = usePresenterState(presenter, ['modalOpen', 'search'])
```

### From mobx-vue-lite Observer
```vue
<!-- Before -->
<template>
  <Observer>
    <div>{{ presenter.modalOpen }}</div>
  </Observer>
</template>

<!-- After -->
<template>
  <div>{{ state.modalOpen }}</div>
</template>

<script setup>
const state = usePresenterState(presenter, 'all')
</script>
```

## 💡 Pro Tips

1. **Use auto-detection by default** - `usePresenterState(presenter)` handles everything
2. **Specify properties only when needed** - for performance optimization
3. **Enable debouncing for high-frequency updates** - search inputs, etc.
4. **Use deep copying for complex objects** - when you need toJS() behavior
5. **Start simple, optimize later** - auto-detection is fast enough for most cases

This universal bridge gives you the flexibility to use MobX with Vue in the most convenient way for your specific use case!
