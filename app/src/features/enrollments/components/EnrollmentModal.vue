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
            <!-- General Error Message -->
            <div v-if="state.errors.general" class="alert alert-danger" role="alert">
              {{ state.errors.general }}
            </div>

            <div class="mb-3">
              <label class="form-label">Course</label>
              <select 
                v-model="state.form.courseId" 
                class="form-select"
                :class="{ 'is-invalid': state.errors.courseId }"
                @change="presenter.updateForm('courseId', $event.target.value)"
                required
              >
                <option value="" disabled>Select a course</option>
                <option v-for="c in courseState.courses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
              <div v-if="state.errors.courseId" class="invalid-feedback">
                {{ state.errors.courseId }}
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Semester</label>
              <select 
                v-model="state.form.semester" 
                class="form-select"
                :class="{ 'is-invalid': state.errors.semester }"
                @change="presenter.updateForm('semester', $event.target.value)"
                required
              >
                <option value="" disabled>Select semester</option>
                <option v-for="s in state.availableSemesters" :key="s" :value="s">{{ s }}</option>
              </select>
              <div v-if="state.errors.semester" class="invalid-feedback">
                {{ state.errors.semester }}
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" @click="handleClose">Cancel</button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="state.isSubmitting || !state.isFormValid"
              >
                <span v-if="state.isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ state.isSubmitting ? 'Enrolling...' : 'Enroll Student' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import { usePresenterState } from '../../../utils/mobxVueBridge'
import container from '../../../di/container'
import { TYPES } from '../../../di/types'

const props = defineProps({
  studentId: String
})
const emit = defineEmits(['close'])

// Get the enrollment modal presenter
const presenter = container.get(TYPES.EnrollmentModalPresenter)
const state = usePresenterState(presenter)

// Get the course repository to access course data
const courseRepository = container.get(TYPES.CourseRepository)
const courseState = usePresenterState(courseRepository)

const modalRef = ref()
let modal = null

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
  await presenter.save()
  hideModal()
}

const handleClose = () => {
  presenter.close()
  hideModal()
}

// Watch for studentId prop changes to open modal
watch(() => props.studentId, (newStudentId) => {
  if (newStudentId) {
    presenter.open(newStudentId)
    showModal()
  }
}, { immediate: true })

onMounted(() => {
  // Modal will be shown when studentId prop is set
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})
</script>
