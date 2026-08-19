<template>
  <section class="results-page">
    <div class="result-page-exam-info">
      <div class="exam-number-result">
        <p>Broj rjesenih ispita</p>
        <p>4</p>
      </div>
      <div class="exam-length-result">
        <p>Prosječno vrijeme rijesavanja</p>
        <p>6 min</p>
      </div>
      <div class="exam-percentage-result">
        <p>Postotak tocnosti</p>
        <p>50%</p>
      </div>
    </div>

    <div class="exam-stat-chart">
      <h3>Statistika ispita</h3>
      <div class="exam-chart-frontend"></div>
      <div class="exam-chart-backend"></div>
    </div>

    <div class="practice-stat-chart">
      <h3>Statistika vjezbe</h3>
      <div class="practice-chart-frontend"></div>
      <div class="practice-chart-backend"></div>
    </div>

    <div class="stat-details">
      <h3>Ukupni rezultat</h3>
      <div class="practice-results">
        <h4>Vjezbe</h4>
        <div class="practice-info-results">
          <h5>JavaScript front-end</h5>
          <ul class="info-practice-front">
            <li>JavaScript<p>savladano (85%)</p></li>
            <li>DOM<p>solidno (65%)</p></li>
            <li>Frontend framework<p>dovoljno (50%)</p></li>
            <li>Web stranica<p>dovoljno (50%)</p></li>
          </ul>
          <h5>JavaScript back-end</h5>
          <ul class="info-practice-back">
            <li>JavaScript na poslužitelju<p>solidno (60%)</p></li>
            <li>Node.js<p>dovoljno (55%)</p></li>
            <li>Asinkronost<p>nedovoljno (40%)</p></li>
            <li>Event-loop<p>nedovoljno (20%)</p></li>
            <li>Web aplikacija<p>nedovoljno (30%)</p></li>
          </ul>
        </div>
      </div>

      <div class="exam-results">
        <h4>Testovi</h4>
        <div class="exam-info-results">
          <h5>JavaScript front-end</h5>
          <ul class="info-exam-front">
            <li>Osnovna razina<p>savladano (85%)</p></li>
            <li>Umjerena razina<p>solidno (70%)</p></li>
            <li>Napredna razina<p>solidno (65%)</p></li>
          </ul>
          <h5>JavaScript back-end</h5>
          <ul class="info-exam-back">
            <li>Osnovna razina<p>solidno (60%)</p></li>
            <li>Umjerena razina<p>dovoljno (50%)</p></li>
            <li>Napredna razina<p>nedovoljno (40%)</p></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>