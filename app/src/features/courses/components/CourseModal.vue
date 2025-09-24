<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ state.modalTitle }}</h5>
          <button type="button" class="btn-close" @click="handleClose"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSave">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input 
                v-model="state.form.name" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.name }"
                @input="presenter.updateForm('name', $event.target.value)"
                required 
              />
              <div v-if="state.errors.name" class="invalid-feedback">
                {{ state.errors.name }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Code</label>
              <input 
                v-model="state.form.code" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.code }"
                @input="presenter.updateForm('code', $event.target.value)"
                required 
              />
              <div v-if="state.errors.code" class="invalid-feedback">
                {{ state.errors.code }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Credits</label>
              <input 
                v-model.number="state.form.credits" 
                type="number" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.credits }"
                @input="presenter.updateForm('credits', parseInt($event.target.value))"
                required 
              />
              <div v-if="state.errors.credits" class="invalid-feedback">
                {{ state.errors.credits }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Instructor</label>
              <select 
                v-model="state.form.instructorId" 
                class="form-select" 
                :class="{ 'is-invalid': state.errors.instructorId }"
                @change="presenter.updateForm('instructorId', $event.target.value)"
                required 
              >
                <option value="">Select an instructor...</option>
                <option 
                  v-for="option in instructorOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div v-if="state.errors.instructorId" class="invalid-feedback">
                {{ state.errors.instructorId }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea 
                v-model="state.form.description" 
                class="form-control" 
                rows="3"
                @input="presenter.updateForm('description', $event.target.value)"
              ></textarea>
            </div>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="state.isSubmitting"
            >
              {{ state.isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import { usePresenterState } from '../../../utils/mobxVueBridge'
import container from '../../../di/container'
import { TYPES } from '../../../di/types'

const props = defineProps({
  course: Object
})
const emit = defineEmits(['save', 'close'])

const presenter = container.get(TYPES.CourseModalPresenter)
const state = usePresenterState(presenter)

const modalRef = ref()
let modal = null

// Get instructor options from presenter (following Clean Architecture)
const instructorOptions = computed(() => {
  console.log('Instructor options in Vue:', state.instructorOptions)
  return state.instructorOptions || []
})

const showModal = async () => {
  await nextTick()
  if (!modal && modalRef.value) {
    modal = new bootstrap.Modal(modalRef.value, {
      backdrop: 'static',
      keyboard: false
    })
    
    // Listen for modal hide events
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      presenter.close()
      emit('close')
    })
  }
  
  if (modal) {
    modal.show()
  }
}

const hideModal = () => {
  if (modal) {
    modal.hide()
  }
}

const handleSave = async () => {
  const courseData = await presenter.save()
  if (courseData) {
    emit('save', courseData)
    hideModal()
  }
}

const handleClose = () => {
  presenter.close()
  hideModal()
}

// Watch for course prop changes to open modal
watch(() => props.course, async (newCourse) => {
  if (newCourse !== undefined) {
    await presenter.open(newCourse)
    showModal()
  }
}, { immediate: true })

onMounted(() => {
  // Modal will be shown when course prop is set
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})
</script>
