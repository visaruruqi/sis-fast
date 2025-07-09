<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Enroll Student</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label class="form-label">Course</label>
              <select v-model="form.courseId" class="form-select" required>
                <option v-for="c in store.courses" :key="c.id" :value="c.id">{{ c.name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Semester</label>
              <input v-model="form.semester" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'
import store from '../store'

const props = defineProps({
  modelValue: Boolean,
  studentId: String
})
const emit = defineEmits(['update:modelValue', 'save'])

const form = reactive({
  courseId: '',
  semester: ''
})

const modalRef = ref()
let modal

watch(() => props.modelValue, (val) => {
  if (val) show(); else hide();
})

const show = () => {
  if (!modal) modal = new bootstrap.Modal(modalRef.value)
  form.courseId = store.courses[0]?.id || ''
  form.semester = ''
  modal.show()
}

const hide = () => {
  modal.hide()
  emit('update:modelValue', false)
}

const save = () => {
  emit('save', { ...form, studentId: props.studentId })
  hide()
}

onMounted(() => {
  modal = new bootstrap.Modal(modalRef.value)
})
</script>
