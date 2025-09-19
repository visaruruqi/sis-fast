<template>
  <Layout>
      <div class="d-flex justify-content-between mb-3">
        <h3>Courses</h3>
        <button class="btn btn-primary" @click="handleAddCourse">Add Course</button>
      </div>
      <input v-model="state.search" class="form-control mb-3" placeholder="Search" @input="presenter.search = state.search" />
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Credits</th>
            <th>Instructor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in state.paginated" :key="c.id">
            <td><router-link :to="`/courses/${c.id}`">{{ c.name }}</router-link></td>
            <td>{{ c.code }}</td>
            <td>{{ c.credits }}</td>
            <td>{{ c.instructor }}</td>
            <td>
            <button class="btn btn-sm btn-secondary me-2" @click="handleEditCourse(c)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="presenter.delete(c)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Course pages" class="mt-2">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: state.page === 1 }">
            <button class="page-link" @click="presenter.previousPage()" :disabled="state.page === 1">Previous</button>
          </li>
          <li class="page-item" :class="{ disabled: state.page === state.totalPages }">
            <button class="page-link" @click="presenter.nextPage()" :disabled="state.page === state.totalPages">Next</button>
          </li>
        </ul>
      </nav>
      <CourseModal v-if="state.modalOpen" :course="state.selected" @save="presenter.save" @close="presenter.closeModal" />
  </Layout>
</template>

<script setup>
import Layout from '../components/Layout.vue'
import CourseModal from '../features/courses/components/CourseModal.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.CoursesPresenter)
const state = usePresenterState(presenter) // Auto-detects all observable properties!

function handleAddCourse() {
  presenter.openModal()
}

function handleEditCourse(course) {
  presenter.openModal(course)
}
</script>
