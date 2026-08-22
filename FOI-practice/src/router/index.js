import TestPage from '../views/TestPage.vue'
import PracticeTestPage from '../views/PracticeTestPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import PracticePage from '../views/PracticePage.vue'
import ExamPage from '../views/ExamPage.vue'
import ResultsPage from '../views/ResultsPage.vue'






const routes = [
  { path: '/', component: MainPage },
  { path: '/practice', component: PracticePage },
  { path: '/exams', component: ExamPage },
  { path: '/results', component: ResultsPage },
  { path: '/exams/:kategorija/:razina', component: TestPage },
  { path: '/practice/:tema', component: PracticeTestPage },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
