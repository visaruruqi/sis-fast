<template>
  <Layout>
      <div class="d-flex justify-content-between mb-3">
        <h3>Students</h3>
        <button class="btn btn-primary" @click="handleAddStudent">Add Student</button>
      </div>
      <input v-model="state.search" class="form-control mb-3" placeholder="Search" @input="presenter.search = state.search" />
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
        <tr v-for="s in state.filtered" :key="s.id">
          <td><router-link :to="`/students/${s.id}`">{{ s.firstName }}</router-link></td>
          <td>{{ s.lastName }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.status }}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-2" @click="presenter.openModal(s)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="presenter.archive(s)">Archive</button>
          </td>
        </tr>
      </tbody>
    </table>
    <StudentModal 
      v-if="state.modalOpen" 
      :student="state.selected" 
      :onSave="presenter.save"
      @close="presenter.closeModal" 
    />
  </Layout>
</template>

<script setup>
import Layout from '../components/Layout.vue'
import StudentModal from '../features/students/components/StudentModal.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.StudentsPresenter)
const state = usePresenterState(presenter) // Auto-detects all observable properties!

function handleAddStudent() {
  presenter.openModal()
}

</script>
