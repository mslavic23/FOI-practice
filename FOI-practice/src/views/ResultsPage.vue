<script setup>
import { ref, onMounted, computed} from 'vue'

const totalSolved = ref(0)
const avgTime = ref(0)
const accuracyPercentage = ref(0)
const breakdown = ref([])

const practiceFrontTopics = [
  { key: 'javascript', name: 'JavaScript' },
  { key: 'dom', name: 'DOM' },
  { key: 'frontendframework', name: 'Framework' },
  { key: 'webstranica', name: 'Web stranica' },
]
const practiceBackTopics = [
  { key: 'jsposluzitelj', name: 'JS poslužitelj' },
  { key: 'nodejs', name: 'Node.js' },
  { key: 'eventloop', name: 'Event-loop' },
  { key: 'asinkronost', name: 'Asinkronost' },
  { key: 'webaplikacija', name: 'Web aplikacija' },
]
const examLevels = ['osnovna', 'umjerena', 'napredna']

function findPercentage(type, category, level) {
  const item = breakdown.value.find(b => b.type === type && b.category === category && b.level === level)
  return item ? Math.round(item.avg_accuracy) : null
}

function labelForPercentage(percentage) {
  if (percentage === null) return 'nema pokušaja'
  if (percentage >= 80) return `savladano (${percentage}%)`
  if (percentage >= 60) return `solidno (${percentage}%)`
  if (percentage >= 40) return `dovoljno (${percentage}%)`
  return `nedovoljno (${percentage}%)`
}

async function fetchSummary() {
  try {
    const response = await fetch('http://localhost:3000/api/results/summary', { cache: 'no-store' })
    const data = await response.json()
    totalSolved.value = data.total_solved || 0
    avgTime.value = data.avg_time ? Math.round(data.avg_time) : 0
    accuracyPercentage.value = data.avg_accuracy ? Math.round(data.avg_accuracy) : 0
  } catch (error) {
    console.error('Greška pri dohvaćanju sažetka:', error)
  }
}

async function fetchBreakdown() {
  try {
    const response = await fetch('http://localhost:3000/api/results/breakdown', { cache: 'no-store' })
    breakdown.value = await response.json()
  } catch (error) {
    console.error('Greška pri dohvaćanju breakdowna:', error)
  }
}

onMounted(() => {
  fetchSummary()
  fetchBreakdown()
})

const colors = ['#4a90d9', '#50b880', '#f5a623', '#e05d5d', '#9b6dd6', '#3fbfbf', '#d67ab1', '#8a8f99', '#c9a24b']

function sortedList(topics) {
  return topics
    .map(t => ({ name: t.name, percentage: findPercentage('practice', t.key, 'practice') || 0 }))
    .sort((a, b) => b.percentage - a.percentage)
}

function conicGradient(list) {
  const total = list.reduce((sum, item) => sum + item.percentage, 0)
  if (total === 0) return '#eee'
  let start = 0
  const parts = list.map((item, i) => {
    const angle = (item.percentage / total) * 360
    const segment = `${colors[i % colors.length]} ${start}deg ${start + angle}deg`
    start += angle
    return segment
  })
  return `conic-gradient(${parts.join(', ')})`
}

const practiceFrontSorted = computed(() => sortedList(practiceFrontTopics))
const practiceBackSorted = computed(() => sortedList(practiceBackTopics))

function pointsForLine(category) {
  return examLevels.map((level, i) => {
    const percentage = findPercentage('exam', category, level) || 0
    const x = i * 250 + 30
    const y = 8 + (164 - (percentage / 100) * 164)
    return { x, y }
  })
}

const lineFrontPointsArray = computed(() => pointsForLine('frontend'))
const lineBackPointsArray = computed(() => pointsForLine('backend'))
const lineFrontPoints = computed(() => lineFrontPointsArray.value.map(t => `${t.x},${t.y}`).join(' '))
const lineBackPoints = computed(() => lineBackPointsArray.value.map(t => `${t.x},${t.y}`).join(' '))
</script>

<template>
  <section class="results-page">
    <div class="result-page-exam-info">
      <div class="exam-number-result">
        <p>Broj riješenih ispita</p>
        <p>{{ totalSolved }}</p>
      </div>
      <div class="exam-length-result">
        <p>Prosječno vrijeme rješavanja</p>
        <p>{{ avgTime }} sek</p>
      </div>
      <div class="exam-percentage-result">
        <p>Postotak točnosti</p>
        <p>{{ accuracyPercentage }}%</p>
      </div>
    </div>

    <div class="exam-stat-chart">
      <h3>Statistika ispita</h3>
      <div class="chart-column">
        <p class="chart-title">Front-end</p>
        <div v-for="level in examLevels" :key="level" class="chart-row">
          <span class="chart-label">{{ level }}</span>
          <div class="chart-bar-background">
            <div class="chart-bar" :style="{ width: (findPercentage('exam','frontend',level) || 0) + '%' }"></div>
          </div>
          <span class="chart-value">{{ findPercentage('exam','frontend',level) ?? '-' }}%</span>
        </div>
      </div>
      <div class="chart-column">
        <p class="chart-title">Back-end</p>
        <div v-for="level in examLevels" :key="level" class="chart-row">
          <span class="chart-label">{{ level }}</span>
          <div class="chart-bar-background">
            <div class="chart-bar" :style="{ width: (findPercentage('exam','backend',level) || 0) + '%' }"></div>
          </div>
          <span class="chart-value">{{ findPercentage('exam','backend',level) ?? '-' }}%</span>
        </div>
      </div>
    </div>

    <div class="practice-stat-chart">
      <h3>Statistika vježbe</h3>
      <div class="chart-column">
        <p class="chart-title">Front-end</p>
        <div v-for="topic in practiceFrontTopics" :key="topic.key" class="chart-row">
          <span class="chart-label">{{ topic.name }}</span>
          <div class="chart-bar-background">
            <div class="chart-bar" :style="{ width: (findPercentage('practice',topic.key,'practice') || 0) + '%' }"></div>
          </div>
          <span class="chart-value">{{ findPercentage('practice',topic.key,'practice') ?? '-' }}%</span>
        </div>
      </div>
      <div class="chart-column">
        <p class="chart-title">Back-end</p>
        <div v-for="topic in practiceBackTopics" :key="topic.key" class="chart-row">
          <span class="chart-label">{{ topic.name }}</span>
          <div class="chart-bar-background">
            <div class="chart-bar" :style="{ width: (findPercentage('practice',topic.key,'practice') || 0) + '%' }"></div>
          </div>
          <span class="chart-value">{{ findPercentage('practice',topic.key,'practice') ?? '-' }}%</span>
        </div>
      </div>
    </div>

    <div class="stat-details">
      <h3>Ukupni rezultat</h3>

      <div class="practice-tests-grid">
        <div class="practice-results">
          <h4>Vježbe</h4>

          <div class="pie-row">
            <div class="pie-block">
              <p class="pie-title">Front-end</p>
              <div class="pie-circle" :style="{ background: conicGradient(practiceFrontSorted) }"></div>
              <ul class="pie-legend">
                <li v-for="(item, i) in practiceFrontSorted" :key="item.name">
                  <span class="pie-color" :style="{ backgroundColor: colors[i % colors.length] }"></span>
                  {{ item.name }} — {{ item.percentage }}%
                </li>
              </ul>
            </div>
            <div class="pie-block">
              <p class="pie-title">Back-end</p>
              <div class="pie-circle" :style="{ background: conicGradient(practiceBackSorted) }"></div>
              <ul class="pie-legend">
                <li v-for="(item, i) in practiceBackSorted" :key="item.name">
                  <span class="pie-color" :style="{ backgroundColor: colors[i % colors.length] }"></span>
                  {{ item.name }} — {{ item.percentage }}%
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="exam-results">
          <h4>Testovi</h4>
          <div class="line-chart-wrapper">
            <div class="line-y-axis">
              <span>100%</span>
              <span>50%</span>
              <span>0%</span>
            </div>
            <div class="line-chart-inner">
              <svg viewBox="0 0 550 180" class="line-chart" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="550" y2="0" stroke="#eee" />
                <line x1="0" y1="90" x2="550" y2="90" stroke="#eee" />
                <line x1="0" y1="180" x2="550" y2="180" stroke="#ccc" />

                <polyline :points="lineFrontPoints" fill="none" stroke="#4a90d9" stroke-width="3" />
                <polyline :points="lineBackPoints" fill="none" stroke="#50b880" stroke-width="3" />

                <circle v-for="(t, i) in lineFrontPointsArray" :key="'f'+i" :cx="t.x" :cy="t.y" r="5" fill="#4a90d9" />
                <circle v-for="(t, i) in lineBackPointsArray" :key="'b'+i" :cx="t.x" :cy="t.y" r="5" fill="#50b880" />
              </svg>
              <div class="line-labels">
                <span v-for="level in examLevels" :key="level">{{ level }}</span>
              </div>
            </div>
          </div>
          <div class="line-legend">
            <span><span class="pie-color" style="background:#4a90d9"></span> Front-end</span>
            <span><span class="pie-color" style="background:#50b880"></span> Back-end</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>