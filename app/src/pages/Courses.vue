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
        <tr v-for="c in filtered" :key="c.id">
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
    <CourseModal v-model="modalOpen" :course="selected" @save="save" />
  </Layout>
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import Layout from '../components/Layout.vue'
import store from '../store'

const search = ref('')
const modalOpen = ref(false)
const selected = ref(null)

const CourseModal = defineAsyncComponent(() => import('../components/CourseModal.vue'))

const filtered = computed(() => {
  return store.courses.filter(c => c.name.toLowerCase().includes(search.value.toLowerCase()))
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
