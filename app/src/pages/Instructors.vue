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
import store from '../store'

const instructors = computed(() => {
  const names = new Set(store.courses.map(c => c.instructor))
  return Array.from(names)
})
</script>
