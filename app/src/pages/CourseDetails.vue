<template>
  <Layout>
    <div v-if="state.isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p>Loading course details...</p>
      <p><strong>Debug:</strong> isLoading = {{ state.isLoading }} (type: {{ typeof state.isLoading }})</p>
    </div>
    
    <div v-else-if="state.error" class="alert alert-danger">
      <h4>Error loading course details</h4>
      <p>{{ state.error }}</p>
      <button class="btn btn-primary" @click="presenter.refresh()">Retry</button>
    </div>
    
    <div v-else-if="state.course">
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
    
    <div v-else class="alert alert-warning">
      <h4>Course not found</h4>
      <p>No course found with ID: {{ id }}</p>
      <router-link to="/courses" class="btn btn-primary">Back to Courses</router-link>
    </div>
    
    <!-- Debug section -->
    <div class="mt-4 p-3 bg-light">
      <h5>Debug Info:</h5>
      <p><strong>state.isLoading:</strong> {{ state.isLoading }}</p>
      <p><strong>presenter.isLoading:</strong> {{ presenter.isLoading }}</p>
      <p><strong>state.course:</strong> {{ state.course ? 'Found' : 'Not found' }}</p>
      <p><strong>state.course value:</strong> {{ JSON.stringify(state.course) }}</p>
      <p><strong>presenter.course:</strong> {{ presenter.course ? 'Found' : 'Not found' }}</p>
      <p><strong>presenter.course value:</strong> {{ JSON.stringify(presenter.course) }}</p>
      <p><strong>state.error:</strong> {{ state.error || 'None' }}</p>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, watch } from 'vue'
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

watch(() => state.course, (newCourse) => {
  console.log('Visar Uruqi: Course changed:', state.course)
})

// Initialize the presenter when component mounts
onMounted(async () => {
  console.log('CourseDetails: Before initialize - isLoading:', state.isLoading)
  console.log('CourseDetails: State keys:', Object.keys(state))
  console.log('CourseDetails: Presenter isLoading:', presenter.isLoading)
  await presenter.initialize(id)
  console.log('CourseDetails: After initialize - isLoading:', state.isLoading)
  console.log('CourseDetails: Presenter isLoading:', presenter.isLoading)
})
</script>
