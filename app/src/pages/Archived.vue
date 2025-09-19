<template>
  <Layout>
    <h3 class="mb-3">Archived Students</h3>
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
        <tr v-for="s in archived" :key="s.id">
          <td>{{ s.firstName }}</td>
          <td>{{ s.lastName }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.status }}</td>
          <td>
            <button class="btn btn-sm btn-secondary" @click="restore(s)">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import Layout from '../components/Layout.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

// Get the student repository to access student data
const studentRepository = container.get(TYPES.StudentRepository)
const studentState = usePresenterState(studentRepository)

const archived = computed(() => studentState.archivedStudents)

const restore = async (s) => {
  // Use the repository's restore method if it exists, or implement archive with status change
  await studentRepository.save({ ...s, status: 'Active' })
}
</script>
