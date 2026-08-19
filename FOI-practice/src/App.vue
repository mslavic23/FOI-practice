<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import MainPage from './components/mainPage.vue'
import PracticePage from './components/PracticePage.vue'
import ExamPage from './components/ExamPage.vue'
import ResultsPage from './components/ResultsPage.vue'
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <MainPage />
      <PracticePage />
      <ExamsPage />
      <ResultsPage />
    </main>
    <Footer />
  </div>
</template>