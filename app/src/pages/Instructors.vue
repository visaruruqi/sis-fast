<template>
  <Layout>
    <div class="d-flex justify-content-between mb-3">
      <h3>Instructors</h3>
      <button class="btn btn-primary" @click="handleAddInstructor">Add Instructor</button>
    </div>
    <input v-model="state.search" class="form-control mb-3" placeholder="Search instructors..." @input="presenter.setSearch(state.search)" />
    <div class="row">
      <div v-for="instructor in state.filtered" :key="instructor.id" class="col-md-6 col-lg-4 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{ instructor.title }} {{ instructor.firstName }} {{ instructor.lastName }}</h5>
            <p class="card-text">
              <strong>Email:</strong> {{ instructor.email }}<br>
              <strong>Department:</strong> {{ instructor.department }}
            </p>
            <div class="btn-group" role="group">
              <button class="btn btn-sm btn-secondary" @click="handleEditInstructor(instructor)">Edit</button>
              <button class="btn btn-sm btn-warning" @click="handleArchiveInstructor(instructor)">Archive</button>
              <button class="btn btn-sm btn-danger" @click="handleDeleteInstructor(instructor)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <InstructorModal v-if="state.modalOpen" :instructor="state.selected" @save="handleSaveInstructor" @close="presenter.closeModal" />
  </Layout>
</template>

<script setup>
import Layout from '../components/Layout.vue'
import InstructorModal from '../features/instructors/components/InstructorModal.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.InstructorsPresenter)
const state = usePresenterState(presenter)

function handleAddInstructor() {
  presenter.openModal()
}

function handleEditInstructor(instructor) {
  presenter.openModal(instructor)
}

function handleSaveInstructor(instructorData) {
  presenter.save(instructorData)
}

async function handleDeleteInstructor(instructor) {
  try {
    await presenter.delete(instructor)
  } catch (error) {
    // Show error message to user
    alert(error.message || 'Failed to delete instructor')
  }
}

async function handleArchiveInstructor(instructor) {
  if (confirm(`Are you sure you want to archive ${instructor.title} ${instructor.firstName} ${instructor.lastName}?`)) {
    try {
      await presenter.archive(instructor)
    } catch (error) {
      alert(error.message || 'Failed to archive instructor')
    }
  }
}
</script>
