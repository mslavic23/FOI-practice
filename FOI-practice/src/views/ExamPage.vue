<template>
  <section class="exams-page">
    <div class="exam-page-exam-info">
      <div class="exam-number-info">
        <p>Ukupno ispita</p>
        <p>6</p>
      </div>
      <div class="exam-length-info">
        <p>Prosječno vrijeme</p>
        <p>2 min</p>
      </div>
      <div class="exam-access-info">
        <p>Broj pokušaja</p>
        <p>∞</p>
      </div>
    </div>
    <div class="exam-page-exams">
      <ul class="exam-category">
        <li>JavaScript u front-end-u
          <ul class="exam-levels-js-front">
            <li><router-link to="/exams/frontend/osnovna">Osnovna razina</router-link></li>
            <li><router-link to="/exams/frontend/umjerena">Umjerena razina</router-link></li>
            <li><router-link to="/exams/frontend/napredna">Napredna razina</router-link></li>
          </ul>
        </li>
        <li>JavaScript u back-end-u
          <ul class="exam-levels-js-back">
            <li><router-link to="/exams/backend/osnovna">Osnovna razina</router-link></li>
            <li><router-link to="/exams/backend/umjerena">Umjerena razina</router-link></li>
            <li><router-link to="/exams/backend/napredna">Napredna razina</router-link></li>
          </ul>
        </li>
      </ul>
    </div>
  </section>
</template>