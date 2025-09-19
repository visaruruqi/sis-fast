# Fast Test Architecture

This project implements the **Fast Test Architecture** (also known as Clean Architecture or Hexagonal Architecture), which provides excellent separation of concerns, testability, and maintainability.

## 🏗️ Architecture Overview

```
┌─────────────────┐
│   Vue Component │ ← UI Layer
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Presenter     │ ← Business Logic Layer
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Repository    │ ← Data Access Layer (Observable Store)
└─────────┬───────┘
          │
┌─────────▼───────┐
│   Gateway       │ ← External Interface Layer
└─────────────────┘
```

## 🔄 Data Flow

### **Unidirectional Flow:**
1. **Component** → **Presenter** → **Repository** → **Gateway**
2. **Data flows back:** Gateway → Repository → Presenter → Component

### **Key Principles:**
- **Layer Decoupling**: Each layer only knows about the layer below it
- **Observable Repositories**: Repositories are MobX observables that notify presenters of changes
- **Presenter as ViewModel**: Presenters manage view state and business logic
- **Dependency Injection**: All dependencies are injected via InversifyJS

## 📁 Layer Responsibilities

### **1. Vue Component Layer**
- **Purpose**: UI rendering and user interaction
- **Responsibilities**:
  - Render UI based on presenter state
  - Handle user events (clicks, form inputs)
  - Display loading states and errors
- **Dependencies**: Only knows about Presenter
- **Example**: `Students.vue`, `StudentModal.vue`

### **2. Presenter Layer**
- **Purpose**: Business logic and view state management
- **Responsibilities**:
  - Manage view state (modals, forms, search)
  - Handle business logic and validation
  - Coordinate with repositories
  - Transform data for UI consumption
- **Dependencies**: Only knows about Repository
- **Example**: `StudentsPresenter`, `StudentModalPresenter`

### **3. Repository Layer (Observable Store)**
- **Purpose**: Data management and caching
- **Responsibilities**:
  - Store and manage application data
  - Provide computed properties (filtered, active, etc.)
  - Handle data persistence operations
  - Notify presenters of data changes (MobX observables)
- **Dependencies**: Only knows about Gateway
- **Example**: `StudentRepository`, `CourseRepository`

### **4. Gateway Layer**
- **Purpose**: External interface abstraction
- **Responsibilities**:
  - Abstract external APIs, databases, or services
  - Handle network requests and data transformation
  - Provide consistent interface regardless of external implementation
- **Dependencies**: None (pure functions)
- **Example**: `StudentGateway`, `CourseGateway`

## 🧪 Fast Test Architecture Benefits

### **1. Easy Mocking & Stubbing**
```javascript
// Mock Gateway for Repository tests
const mockGateway = {
  fetchStudents: vi.fn().mockResolvedValue(mockStudents)
}

// Mock Repository for Presenter tests
const mockRepository = {
  students: mockStudents,
  save: vi.fn(),
  archive: vi.fn()
}
```

### **2. Isolated Testing**
- **Gateway Tests**: Test API integration without database
- **Repository Tests**: Test data logic without external dependencies
- **Presenter Tests**: Test business logic without UI
- **Component Tests**: Test UI without business logic

### **3. Scenario Testing**
```javascript
// Test different data scenarios easily
const scenarios = [
  { status: 'Active', expected: 'Active' },
  { status: 'Archived', expected: 'Archived' }
]

scenarios.forEach(({ status, expected }) => {
  // Test with different data states
})
```

### **4. Dependency Injection Benefits**
- Swap implementations for testing
- Mock dependencies at any level
- Test with different configurations
- Easy to create test doubles

## 🔧 Implementation Details

### **MobX Integration**
- **Repositories**: `makeAutoObservable()` for reactive data
- **Presenters**: `makeAutoObservable()` for reactive state
- **Components**: `usePresenterState()` for Vue-MobX bridge

### **Dependency Injection**
```javascript
// Types definition
export const TYPES = {
  StudentGateway: Symbol('StudentGateway'),
  StudentRepository: Symbol('StudentRepository'),
  StudentsPresenter: Symbol('StudentsPresenter')
}

// Container binding
container.bind(TYPES.StudentRepository).toDynamicValue(ctx => {
  return new StudentRepository(ctx.get(TYPES.StudentGateway))
}).inSingletonScope()
```

### **Error Handling**
- **Gateway**: Handle network/API errors
- **Repository**: Handle data validation and persistence errors
- **Presenter**: Handle business logic errors
- **Component**: Display user-friendly error messages

## 📝 Example: Student Management Flow

### **1. User clicks "Add Student"**
```javascript
// Component
<button @click="handleAddStudent">Add Student</button>

function handleAddStudent() {
  presenter.openModal() // Presenter manages modal state
}
```

### **2. Presenter opens modal**
```javascript
// Presenter
openModal(student = null) {
  this.selected = student ? { ...student } : null
  this.modalOpen = true // Observable state change
}
```

### **3. User fills form and saves**
```javascript
// Component
<form @submit.prevent="handleSave">
  <input v-model="state.form.firstName" />
  <button type="submit">Save</button>
</form>

async handleSave() {
  await presenter.save(state.form) // Presenter handles business logic
}
```

### **4. Presenter validates and saves**
```javascript
// Presenter
async save(studentData) {
  await this.repository.save(studentData) // Repository handles persistence
  this.closeModal()
}
```

### **5. Repository persists data**
```javascript
// Repository
async save(student) {
  // Validation
  Guard.Against.NullOrWhiteSpace(student.firstName, 'firstName')
  
  // Persistence
  if (student.id) {
    this.students[idx] = student // Observable change
  } else {
    this.students.push(student) // Observable change
  }
}
```

### **6. Gateway handles external call**
```javascript
// Gateway
async createStudent(student) {
  return fetch('/api/students', {
    method: 'POST',
    body: JSON.stringify(student)
  }).then(r => r.json())
}
```

## 🎯 Testing Strategy

### **Unit Tests**
- **Gateway**: Mock external dependencies
- **Repository**: Mock gateway, test data logic
- **Presenter**: Mock repository, test business logic
- **Component**: Mock presenter, test UI behavior

### **Integration Tests**
- **Repository + Gateway**: Test data flow
- **Presenter + Repository**: Test business logic integration
- **Component + Presenter**: Test UI integration

### **E2E Tests**
- **Full Flow**: Test complete user workflows
- **Real Data**: Test with actual API/database

## 🚀 Benefits Summary

1. **Fast Testing**: Each layer can be tested independently
2. **Easy Mocking**: Dependencies are injected and easily mockable
3. **Maintainable**: Clear separation of concerns
4. **Scalable**: Easy to add new features following the same pattern
5. **Testable**: Business logic is separated from UI and external dependencies
6. **Flexible**: Easy to swap implementations (e.g., different APIs, databases)

This architecture ensures that your code is not only well-structured but also highly testable, making it easy to maintain and extend over time.
