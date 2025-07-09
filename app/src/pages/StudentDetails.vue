<template>
  <Layout>
    <div v-if="student">
      <h3>{{ student.firstName }} {{ student.lastName }}</h3>
      <p>Email: {{ student.email }}</p>
      <p>Status: {{ student.status }}</p>

      <button class="btn btn-primary mb-3" @click="showEnroll=true">Enroll in Course</button>
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
          <tr v-for="e in studentEnrollments" :key="e.id">
            <td>{{ courseName(e.courseId) }}</td>
            <td>{{ e.semester }}</td>
            <td>{{ e.grade }}</td>
          </tr>
        </tbody>
      </table>
      <EnrollmentModal v-model="showEnroll" :studentId="id" @save="enroll" />
    </div>
  </Layout>
</template>
<script setup>

import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '../components/Layout.vue'
import EnrollmentModal from '../components/EnrollmentModal.vue'
import store from '../store'

const route = useRoute()
const id = route.params.id

const showEnroll = ref(false)
const student = computed(() => store.students.find(s => s.id === id))
const studentEnrollments = computed(() => store.enrollments.filter(e => e.studentId === id))

const courseName = (cid) => {
  const c = store.courses.find(c => c.id === cid)
  return c ? c.name : ''
}

const enroll = (data) => {
  data.id = 'enr' + Math.random().toString().slice(2,8)
  store.enrollments.push(data)
}
</script>
