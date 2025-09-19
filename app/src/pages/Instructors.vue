<template>
  <Layout>
    <h3 class="mb-3">Instructors</h3>
    <ul class="list-group">
      <li v-for="i in instructors" :key="i" class="list-group-item">
        {{ i }}
      </li>
    </ul>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import Layout from '../components/Layout.vue'
import { usePresenterState } from '../utils/mobxVueBridge'
import container from '../di/container'
import { TYPES } from '../di/types'

// Get the course repository to access course data
const courseRepository = container.get(TYPES.CourseRepository)
const state = usePresenterState(courseRepository)

// Extract unique instructor names from courses
const instructors = computed(() => {
  const names = new Set(state.courses.map(c => c.instructor))
  return Array.from(names)
})
</script>
