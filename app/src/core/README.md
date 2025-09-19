# Core Architecture Components

This directory contains the foundational classes and utilities that provide common functionality across the entire application, following the Fast Test Architecture pattern.

## 🏗️ Base Classes

### BaseRepository
**Purpose**: Abstract base class for all repositories
**Location**: `BaseRepository.js`

**Features**:
- Common loading state management (`isLoading`, `error`)
- Standardized error handling with `executeWithLoading()`
- MobX observable setup with explicit configuration
- Error clearing and setting utilities

**Usage**:
```javascript
import { BaseRepository } from '../../../core/BaseRepository.js'

export default class StudentRepository extends BaseRepository {
  students = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      students: observable,
      allStudents: computed,
      loadStudents: action,
      save: action
    })
  }

  async loadStudents() {
    return this.executeWithLoading(async () => {
      this.students = await this.gateway.fetchStudents()
    })
  }
}
```

### BasePresenter
**Purpose**: Abstract base class for all presenters
**Location**: `BasePresenter.js`

**Features**:
- Repository state access (`isLoading`, `error`)
- Generic refresh functionality (`refresh()`)
- MobX observable setup with explicit configuration

**Note**: Only contains functionality that is truly generic to ALL presenters. Search, modal, and other specific logic is handled by individual presenters.

**Usage**:
```javascript
import { BasePresenter } from '../../../core/BasePresenter.js'

export default class StudentsPresenter extends BasePresenter {
  search = ''
  selected = null
  modalOpen = false

  constructor(repository) {
    super(repository)
    makeObservable(this, {
      search: observable,
      selected: observable,
      modalOpen: observable,
      filtered: computed,
      setSearch: action,
      clearSearch: action,
      openModal: action,
      closeModal: action,
      save: action,
      archive: action,
      refresh: override  // Use 'override' for methods overridden from base class
    })
  }

  get filtered() {
    if (!this.search) {
      return this.repository.activeStudents
    }
    return this.repository.searchStudents(this.search)
  }

  // Handle search logic specific to this presenter
  setSearch(searchTerm) {
    this.search = searchTerm
  }

  clearSearch() {
    this.search = ''
  }

  // Handle modal logic specific to this presenter
  openModal(student = null) {
    this.selected = student ? { ...student } : null
    this.modalOpen = true
  }

  closeModal() {
    this.modalOpen = false
    this.selected = null
  }

  // Override base class refresh method with specific implementation
  async refresh() {
    await this.repository.loadStudents()
  }
}
```

### BaseGateway
**Purpose**: Abstract base class for all gateways
**Location**: `BaseGateway.js`

**Features**:
- HTTP request helpers (`get`, `post`, `put`, `delete`)
- Common error handling and logging
- Request configuration (headers, base URL)
- Utility methods (`simulateDelay`, `generateId`)

**Usage**:
```javascript
import { BaseGateway } from '../../../core/BaseGateway.js'

export default class StudentGateway extends BaseGateway {
  constructor() {
    super('/api/students')
  }

  async fetchStudents() {
    return this.get('/')
  }

  async createStudent(studentData) {
    return this.post('/', studentData)
  }

  async updateStudent(id, studentData) {
    return this.put(`/${id}`, studentData)
  }

  async deleteStudent(id) {
    return this.delete(`/${id}`)
  }
}
```

## 📋 Constants

### Application Constants
**Purpose**: Centralized constants to eliminate magic strings and numbers
**Location**: `constants.js`

**Categories**:
- **STATUS**: Student/course status values
- **PAGINATION**: Page size and pagination settings
- **VALIDATION**: Field length constraints
- **SEMESTERS**: Available semester options
- **GENDER**: Gender options
- **API_ENDPOINTS**: API endpoint URLs
- **ERROR_MESSAGES**: Standardized error messages

**Usage**:
```javascript
import { STATUS, PAGINATION, ERROR_MESSAGES } from '../../../core/constants.js'

// Instead of magic strings
if (student.status === 'Active') // ❌ Bad

// Use constants
if (student.status === STATUS.ACTIVE) // ✅ Good
```

## 🔧 MobX Inheritance Patterns

### Key Rules for MobX with Inheritance

1. **Use `makeObservable` with explicit configuration** (not `makeAutoObservable`)
2. **Use `override` annotation** for methods overridden from base classes
3. **Configure observables in both base and derived classes**

### Dependency Injection Scopes

**Repositories**: Singleton scope (permanent state)
```javascript
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(ctx.get(TYPES.StudentGateway))
}).inSingletonScope()  // ✅ Permanent state lives here
```

**Presenters**: Transient scope (no permanent state)
```javascript
container.bind(TYPES.StudentsPresenter).toDynamicValue(ctx => {
  return new StudentsPresenter(ctx.get(TYPES.StudentRepository))
})  // ✅ No .inSingletonScope() - transient instances
```

**Key Principle**: Only repositories hold permanent state. Presenters are transient and should not maintain state between instances.

### Correct Pattern:
```javascript
// BaseRepository.js
export class BaseRepository {
  isLoading = false
  error = null

  constructor(gateway) {
    this.gateway = gateway
    makeObservable(this, {
      isLoading: observable,
      error: observable,
      executeWithLoading: action
    })
  }
}

// StudentRepository.js
export default class StudentRepository extends BaseRepository {
  students = []

  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      students: observable,
      allStudents: computed,
      loadStudents: action,
      save: action
    })
  }
}
```

### Proper Separation Pattern:
```javascript
// BasePresenter.js - Only truly generic functionality
export class BasePresenter {
  constructor(repository) {
    this.repository = repository
    makeObservable(this, {
      isLoading: computed,
      error: computed,
      refresh: action
    })
  }

  get isLoading() {
    return this.repository.isLoading
  }

  get error() {
    return this.repository.error
  }
}

// StudentsPresenter.js - Handles its own specific logic
export default class StudentsPresenter extends BasePresenter {
  search = ''
  selected = null
  modalOpen = false

  constructor(repository) {
    super(repository)
    makeObservable(this, {
      search: observable,
      selected: observable,
      modalOpen: observable,
      setSearch: action,
      clearSearch: action,
      openModal: action,
      closeModal: action,
      save: action
    })
  }

  setSearch(searchTerm) {
    this.search = searchTerm
  }

  openModal(student = null) {
    this.selected = student ? { ...student } : null
    this.modalOpen = true
  }
}
```

## 🚫 Common Mistakes to Avoid

### ❌ Don't use `makeAutoObservable` with inheritance:
```javascript
// This will cause errors
export class StudentRepository extends BaseRepository {
  constructor(gateway) {
    super(gateway)
    makeAutoObservable(this) // ❌ Error: cannot use with superclass
  }
}
```

### ❌ Don't put specific logic in base classes:
```javascript
// This is too specific for a base class
export class BasePresenter {
  search = ''
  
  setSearch(searchTerm) { // ❌ Search logic is too specific - not all presenters need search
    this.search = searchTerm
  }
  
  openModal(item = null) { // ❌ Modal logic is too specific
    this.selected = item
    this.modalOpen = true
  }
}
```

### ✅ Do keep base classes truly generic:
```javascript
// This is correct - only functionality that ALL presenters need
export class BasePresenter {
  constructor(repository) {
    this.repository = repository
    makeObservable(this, {
      isLoading: computed,  // ✅ All presenters need loading state
      error: computed,      // ✅ All presenters need error state
      refresh: action       // ✅ All presenters need refresh capability
    })
  }
}

// Handle specific logic in derived classes
export class StudentsPresenter extends BasePresenter {
  search = ''
  selected = null
  modalOpen = false
  
  constructor(repository) {
    super(repository)
    makeObservable(this, {
      search: observable,
      setSearch: action,    // ✅ Search logic is specific to this presenter
      openModal: action,    // ✅ Modal logic is specific to this presenter
      refresh: override     // ✅ Use 'override' for overridden methods
    })
  }
  
  // Override base class method with specific implementation
  async refresh() {
    await this.repository.loadStudents()
  }
}
```

## 🧪 Testing Base Classes

Base classes should be tested independently:

```javascript
// BaseRepository.test.js
import { BaseRepository } from '../BaseRepository.js'

class TestRepository extends BaseRepository {
  constructor() {
    super({})
  }
}

describe('BaseRepository', () => {
  it('should manage loading state', async () => {
    const repo = new TestRepository()
    expect(repo.isLoading).toBe(false)
    
    const promise = repo.executeWithLoading(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
      return 'result'
    })
    
    expect(repo.isLoading).toBe(true)
    const result = await promise
    expect(result).toBe('result')
    expect(repo.isLoading).toBe(false)
  })
})
```

## 📈 Benefits

### Code Reduction
- **BaseRepository**: Eliminates ~50 lines per repository
- **BasePresenter**: Eliminates ~30 lines per presenter
- **BaseGateway**: Eliminates ~40 lines per gateway
- **Constants**: Eliminates magic strings throughout codebase

### Consistency
- Standardized error handling across all repositories
- Consistent modal management across all presenters
- Uniform loading state management

### Maintainability
- Changes to base classes affect all derived classes
- Centralized configuration and constants
- Clear inheritance patterns

### Testability
- Base classes can be tested independently
- Derived classes inherit tested functionality
- Easy to mock base class behavior

## 🔄 Migration Guide

### From Individual Classes to Base Classes

1. **Identify common patterns** in existing repositories/presenters
2. **Extract common functionality** to base classes
3. **Update derived classes** to extend base classes
4. **Use explicit MobX configuration** with `makeObservable`
5. **Use `override` annotation** for overridden methods
6. **Replace magic strings** with constants
7. **Run tests** to ensure no functionality is broken

### Example Migration:
```javascript
// Before
export default class StudentRepository {
  isLoading = false
  error = null
  
  constructor(gateway) {
    this.gateway = gateway
    makeAutoObservable(this)
  }
  
  async loadStudents() {
    this.isLoading = true
    this.error = null
    try {
      this.students = await this.gateway.fetchStudents()
    } catch (error) {
      this.error = error.message
    } finally {
      this.isLoading = false
    }
  }
}

// After
export default class StudentRepository extends BaseRepository {
  students = []
  
  constructor(gateway) {
    super(gateway)
    makeObservable(this, {
      students: observable,
      loadStudents: action
    })
  }
  
  async loadStudents() {
    return this.executeWithLoading(async () => {
      this.students = await this.gateway.fetchStudents()
    })
  }
}
```

This migration reduces code by ~40 lines while maintaining the same functionality and improving consistency.
