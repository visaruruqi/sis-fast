# SIS Fast

A modern Student Information System built with Vue 3, MobX, and InversifyJS following **Fast Test Architecture** principles.

## Features

- Student Management
- Course Management
- Instructor Management
- Enrollment System
- Responsive Design

## Tech Stack

- **Frontend**: Vue 3, Vite
- **State Management**: MobX
- **Dependency Injection**: InversifyJS
- **Styling**: Bootstrap 5
- **Testing**: Vitest
- **Architecture**: Fast Test Architecture (Clean Architecture)

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── students/      # Student feature
│   │   ├── components/
│   │   ├── presenters/
│   │   ├── repositories/
│   │   ├── gateways/
│   │   └── tests/
│   ├── courses/       # Course feature
│   └── instructors/   # Instructor feature
├── pages/             # Page components (routes)
├── components/        # Shared components
│   └── shared/       # Reusable UI components
├── di/               # Dependency injection
├── utils/            # Shared utilities
└── test/             # Global test setup
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

4. Run tests with UI:
```bash
npm run test:ui
```

## Architecture

This project follows **Fast Test Architecture** with feature-based organization:

### **Feature Structure**
Each feature contains all related code:
- **Components**: UI layer (Vue components)
- **Presenters**: Business logic and view state management (MobX)
- **Repositories**: Data access and caching (Observable stores)
- **Gateways**: External API and service interfaces
- **Tests**: Feature-specific tests

### **Benefits**
- **Easy to Find**: All related code in one place
- **Easy to Modify**: Changes are localized to specific features
- **Easy to Test**: Each layer can be tested independently
- **Easy to Track**: Clear separation of concerns

### **Data Flow**
```
Component → Presenter → Repository → Gateway
    ↑         ↑           ↑
    └─────────┴───────────┴── Data flows back
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.
