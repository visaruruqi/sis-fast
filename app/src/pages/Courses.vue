<template>
  <Layout>
    <div class="d-flex justify-content-between mb-3">
      <h3>Courses</h3>
      <button class="btn btn-primary" @click="openModal">Add Course</button>
    </div>
    <input v-model="search" class="form-control mb-3" placeholder="Search" />
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Credits</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in paginated" :key="c.id">
          <td><router-link :to="`/courses/${c.id}`">{{ c.name }}</router-link></td>
          <td>{{ c.code }}</td>
          <td>{{ c.credits }}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-2" @click="edit(c)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="remove(c)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <nav aria-label="Course pages" class="mt-2">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="page--" :disabled="page === 1">Previous</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="page++" :disabled="page === totalPages">Next</button>
        </li>
      </ul>
    </nav>
    <CourseModal v-model="modalOpen" :course="selected" @save="save" />
  </Layout>
</template>

<script setup>
import { ref, computed, watch, defineAsyncComponent } from 'vue'
import Layout from '../components/Layout.vue'
import store from '../store'

const search = ref('')
const modalOpen = ref(false)
const selected = ref(null)
const page = ref(1)
const pageSize = 10

const CourseModal = defineAsyncComponent(() => import('../components/CourseModal.vue'))

const filteredCourses = computed(() => {
  return store.courses.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()))
})

const totalPages = computed(() => Math.ceil(filteredCourses.value.length / pageSize))

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredCourses.value.slice(start, start + pageSize)
})

watch(filteredCourses, () => {
  if (page.value > totalPages.value) page.value = totalPages.value || 1
})

const openModal = () => {
  selected.value = null
  modalOpen.value = true
}

const edit = (c) => {
  selected.value = { ...c }
  modalOpen.value = true
}

const save = (data) => {
  if (data.id) {
    const idx = store.courses.findIndex(c => c.id === data.id)
    store.courses[idx] = data
  } else {
    data.id = 'crs' + Math.random().toString().slice(2,8)
    store.courses.push(data)
  }
}

const remove = (c) => {
  store.courses = store.courses.filter(cs => cs.id !== c.id)
}
</script>
