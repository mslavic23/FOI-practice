<script setup>
import { ref, onMounted } from 'vue'

const ukupnoRijeseno = ref(0)
const prosjecnoVrijeme = ref(0)
const postotakTocnosti = ref(0)
const breakdown = ref([])

const practiceFrontTeme = [
  { kljuc: 'javascript', naziv: 'JavaScript' },
  { kljuc: 'dom', naziv: 'DOM' },
  { kljuc: 'frontendframework', naziv: 'Frontend framework' },
  { kljuc: 'webstranica', naziv: 'Web stranica' },
]
const practiceBackTeme = [
  { kljuc: 'jsposluzitelj', naziv: 'JavaScript na poslužitelju' },
  { kljuc: 'nodejs', naziv: 'Node.js' },
  { kljuc: 'eventloop', naziv: 'Event-loop' },
  { kljuc: 'asinkronost', naziv: 'Asinkronost' },
  { kljuc: 'webaplikacija', naziv: 'Web aplikacija' },
]
const examRazine = ['osnovna', 'umjerena', 'napredna']

function nadjiPostotak(tip, kategorija, razina) {
  const stavka = breakdown.value.find(b => b.type === tip && b.category === kategorija && b.level === razina)
  return stavka ? Math.round(stavka.avg_accuracy) : null
}

function oznakaZaPostotak(postotak) {
  if (postotak === null) return 'nema pokušaja'
  if (postotak >= 80) return `savladano (${postotak}%)`
  if (postotak >= 60) return `solidno (${postotak}%)`
  if (postotak >= 40) return `dovoljno (${postotak}%)`
  return `nedovoljno (${postotak}%)`
}

async function dohvatiSazetak() {
  try {
    const response = await fetch('http://localhost:3000/api/results/summary')
    const data = await response.json()
    ukupnoRijeseno.value = data.total_solved || 0
    prosjecnoVrijeme.value = data.avg_time ? Math.round(data.avg_time) : 0
    postotakTocnosti.value = data.avg_accuracy ? Math.round(data.avg_accuracy) : 0
  } catch (error) {
    console.error('Greška pri dohvaćanju sažetka:', error)
  }
}

async function dohvatiBreakdown() {
  try {
    const response = await fetch('http://localhost:3000/api/results/breakdown')
    breakdown.value = await response.json()
  } catch (error) {
    console.error('Greška pri dohvaćanju breakdowna:', error)
  }
}

onMounted(() => {
  dohvatiSazetak()
  dohvatiBreakdown()
})
</script>

<template>
  <section class="results-page">
    <div class="result-page-exam-info">
      <div class="exam-number-result">
        <p>Broj rjesenih ispita</p>
        <p>{{ ukupnoRijeseno }}</p>
      </div>
      <div class="exam-length-result">
        <p>Prosječno vrijeme rijesavanja</p>
        <p>{{ prosjecnoVrijeme }} sek</p>
      </div>
      <div class="exam-percentage-result">
        <p>Postotak tocnosti</p>
        <p>{{ postotakTocnosti }}%</p>
      </div>
    </div>

    <div class="exam-stat-chart">
      <h3>Statistika ispita</h3>
      <div class="chart-stupac">
        <p class="chart-naslov">Front-end</p>
        <div v-for="razina in examRazine" :key="razina" class="chart-red">
          <span class="chart-label">{{ razina }}</span>
          <div class="chart-traka-pozadina">
            <div class="chart-traka" :style="{ width: (nadjiPostotak('exam','frontend',razina) || 0) + '%' }"></div>
          </div>
          <span class="chart-vrijednost">{{ nadjiPostotak('exam','frontend',razina) ?? '-' }}%</span>
        </div>
      </div>
      <div class="chart-stupac">
        <p class="chart-naslov">Back-end</p>
        <div v-for="razina in examRazine" :key="razina" class="chart-red">
          <span class="chart-label">{{ razina }}</span>
          <div class="chart-traka-pozadina">
            <div class="chart-traka" :style="{ width: (nadjiPostotak('exam','backend',razina) || 0) + '%' }"></div>
          </div>
          <span class="chart-vrijednost">{{ nadjiPostotak('exam','backend',razina) ?? '-' }}%</span>
        </div>
      </div>
    </div>

    <div class="practice-stat-chart">
      <h3>Statistika vjezbe</h3>
      <div class="chart-stupac">
        <p class="chart-naslov">Front-end</p>
        <div v-for="tema in practiceFrontTeme" :key="tema.kljuc" class="chart-red">
          <span class="chart-label">{{ tema.naziv }}</span>
          <div class="chart-traka-pozadina">
            <div class="chart-traka" :style="{ width: (nadjiPostotak('practice',tema.kljuc,'practice') || 0) + '%' }"></div>
          </div>
          <span class="chart-vrijednost">{{ nadjiPostotak('practice',tema.kljuc,'practice') ?? '-' }}%</span>
        </div>
      </div>
      <div class="chart-stupac">
        <p class="chart-naslov">Back-end</p>
        <div v-for="tema in practiceBackTeme" :key="tema.kljuc" class="chart-red">
          <span class="chart-label">{{ tema.naziv }}</span>
          <div class="chart-traka-pozadina">
            <div class="chart-traka" :style="{ width: (nadjiPostotak('practice',tema.kljuc,'practice') || 0) + '%' }"></div>
          </div>
          <span class="chart-vrijednost">{{ nadjiPostotak('practice',tema.kljuc,'practice') ?? '-' }}%</span>
        </div>
      </div>
    </div>

    <div class="stat-details">
      <h3>Ukupni rezultat</h3>
      <div class="practice-results">
        <h4>Vjezbe</h4>
        <div class="practice-info-results">
          <h5>JavaScript front-end</h5>
          <ul class="info-practice-front">
            <li v-for="tema in practiceFrontTeme" :key="tema.kljuc">
              {{ tema.naziv }}
              <p>{{ oznakaZaPostotak(nadjiPostotak('practice', tema.kljuc, 'practice')) }}</p>
            </li>
          </ul>
          <h5>JavaScript back-end</h5>
          <ul class="info-practice-back">
            <li v-for="tema in practiceBackTeme" :key="tema.kljuc">
              {{ tema.naziv }}
              <p>{{ oznakaZaPostotak(nadjiPostotak('practice', tema.kljuc, 'practice')) }}</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="exam-results">
        <h4>Testovi</h4>
        <div class="exam-info-results">
          <h5>JavaScript front-end</h5>
          <ul class="info-exam-front">
            <li v-for="razina in examRazine" :key="razina">
              {{ razina }}
              <p>{{ oznakaZaPostotak(nadjiPostotak('exam', 'frontend', razina)) }}</p>
            </li>
          </ul>
          <h5>JavaScript back-end</h5>
          <ul class="info-exam-back">
            <li v-for="razina in examRazine" :key="razina">
              {{ razina }}
              <p>{{ oznakaZaPostotak(nadjiPostotak('exam', 'backend', razina)) }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>