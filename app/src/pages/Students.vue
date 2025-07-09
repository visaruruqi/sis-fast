<template>
  <Observer>
    <Layout>
      <div class="d-flex justify-content-between mb-3">
        <h3>Students</h3>
        <button class="btn btn-primary" @click="presenter.openModal()">Add Student</button>
      </div>
      <input v-model="presenter.search" class="form-control mb-3" placeholder="Search" />
      <table class="table table-striped">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in presenter.filtered" :key="s.id">
          <td><router-link :to="`/students/${s.id}`">{{ s.firstName }}</router-link></td>
          <td>{{ s.lastName }}</td>
          <td>{{ s.email }}</td>
          <td>{{ s.status }}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-2" @click="presenter.openModal(s)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="presenter.archive(s)">Archive</button>
          </td>
        </tr>
      </tbody>
    </table>
    <StudentModal v-model="presenter.modalOpen" :student="presenter.selected" @save="presenter.save" />
    </Layout>
  </Observer>
</template>

<script setup>
import Layout from '../components/Layout.vue'
import StudentModal from '../components/StudentModal.vue'
import { Observer } from 'mobx-vue-lite'
import container from '../di/container'
import { TYPES } from '../di/types'

const presenter = container.get(TYPES.StudentsPresenter)
</script>
