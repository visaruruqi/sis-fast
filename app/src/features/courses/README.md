# Courses Feature

This feature contains all course-related functionality following the Fast Test Architecture.

## 📁 Structure

```
courses/
├── components/          # Course-specific UI components
│   └── CourseModal.vue
├── presenters/          # Business logic and view state
│   ├── CoursesPresenter.js
│   └── CourseModalPresenter.js
├── repositories/        # Data access layer (Observable stores)
│   └── CourseRepository.js
├── gateways/           # External interface layer
│   └── CourseGateway.js
├── tests/              # Feature-specific tests (to be added)
└── README.md           # This file
```

## 🔄 Data Flow

```
CourseModal.vue → CourseModalPresenter → CourseRepository → CourseGateway
Courses.vue → CoursesPresenter → CourseRepository → CourseGateway
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
import CourseModal from '../features/courses/components/CourseModal.vue'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.CoursesPresenter)
```

### In Tests
```javascript
import CourseRepository from '../repositories/CourseRepository.js'
import CourseGateway from '../gateways/CourseGateway.js'
```

## 🎯 Benefits

- **Easy to find**: All course-related code in one place
- **Easy to modify**: Changes are localized to this feature
- **Easy to test**: Each layer can be tested independently
- **Easy to track**: Clear separation of concerns
