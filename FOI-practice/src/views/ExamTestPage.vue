<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()

const startTime = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const correctAnswers = ref(0)
const testFinished = ref(false)
const loading = ref(true)

const remainingSeconds = ref(150)
const finalTime = ref(null)
let timerId = null

async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/pitanja/${route.params.kategorija}/${route.params.razina}`)
    const data = await response.json()
    questions.value = data
  } catch (error) {
    console.error('Greška pri dohvaćanju pitanja:', error)
  } finally {
    loading.value = false
  }
}

function selectAnswer(letter) {
  selectedAnswer.value = letter
}

function submitResult(remaining) {
  const duration = 150 - remaining
  fetch('http://localhost:3000/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'exam',
      category: route.params.kategorija,
      level: route.params.razina,
      correct_answers: correctAnswers.value,
      total_questions: questions.value.length,
      time_seconds: duration
    })
  }).catch(err => console.error('Greška pri spremanju rezultata:', err))
}

function confirmAnswer() {
  const currentQuestion = questions.value[currentIndex.value]
  if (selectedAnswer.value === currentQuestion.tocan_odgovor) {
    correctAnswers.value++
  }

  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
  } else {
    clearInterval(timerId)
    finalTime.value = remainingSeconds.value
    testFinished.value = true
    submitResult(remainingSeconds.value)
  }
}

function endTestDueToTime() {
  if (testFinished.value) return
  finalTime.value = 0
  testFinished.value = true
  submitResult(0)
}

function startTimer() {
  timerId = setInterval(() => {
    remainingSeconds.value--
    if (remainingSeconds.value <= 0) {
      clearInterval(timerId)
      endTestDueToTime()
    }
  }, 1000)
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}:${sec.toString().padStart(2, '0')}`
}

function formatFull(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const questionPart = computed(() => {
  const full = questions.value[currentIndex.value]?.pitanje || ''
  const idx = full.indexOf('\n\n')
  if (idx === -1) return { text: full, code: null }
  return { text: full.slice(0, idx), code: full.slice(idx + 2) }
})

onMounted(() => {
  startTime.value = Date.now()
  fetchQuestions()
  startTimer()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <section class="exam-test-page">
    <div
      v-if="!loading && !testFinished"
      class="timer-fixed"
      :class="{ 'timer-urgent': remainingSeconds <= 20 }"
    >
      ⏱ {{ formatTime(remainingSeconds) }}
    </div>

    <div v-if="loading">Učitavam pitanja...</div>

    <div v-else-if="testFinished" class="test-result">
    <p class="final-time" :class="finalTime > 0 ? 'time-green' : 'time-yellow'">
      {{ formatFull(finalTime) }}
    </p>
     <h2>Test završen!</h2>
     <p class="result-count">Točno: {{ correctAnswers }} / {{ questions.length }}</p>
    </div>

    <div v-else-if="questions.length > 0" class="test-question">
      <p class="question-number">Pitanje {{ currentIndex + 1 }} / {{ questions.length }}</p>
      <h3>{{ questionPart.text }}</h3>
      <pre v-if="questionPart.code" class="question-code">{{ questionPart.code }}</pre>

      <div class="answers">
        <button :class="{ selected: selectedAnswer === 'A' }" @click="selectAnswer('A')">
          {{ questions[currentIndex].odgovor_a }}
        </button>
        <button :class="{ selected: selectedAnswer === 'B' }" @click="selectAnswer('B')">
          {{ questions[currentIndex].odgovor_b }}
        </button>
        <button :class="{ selected: selectedAnswer === 'C' }" @click="selectAnswer('C')">
          {{ questions[currentIndex].odgovor_c }}
        </button>
      </div>

      <button class="confirm-btn" :disabled="!selectedAnswer" @click="confirmAnswer">
        Potvrdi
      </button>
    </div>

    <div v-else>Nema dostupnih pitanja.</div>
  </section>
</template>