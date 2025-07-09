<template>
  <Layout>
    <div class="d-flex justify-content-between mb-3">
      <h3>Students</h3>
      <button class="btn btn-primary" @click="openModal">Add Student</button>
    </div>
    <input v-model="search" class="form-control mb-3" placeholder="Search" />
    <table class="table table-striped">
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in filtered" :key="s.id">
          <td><router-link :to="`/students/${s.id}`">{{ s.firstName }}</router-link></td>
          <td>{{ s.lastName }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.status }}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-2" @click="edit(s)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="archive(s)">Archive</button>
          </td>
        </tr>
      </tbody>
    </table>
    <StudentModal v-model="modalOpen" :student="selected" @save="save" />
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import Layout from '../components/Layout.vue'
import StudentModal from '../components/StudentModal.vue'
import store from '../store'

const search = ref('')
const modalOpen = ref(false)
const selected = ref(null)

const filtered = computed(() => {
  return store.students.filter(s => {
    if (s.status === 'Archived') return false
    return (
      s.firstName.toLowerCase().includes(search.value.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.value.toLowerCase())
    )
  })
})

const openModal = () => {
  selected.value = null
  modalOpen.value = true
}

const edit = (s) => {
  selected.value = { ...s }
  modalOpen.value = true
}

const save = (data) => {
  if (data.id) {
    const idx = store.students.findIndex(st => st.id === data.id)
    store.students[idx] = data
  } else {
    data.id = 'stu' + Math.random().toString().slice(2,8)
    store.students.push(data)
  }
}

const archive = (s) => {
  s.status = 'Archived'
}
</script>
