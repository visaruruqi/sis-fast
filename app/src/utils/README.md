# Universal MobX-Vue Bridge

A powerful utility that automatically bridges MobX observables with Vue reactivity, providing seamless integration between MobX and Vue.

## ✨ Features

- **Auto-Detection**: Automatically detects all observable properties, computed properties, actions, and setters
- **Computed Properties Support**: Handles MobX computed properties (getters) automatically
- **Actions & Setters Support**: Exposes all actions and setters with proper binding
- **Safety Modes**: Control direct state mutation with different binding modes
- **Two-Way Binding**: Default mode allows direct mutation for convenience
- **Multiple API Styles**: Choose your preferred syntax
- **Error Handling**: Graceful error handling with warnings
- **Performance Optimized**: Uses MobX reaction for efficient change detection
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
  // Deep copying is always enabled for consistency
  syncComputed: true    // Auto-sync computed properties
})
```

## 🔒 Safety Modes

The bridge supports different binding modes to control direct state mutation:

### Default: Two-Way Mode (Convenience)
```javascript
// Default behavior - allows direct mutation for convenience
const state = usePresenterState(presenter)
state.search = 'new value'  // ✅ Works - direct mutation allowed
```

### Read-Only Mode (Safety)
```javascript
// Block direct mutation, but allow actions
const state = usePresenterState(presenter, null, {
  mode: 'read-only',
  allowDirectMutation: false
})
state.search = 'new value'  // ❌ Blocked - use actions instead
state.setSearch('new value')  // ✅ Works - action allowed
```

### Action-Only Mode (Maximum Safety)
```javascript
// Block direct mutation, enforce validation through actions
const state = usePresenterState(presenter, null, {
  mode: 'action-only',
  allowDirectMutation: false
})
state.search = 'new value'  // ❌ Blocked - use actions instead
state.setSearch('new value')  // ✅ Works - action with validation
```

### Mixed Mode (Selective Protection)
```javascript
// Allow direct mutation for safe properties, block for sensitive ones
const state = usePresenterState(presenter, ['search', 'modalOpen'], {
  mode: 'two-way'  // Only for specified safe properties
})
// Add sensitive properties with action-only protection manually
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

## 🧮 Computed Properties Support

The bridge automatically handles MobX computed properties (getters):

```javascript
// In your presenter
class StudentsPresenter {
  search = ''
  students = []
  
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
  
  // This computed property is automatically detected and synced!
  get filteredStudents() {
    return this.students.filter(s => 
      s.name.toLowerCase().includes(this.search.toLowerCase())
    )
  }
  
  // This computed property is also automatically synced!
  get studentCount() {
    return this.filteredStudents.length
  }
}

// In your component
const state = usePresenterState(presenter)

// Both regular and computed properties are reactive
console.log(state.filteredStudents) // Automatically updates when search or students change
console.log(state.studentCount)     // Automatically updates when filteredStudents changes
```

## 🔧 Complete Member Type Support

The bridge handles all types of MobX members using proper MobX terminology:

> **MobX Terminology**: In MobX, methods that modify observable state are called **"actions"**, not just "methods". This is important for the Fast Test Architecture as actions are the primary way to modify state in a controlled manner.

### **Properties (Observable Data)**
```javascript
class StudentsPresenter {
  search = ''           // ✅ Observable property
  students = []         // ✅ Observable property
  isLoading = false     // ✅ Observable property
}
```

### **Computed Properties (Getters)**
```javascript
class StudentsPresenter {
  get filteredStudents() {    // ✅ Computed property
    return this.students.filter(s => 
      s.name.toLowerCase().includes(this.search.toLowerCase())
    )
  }
  
  get studentCount() {        // ✅ Computed property
    return this.filteredStudents.length
  }
}
```

### **Actions (Methods that modify state)**
```javascript
class StudentsPresenter {
  openModal(student = null) {     // ✅ Action (modifies observable state)
    this.selected = student
    this.modalOpen = true
  }
  
  save(studentData) {             // ✅ Action (modifies observable state)
    this.repository.save(studentData)
    this.closeModal()
  }
  
  archive(student) {              // ✅ Action (modifies observable state)
    this.repository.archive(student.id)
  }
}
```

### **Setters (Property Setters)**
```javascript
class StudentsPresenter {
  _value = 0
  
  get value() {           // ✅ Getter
    return this._value
  }
  
  set value(newValue) {   // ✅ Setter (exposed as setValue method)
    this._value = newValue
  }
}
```

### **Usage in Components**
```javascript
const state = usePresenterState(presenter)

// Properties (reactive)
console.log(state.search)        // ✅ Reactive
console.log(state.students)      // ✅ Reactive
console.log(state.isLoading)     // ✅ Reactive

// Computed properties (reactive)
console.log(state.filteredStudents)  // ✅ Reactive
console.log(state.studentCount)      // ✅ Reactive

// Actions (callable)
state.openModal(student)         // ✅ Callable
state.save(studentData)          // ✅ Callable
state.archive(student)           // ✅ Callable

// Setters (exposed as methods)
state.setValue(42)               // ✅ Callable (from setter)
```

## 🏗️ Fast Test Architecture Context

In the **Fast Test Architecture**, the bridge supports the complete separation of concerns:

### **Presenter Layer (ViewModel)**
- **Properties**: View state (`modalOpen`, `search`, `selected`)
- **Computed Properties**: Derived state (`filteredStudents`, `isLoading`)
- **Actions**: Business logic (`openModal()`, `save()`, `archive()`)
- **Setters**: Property setters (`setValue()`)

### **Repository Layer (Domain Model)**
- **Properties**: Domain state (`students`, `isLoading`, `error`)
- **Computed Properties**: Domain logic (`activeStudents`, `archivedStudents`)
- **Actions**: Data operations (`save()`, `archive()`, `loadStudents()`)
- **Setters**: State setters (`setLoading()`, `setError()`)

### **Gateway Layer (External Interface)**
- **Properties**: API state (`baseUrl`, `timeout`)
- **Actions**: API calls (`createStudent()`, `updateStudent()`, `deleteStudent()`)

This separation makes each layer **independently testable** and **easily mockable** for fast, reliable tests.

## 🔧 Explicit makeObservable Configuration Support

The bridge also supports explicit `makeObservable` configuration where you manually specify which properties are observable, computed, or actions:

### **Explicit Configuration Example**
```javascript
class StudentsPresenter {
  constructor() {
    this.viewModel = { data: 'initial' }
    this.derivedRates = { rate: 1.0 }
    
    makeObservable(this, {
      viewModel: observable,
      derivedRates: observable.ref,
      
      filteredRates: computed,
      sortedRates: computed,
      bookingSessionData: computed,
      
      updateViewModel: action,
      calculateRates: action,
      resetData: action
    })
  }
  
  get filteredRates() {
    return this.derivedRates.rate * 2
  }
  
  get sortedRates() {
    return [this.derivedRates.rate, this.filteredRates].sort()
  }
  
  get bookingSessionData() {
    return {
      viewModel: this.viewModel,
      rates: this.sortedRates
    }
  }
  
  updateViewModel(newData) {
    this.viewModel.data = newData
  }
  
  calculateRates(multiplier) {
    this.derivedRates = { rate: this.derivedRates.rate * multiplier }
  }
  
  resetData() {
    this.viewModel = { data: 'reset' }
    this.derivedRates = { rate: 1.0 }
  }
}
```

### **Usage with Bridge**
```javascript
const state = usePresenterState(presenter)

// All members are automatically detected and synced
console.log(state.viewModel)        // ✅ Observable property
console.log(state.derivedRates)     // ✅ Observable property
console.log(state.filteredRates)    // ✅ Computed property
console.log(state.sortedRates)      // ✅ Computed property
console.log(state.bookingSessionData) // ✅ Computed property

// Actions are callable
state.updateViewModel('new data')   // ✅ Action
state.calculateRates(2)             // ✅ Action
state.resetData()                   // ✅ Action
```

### **Key Benefits of Explicit Configuration**
- **Fine-grained Control**: Specify exactly which properties are observable/computed/actions
- **Performance**: Only observe what you need
- **Clarity**: Explicit declaration of intent
- **Nested Objects**: Use `observable.ref` for object references
- **Bridge Compatibility**: Works seamlessly with the MobX-Vue bridge

## ⚙️ Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoDetect` | boolean | `true` | Auto-detect observable properties |
| `syncComputed` | boolean | `true` | Re-sync computed properties when triggers change |
| `debounce` | number | `0` | Debounce updates in milliseconds |
| `loopDetection` | boolean | `true` | Enable loop detection to prevent infinite loops |

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
  // Deep copying is always enabled for consistency
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

## 📝 Changelog

### v2.0.0 - Safety Modes & Enhanced Architecture

#### ✨ New Features
- **Safety Modes**: Added support for different binding modes to control direct state mutation
  - `two-way` mode (default): Allows direct mutation for convenience
  - `read-only` mode: Blocks direct mutation, allows actions
  - `action-only` mode: Blocks direct mutation, enforces validation through actions
  - `mixed` mode: Selective protection for different properties
- **Enhanced Options**: Added `allowDirectMutation` and `onDirectMutation` options
- **Improved Documentation**: Comprehensive examples and safety guidelines

#### 🔧 Configuration Changes
- **Default Behavior**: `allowDirectMutation = true` by default for backward compatibility
- **Mode System**: `mode = 'two-way'` by default for convenience
- **Deep Conversion**: Always uses `toJS()` for consistent deep conversion of MobX observables

#### 🛡️ Safety Improvements
- **Direct Mutation Control**: Can now block dangerous direct mutations
- **Validation Enforcement**: Actions can enforce business rules and validation
- **Audit Trail**: Callback system for tracking direct mutations
- **Environment-Based Configuration**: Different rules for dev vs production

#### 📚 Documentation Updates
- Added comprehensive safety modes documentation
- Included examples for different use cases
- Added migration guide for existing code
- Enhanced API documentation with all options

#### 🧪 Testing
- Added comprehensive test suite for all binding modes
- Safety tests demonstrating risks and solutions
- Integration tests for Vue component usage
- Nested object reactivity tests

#### 🔄 Backward Compatibility
- **100% backward compatible** - existing code continues to work unchanged
- Default behavior maintains current functionality
- New features are opt-in only

### v1.0.0 - Initial Release
- Basic MobX-Vue bridge functionality
- Auto-detection of observable properties
- Two-way binding support
- Vue reactivity integration

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

### From Manual MobX Integration
```vue
<!-- Before (Manual) -->
<template>
  <div>{{ state.modalOpen }}</div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { observe } from 'mobx'

const state = reactive({ modalOpen: false })

onMounted(() => {
  observe(presenter, 'modalOpen', () => {
    state.modalOpen = presenter.modalOpen
  })
})
</script>

<!-- After (Bridge) -->
<template>
  <div>{{ state.modalOpen }}</div>
</template>

<script setup>
const state = usePresenterState(presenter)
</script>
```

## 💡 Pro Tips

1. **Use auto-detection by default** - `usePresenterState(presenter)` handles everything
2. **Specify properties only when needed** - for performance optimization
3. **Enable debouncing for high-frequency updates** - search inputs, etc.
4. **Deep copying is always enabled** - MobX observables are automatically converted to plain JS objects
5. **Start simple, optimize later** - auto-detection is fast enough for most cases

This universal bridge gives you the flexibility to use MobX with Vue in the most convenient way for your specific use case!
