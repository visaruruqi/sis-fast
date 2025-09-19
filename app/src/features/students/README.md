# Students Feature

This feature contains all student-related functionality following the Fast Test Architecture.

## 📁 Structure

```
students/
├── components/          # Student-specific UI components
│   └── StudentModal.vue
├── presenters/          # Business logic and view state
│   ├── StudentsPresenter.js
│   └── StudentModalPresenter.js
├── repositories/        # Data access layer (Observable stores)
│   └── StudentRepository.js
├── gateways/           # External interface layer
│   └── StudentGateway.js
├── tests/              # Feature-specific tests
│   ├── StudentGateway.test.js
│   └── StudentRepository.test.js
└── README.md           # This file
```

## 🔄 Data Flow

```
StudentModal.vue → StudentModalPresenter → StudentRepository → StudentGateway
Students.vue → StudentsPresenter → StudentRepository → StudentGateway
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
import StudentModal from '../features/students/components/StudentModal.vue'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.StudentsPresenter)
```

### In Tests
```javascript
import StudentRepository from '../repositories/StudentRepository.js'
import StudentGateway from '../gateways/StudentGateway.js'
```

## 🎯 Benefits

- **Easy to find**: All student-related code in one place
- **Easy to modify**: Changes are localized to this feature
- **Easy to test**: Each layer can be tested independently
- **Easy to track**: Clear separation of concerns
