# Enrollments Feature

This feature contains all enrollment-related functionality following the Fast Test Architecture.

## 📁 Structure

```
enrollments/
├── components/          # Enrollment-specific UI components
│   └── EnrollmentModal.vue
├── presenters/          # Business logic and view state
│   └── EnrollmentModalPresenter.js
├── repositories/        # Data access layer (Observable stores)
│   └── EnrollmentRepository.js
├── gateways/           # External interface layer
│   └── EnrollmentGateway.js
├── tests/              # Feature-specific tests
│   └── EnrollmentGateway.test.js
└── README.md           # This file
```

## 🔄 Data Flow

```
EnrollmentModal.vue → EnrollmentModalPresenter → EnrollmentRepository → EnrollmentGateway
```

## 🧪 Testing

Each layer can be tested independently:

- **Gateway Tests**: Mock external API calls
- **Repository Tests**: Mock gateway, test data logic
- **Presenter Tests**: Mock repository, test business logic
- **Component Tests**: Mock presenter, test UI behavior

## 📝 Usage

### In Pages
```javascript
import EnrollmentModal from '../features/enrollments/components/EnrollmentModal.vue'
import { TYPES } from '../di/types'

const enrollmentRepository = container.get(TYPES.EnrollmentRepository)
const enrollmentState = usePresenterState(enrollmentRepository)
```

### In Tests
```javascript
import EnrollmentRepository from '../repositories/EnrollmentRepository.js'
import EnrollmentGateway from '../gateways/EnrollmentGateway.js'
```

## 🎯 Benefits

- **Easy to find**: All enrollment-related code in one place
- **Easy to modify**: Changes are localized to this feature
- **Easy to test**: Each layer can be tested independently
- **Easy to track**: Clear separation of concerns

## 🔧 Features

### EnrollmentModalPresenter
- Form validation with error handling
- Duplicate enrollment prevention
- Loading states during save operations
- Clean form reset on close

### EnrollmentRepository
- Observable enrollment data store
- CRUD operations with error handling
- Student and course enrollment queries
- Enrollment statistics
- Duplicate enrollment checking

### EnrollmentGateway
- API communication layer
- Data transformation
- Network error handling
- Simulated API responses for development

## 🚀 Integration

The enrollment feature integrates with:
- **StudentRepository**: For student data validation
- **CourseRepository**: For course data in enrollment forms
- **Global Store**: For course data (temporary during migration)

## 📊 Data Model

```javascript
{
  id: 'enr001',
  studentId: 'stu001',
  courseId: 'crs001',
  semester: 'Fall 2024',
  grade: 'A' // Empty string for new enrollments
}
```
