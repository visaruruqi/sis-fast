<template>
  <div class="container mt-5 mx-auto text-start" style="max-width: 400px;">
    <div class="text-center">
      <img src="/vite.svg" alt="logo" width="80" class="mb-3" />
      <h3>SIS Login</h3>
    </div>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" required />
      </div>
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
  if (username.value && password.value) {
    localStorage.setItem('auth', 'true')
    router.push('/students')
  }
}
</script>
