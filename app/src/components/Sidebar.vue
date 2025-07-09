<template>
  <div class="d-flex flex-column p-3 text-bg-dark" style="width: 200px; height: 100vh;">
    <img src="/vite.svg" alt="logo" width="40" class="mb-2" />
    <h4 class="text-white">SIS</h4>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link class="nav-link text-white" to="/students">Students</router-link>
      </li>
      <li>
        <router-link class="nav-link text-white" to="/courses">Courses</router-link>
      </li>
      <li>
        <router-link class="nav-link text-white" to="/instructors">Instructors</router-link>
      </li>
      <li>
        <router-link class="nav-link text-white" to="/archived">Archived</router-link>
      </li>
    </ul>
    <button class="btn btn-secondary mt-auto" @click="logout">Logout</button>
  </div>
</template>

<script setup>
const logout = () => {
  localStorage.removeItem('auth')
  window.location.href = '/login'
}
</script>
