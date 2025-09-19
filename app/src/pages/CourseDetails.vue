<template>
  <Layout>
    <div v-if="state.course">
      <h3>{{ state.course.name }} ({{ state.course.code }})</h3>
      <p>Credits: {{ state.course.credits }}</p>
      <p>Instructor: {{ state.course.instructor }}</p>

      <h4 class="mt-4">Enrolled Students</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Semester</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in state.courseEnrollments" :key="e.id">
            <td>{{ presenter.getStudentName(e.studentId) }}</td>
            <td>{{ e.semester }}</td>
            <td>{{ e.grade || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const route = useRoute()
const id = route.params.id

// Get the course details presenter
const presenter = container.get(TYPES.CourseDetailsPresenter)
const state = usePresenterState(presenter)

// Initialize the presenter when component mounts
onMounted(async () => {
  await presenter.initialize(id)
})
</script>
