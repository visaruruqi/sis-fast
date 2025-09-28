# SIS-Fast Copilot Instructions

## Architecture Overview
This Vue 3 SPA implements **Fast Test Architecture** (Clean Architecture) with strict layered separation:

```
Vue Component → Presenter → Repository → Gateway
```

**Critical Flow**: Always follow this unidirectional dependency chain. Components never directly access repositories/gateways.

## Core Patterns

### 1. MobX Integration
- **All presenters**: Use `makeObservable()` with explicit property declarations
- **Vue binding**: Use `usePresenterState(presenter)` from `src/utils/mobxVueBridge.js` - auto-detects observables, computeds, and actions
- **Base classes**: Extend `BasePresenter.js` and `BaseRepository.js` for consistent error handling

### 2. Dependency Injection (InversifyJS)
- **Container setup**: All dependencies registered in `src/di/modules/`
- **Component usage**: `const presenter = container.get(TYPES.StudentsPresenter)`
- **Types**: Add new symbols to `src/di/types.js`

### 3. Feature Structure
Each feature in `src/features/{name}/` follows identical structure:
```
components/     # Vue components
presenters/     # MobX business logic  
repositories/   # Observable data stores
gateways/       # API interfaces (currently mock)
tests/          # Vitest unit tests
```

## Development Workflows

### Adding New Features
1. Create folder in `src/features/{feature}/`
2. Add types to `src/di/types.js`
3. Create DI module in `src/di/modules/{feature}.js`
4. Import module in `src/di/container.js`
5. Follow existing patterns in `students/` or `courses/`

### Component Pattern
```vue
<script setup>
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.StudentsPresenter)
const state = usePresenterState(presenter) // Auto-detects all observables
</script>
```

### Presenter Pattern
```javascript
import { BasePresenter } from '../../../core/BasePresenter.js'
import { makeObservable, observable, computed, action } from 'mobx'

export default class FeaturePresenter extends BasePresenter {
  modalOpen = false
  
  constructor(repository) {
    super(repository)
    makeObservable(this, {
      modalOpen: observable,
      openModal: action,
      // Declare ALL observable properties explicitly
    })
  }
}
```

## Testing
- **Framework**: Vitest with jsdom environment
- **Setup**: Global setup in `src/test/setup.js` loads reflect-metadata
- **Mocking**: Mock repositories in tests, not presenters
- **Run tests**: `npm test` (watch mode) or `npm run test:run`

## Key Dependencies
- **MobX**: State management (v6.13.7)
- **InversifyJS**: Dependency injection
- **GuardFlow**: Validation in repositories
- **Bootstrap 5**: UI components
- **Node requirement**: 20.19+ or 22.12+

## Critical Files
- `src/utils/mobxVueBridge.js`: MobX-Vue integration (complex, modify carefully)
- `src/store.js`: Central observable store with mock data
- `src/core/BaseRepository.js`: Error handling with `executeWithLoading()`
- `ARCHITECTURE_GUIDE.md`: Detailed layer explanations

## Anti-Patterns
- ❌ Components accessing repositories directly
- ❌ Using Vue `reactive()` instead of MobX observables
- ❌ Forgetting to declare properties in `makeObservable()`
- ❌ Not extending base classes for presenters/repositories