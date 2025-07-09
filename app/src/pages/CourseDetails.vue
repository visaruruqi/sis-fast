<template>
  <Layout>
    <div v-if="course">
      <h3>{{ course.name }} ({{ course.code }})</h3>
      <p>Credits: {{ course.credits }}</p>
      <p>Instructor: {{ course.instructor }}</p>

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
          <tr v-for="e in courseEnrollments" :key="e.id">
            <td>{{ studentName(e.studentId) }}</td>
            <td>{{ e.semester }}</td>
            <td>{{ e.grade || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import store from '../store'

const route = useRoute()
const id = route.params.id

const course = computed(() => store.courses.find(c => c.id === id))
const courseEnrollments = computed(() => store.enrollments.filter(e => e.courseId === id))
const studentName = (sid) => {
  const s = store.students.find(s => s.id === sid)
  return s ? `${s.firstName} ${s.lastName}` : ''
}
</script>
