import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../components/mainPage.vue'
import PracticePage from '../components/PracticePage.vue'
import ExamPage from '../components/ExamPage.vue'
import ResultsPage from '../components/ResultsPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/practice', component: PracticePage },
  { path: '/exams', component: ExamPage },
  { path: '/results', component: ResultsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router