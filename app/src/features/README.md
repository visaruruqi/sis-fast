# Features

This directory contains all feature-based modules following the Fast Test Architecture pattern.

## 🏗️ Architecture

Each feature follows the same layered architecture:

```
Feature/
├── components/     # UI Components (Vue)
├── presenters/     # Business Logic (MobX)
├── repositories/   # Data Access (Observable Stores)
├── gateways/       # External Interfaces
├── tests/          # Feature Tests
└── README.md       # Feature Documentation
```

## 📁 Current Features

### 🎓 Students
- **Components**: StudentModal.vue
- **Presenters**: StudentsPresenter, StudentModalPresenter
- **Repository**: StudentRepository (Observable)
- **Gateway**: StudentGateway
- **Tests**: Gateway and Repository tests

### 📚 Courses
- **Components**: CourseModal.vue
- **Presenters**: CoursesPresenter, CourseModalPresenter
- **Repository**: CourseRepository (Observable)
- **Gateway**: CourseGateway
- **Tests**: To be added

### 👨‍🏫 Instructors
- **Status**: To be implemented
- **Components**: InstructorModal.vue (planned)
- **Presenters**: InstructorsPresenter, InstructorModalPresenter (planned)
- **Repository**: InstructorRepository (planned)
- **Gateway**: InstructorGateway (planned)

## 🔄 Data Flow

Each feature follows the same unidirectional data flow:

```
Component → Presenter → Repository → Gateway
    ↑         ↑           ↑
    └─────────┴───────────┴── Data flows back
```

## 🧪 Testing Strategy

### Layer Isolation
- **Gateway**: Mock external dependencies
- **Repository**: Mock gateway, test data logic
- **Presenter**: Mock repository, test business logic
- **Component**: Mock presenter, test UI behavior

### Feature Isolation
- Each feature can be tested independently
- No cross-feature dependencies in tests
- Easy to mock entire features for integration tests

## 📝 Adding New Features

1. Create feature directory: `mkdir features/new-feature`
2. Create subdirectories: `components/`, `presenters/`, `repositories/`, `gateways/`, `tests/`
3. Implement layers following the same pattern
4. Add to DI container (`di/container.js`)
5. Add types (`di/types.js`)
6. Create feature README
7. Add tests for each layer

## 🎯 Benefits

### **Easy to Find**
- All related code in one place
- Clear feature boundaries
- Consistent structure across features

### **Easy to Modify**
- Changes are localized to specific features
- No cross-feature dependencies
- Clear impact analysis

### **Easy to Test**
- Each layer can be tested independently
- Feature-specific test organization
- Easy to mock dependencies

### **Easy to Track**
- Clear separation of concerns
- Consistent architecture patterns
- Feature-based documentation

## 🔧 Shared Resources

While features are self-contained, they share:

- **DI Container**: `../di/container.js`
- **Types**: `../di/types.js`
- **Utils**: `../utils/` (MobX-Vue bridge, etc.)
- **Shared Components**: `../components/` (Layout, Sidebar)
- **Pages**: `../pages/` (Route components)

This structure ensures maximum modularity while maintaining consistency and reusability.
