<template>
  <section class="main-page">
    <img class="main-hero" src="https://www.ualberta.ca/en/centre-for-teaching-and-learning/media-library/about/1275150-home-redesign-banner-1600x900.jpg" alt="Početna slika">
    <img class="main-intro" src="../assets/foi-programming-qoutes.png" alt="Uvodni citat">
    <div class="main-links">
      <div class="main-link-item">
        <router-link to="/exams" class="image-wrapper">
          <img src="../assets/foi-practice.png" alt="Ispiti">
          <div class="image-center-text">
            <p class="link-title">Ispiti</p>
            <p class="link-desc">Provjeri svoje znanje</p>
          </div>
        </router-link>
      </div>
      <div class="main-link-item">
        <router-link to="/practice" class="image-wrapper">
          <img src="../assets/foi-exams.png" alt="Vježbe">
          <div class="image-center-text">
            <p class="link-title">Vježbe</p>
            <p class="link-desc">Uvježbaj gradivo</p>
          </div>
        </router-link>
      </div>
      <div class="main-link-item">
        <router-link to="/results" class="image-wrapper">
          <img src="../assets/foi-results.png" alt="Rezultati">
          <div class="image-center-text">
            <p class="link-title">Rezultati</p>
            <p class="link-desc">Prati napredak</p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>