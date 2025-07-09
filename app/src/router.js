import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Students from './pages/Students.vue'
import StudentDetails from './pages/StudentDetails.vue'
import Archived from './pages/Archived.vue'
import Courses from './pages/Courses.vue'
import CourseDetails from './pages/CourseDetails.vue'
import Instructors from './pages/Instructors.vue'

const routes = [
  { path: '/login', component: Login },
  {
    path: '/',
    component: Students,
    meta: { requiresAuth: true }
  },
  {
    path: '/students',
    component: Students,
    meta: { requiresAuth: true }
  },
  {
    path: '/archived',
    component: Archived,
    meta: { requiresAuth: true }
  },
  {
    path: '/students/:id',
    component: StudentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses',
    component: Courses,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id',
    component: CourseDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/instructors',
    component: Instructors,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuth = localStorage.getItem('auth') === 'true'
  if (to.meta.requiresAuth && !isAuth) {
    return '/login'
  }
  if (to.path === '/login' && isAuth) {
    return '/'
  }
})

export default router
