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
              <label class="form-label">First Name</label>
              <input 
                v-model="state.form.firstName" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.firstName }"
                @input="presenter.updateForm('firstName', $event.target.value)"
                required 
              />
              <div v-if="state.errors.firstName" class="invalid-feedback">
                {{ state.errors.firstName }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Last Name</label>
              <input 
                v-model="state.form.lastName" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.lastName }"
                @input="presenter.updateForm('lastName', $event.target.value)"
                required 
              />
              <div v-if="state.errors.lastName" class="invalid-feedback">
                {{ state.errors.lastName }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input 
                v-model="state.form.email" 
                type="email"
                class="form-control" 
                :class="{ 'is-invalid': state.errors.email }"
                @input="presenter.updateForm('email', $event.target.value)"
                required 
              />
              <div v-if="state.errors.email" class="invalid-feedback">
                {{ state.errors.email }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Department</label>
              <input 
                v-model="state.form.department" 
                class="form-control" 
                :class="{ 'is-invalid': state.errors.department }"
                @input="presenter.updateForm('department', $event.target.value)"
                required 
              />
              <div v-if="state.errors.department" class="invalid-feedback">
                {{ state.errors.department }}
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Title</label>
              <select 
                v-model="state.form.title" 
                class="form-select" 
                :class="{ 'is-invalid': state.errors.title }"
                @change="presenter.updateForm('title', $event.target.value)"
                required 
              >
                <option value="">Select a title...</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Dr.">Dr.</option>
              </select>
              <div v-if="state.errors.title" class="invalid-feedback">
                {{ state.errors.title }}
              </div>
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
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import { usePresenterState } from '../../../utils/mobxVueBridge'
import container from '../../../di/container'
import { TYPES } from '../../../di/types'

const props = defineProps({
  instructor: Object
})
const emit = defineEmits(['save', 'close'])

const presenter = container.get(TYPES.InstructorModalPresenter)
const state = usePresenterState(presenter)

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
  const instructorData = await presenter.save()
  if (instructorData) {
    emit('save', instructorData)
    hideModal()
  }
}

const handleClose = () => {
  presenter.close()
  hideModal()
}

// Watch for instructor prop changes to open modal
watch(() => props.instructor, async (newInstructor) => {
  if (newInstructor !== undefined) {
    presenter.open(newInstructor)
    showModal()
  }
}, { immediate: true })

onMounted(() => {
  // Modal will be shown when instructor prop is set
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})
</script>
