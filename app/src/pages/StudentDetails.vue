<template>
  <Layout>
    <div v-if="state.student">
      <router-link to="/students" class="btn btn-link p-0 mb-2">Back</router-link>
      <h3>{{ state.student.firstName }} {{ state.student.lastName }}</h3>
      <p>Email: {{ state.student.email }}</p>
      <p>Status: {{ state.student.status }}</p>

      <button class="btn btn-primary mb-3" @click="showEnroll = id">Enroll in Course</button>
      <h4 class="mt-4">Enrolled Courses</h4>
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Semester</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in state.studentEnrollments" :key="e.id">
            <td>{{ presenter.getCourseName(e.courseId) }}</td>
            <td>{{ e.semester }}</td>
            <td>{{ e.grade || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <EnrollmentModal 
        v-if="showEnroll" 
        :studentId="showEnroll" 
        @close="showEnroll = null" 
      />
    </div>
  </Layout>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import EnrollmentModal from '../features/enrollments/components/EnrollmentModal.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

const route = useRoute()
const id = route.params.id

// Get the student details presenter
const presenter = container.get(TYPES.StudentDetailsPresenter)
const state = usePresenterState(presenter)

const showEnroll = ref(false)

// No need for enroll callback - EnrollmentModalPresenter handles everything

// Initialize the presenter when component mounts
onMounted(async () => {
  await presenter.initialize(id)
})
</script>
