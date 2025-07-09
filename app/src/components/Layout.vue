<template>
  <div class="d-flex">
    <Sidebar />
    <div class="flex-grow-1 p-3">
      <slot />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>
