<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? 'Edit Course' : 'Add Course' }}</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="save">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input v-model="form.name" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Code</label>
              <input v-model="form.code" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Credits</label>
              <input v-model.number="form.credits" type="number" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Instructor</label>
              <input v-model="form.instructor" class="form-control" required />
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
  course: Object
})
const emit = defineEmits(['update:modelValue', 'save'])

const form = reactive({
  id: '',
  name: '',
  code: '',
  credits: 0,
  instructor: ''
})
const modalRef = ref()
let modal

const isEdit = computed(() => !!props.course)

watch(() => props.modelValue, (val) => {
  if (val) show(); else hide();
})

const show = () => {
  if (!modal) modal = new bootstrap.Modal(modalRef.value)
  if (props.course) Object.assign(form, props.course)
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
