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
              <label class="form-label">Status</label>
              <select 
                v-model="state.form.status" 
                class="form-select"
                @change="presenter.updateForm('status', $event.target.value)"
              >
                <option>Active</option>
                <option>Archived</option>
              </select>
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
  student: Object,
  onSave: Function
})
const emit = defineEmits(['close'])

const presenter = container.get(TYPES.StudentModalPresenter)
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
  await presenter.save(props.onSave || (() => {}))
  hideModal()
}

const handleClose = () => {
  presenter.close()
  hideModal()
}

// Watch for student prop changes to open modal
watch(() => props.student, (newStudent) => {
  if (newStudent !== undefined) {
    presenter.open(newStudent)
    showModal()
  }
}, { immediate: true })

onMounted(() => {
  // Modal will be shown when student prop is set
})

onUnmounted(() => {
  if (modal) {
    modal.dispose()
  }
})
</script>
