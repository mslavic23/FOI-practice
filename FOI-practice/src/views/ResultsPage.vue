<script setup>
import { ref, onMounted, computed} from 'vue'

const ukupnoRijeseno = ref(0)
const prosjecnoVrijeme = ref(0)
const postotakTocnosti = ref(0)
const breakdown = ref([])

const practiceFrontTeme = [
  { kljuc: 'javascript', naziv: 'JavaScript' },
  { kljuc: 'dom', naziv: 'DOM' },
  { kljuc: 'frontendframework', naziv: 'Framework' },
  { kljuc: 'webstranica', naziv: 'Web stranica' },
]
const practiceBackTeme = [
  { kljuc: 'jsposluzitelj', naziv: 'JS poslužitelj' },
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
    const response = await fetch('http://localhost:3000/api/results/summary', { cache: 'no-store' })
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
    const response = await fetch('http://localhost:3000/api/results/breakdown', { cache: 'no-store' })
    breakdown.value = await response.json()
  } catch (error) {
    console.error('Greška pri dohvaćanju breakdowna:', error)
  }
}

onMounted(() => {
  dohvatiSazetak()
  dohvatiBreakdown()
})

const boje = ['#4a90d9', '#50b880', '#f5a623', '#e05d5d', '#9b6dd6', '#3fbfbf', '#d67ab1', '#8a8f99', '#c9a24b']

function sortiranaLista(teme) {
  return teme
    .map(t => ({ naziv: t.naziv, postotak: nadjiPostotak('practice', t.kljuc, 'practice') || 0 }))
    .sort((a, b) => b.postotak - a.postotak)
}

function conicGradient(lista) {
  const ukupno = lista.reduce((zbroj, s) => zbroj + s.postotak, 0)
  if (ukupno === 0) return '#eee'
  let start = 0
  const dijelovi = lista.map((stavka, i) => {
    const kut = (stavka.postotak / ukupno) * 360
    const segment = `${boje[i % boje.length]} ${start}deg ${start + kut}deg`
    start += kut
    return segment
  })
  return `conic-gradient(${dijelovi.join(', ')})`
}

const practiceFrontSorted = computed(() => sortiranaLista(practiceFrontTeme))
const practiceBackSorted = computed(() => sortiranaLista(practiceBackTeme))

function tockeZaLiniju(kategorija) {
  return examRazine.map((razina, i) => {
    const postotak = nadjiPostotak('exam', kategorija, razina) || 0
    const x = i * 250 + 30
    const y = 8 + (164 - (postotak / 100) * 164)
    return { x, y }
  })
}

const lineTockeFrontNiz = computed(() => tockeZaLiniju('frontend'))
const lineTockeBackNiz = computed(() => tockeZaLiniju('backend'))
const lineTockeFront = computed(() => lineTockeFrontNiz.value.map(t => `${t.x},${t.y}`).join(' '))
const lineTockeBack = computed(() => lineTockeBackNiz.value.map(t => `${t.x},${t.y}`).join(' '))
</script>

<template>
  <section class="results-page">
    <div class="result-page-exam-info">
      <div class="exam-number-result">
        <p>Broj riješenih ispita</p>
        <p>{{ ukupnoRijeseno }}</p>
      </div>
      <div class="exam-length-result">
        <p>Prosječno vrijeme rješavanja</p>
        <p>{{ prosjecnoVrijeme }} sek</p>
      </div>
      <div class="exam-percentage-result">
        <p>Postotak točnosti</p>
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
      <h3>Statistika vježbe</h3>
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

      <div class="vjezbe-testovi-grid">
        <div class="practice-results">
          <h4>Vježbe</h4>

          <div class="pie-red">
            <div class="pie-blok">
              <p class="pie-naslov">Front-end</p>
              <div class="pie-krug" :style="{ background: conicGradient(practiceFrontSorted) }"></div>
              <ul class="pie-legenda">
                <li v-for="(stavka, i) in practiceFrontSorted" :key="stavka.naziv">
                  <span class="pie-boja" :style="{ backgroundColor: boje[i % boje.length] }"></span>
                  {{ stavka.naziv }} — {{ stavka.postotak }}%
                </li>
              </ul>
            </div>
            <div class="pie-blok">
              <p class="pie-naslov">Back-end</p>
              <div class="pie-krug" :style="{ background: conicGradient(practiceBackSorted) }"></div>
              <ul class="pie-legenda">
                <li v-for="(stavka, i) in practiceBackSorted" :key="stavka.naziv">
                  <span class="pie-boja" :style="{ backgroundColor: boje[i % boje.length] }"></span>
                  {{ stavka.naziv }} — {{ stavka.postotak }}%
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="exam-results">
          <h4>Testovi</h4>
          <div class="line-chart-wrapper">
            <div class="line-y-os">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            <div class="line-chart-inner">
              <svg viewBox="0 0 550 180" class="line-chart" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="550" y2="0" stroke="#eee" />
                <line x1="0" y1="90" x2="550" y2="90" stroke="#eee" />
                <line x1="0" y1="180" x2="550" y2="180" stroke="#ccc" />

                <polyline :points="lineTockeFront" fill="none" stroke="#4a90d9" stroke-width="3" />
                <polyline :points="lineTockeBack" fill="none" stroke="#50b880" stroke-width="3" />

                <circle v-for="(t, i) in lineTockeFrontNiz" :key="'f'+i" :cx="t.x" :cy="t.y" r="5" fill="#4a90d9" />
                <circle v-for="(t, i) in lineTockeBackNiz" :key="'b'+i" :cx="t.x" :cy="t.y" r="5" fill="#50b880" />
              </svg>
              <div class="line-oznake">
                <span v-for="razina in examRazine" :key="razina">{{ razina }}</span>
              </div>
            </div>
          </div>
          <div class="line-legenda">
            <span><span class="pie-boja" style="background:#4a90d9"></span> Front-end</span>
            <span><span class="pie-boja" style="background:#50b880"></span> Back-end</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>