<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Edit Student' : 'Add Student' }}</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label class="form-label">First Name</label>
              <input v-model="form.firstName" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Last Name</label>
              <input v-model="form.lastName" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="form.email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select v-model="form.status" class="form-select">
                <option>Active</option>
                <option>Archived</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Save</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

const props = defineProps({
  modelValue: Boolean,
  student: Object
})
const emit = defineEmits(['update:modelValue', 'save'])

const form = reactive({
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  status: 'Active'
})
const modalRef = ref()
let modal

const isEdit = computed(() => !!props.student)

watch(() => props.modelValue, (val) => {
  if (val) show(); else hide();
})

const show = () => {
  if (!modal) modal = new bootstrap.Modal(modalRef.value)
  if (props.student) Object.assign(form, props.student)
  modal.show()
}

const hide = () => {
  modal.hide()
  emit('update:modelValue', false)
}

const save = () => {
  emit('save', { ...form })
  hide()
}

onMounted(() => {
  modal = new bootstrap.Modal(modalRef.value)
})
</script>
