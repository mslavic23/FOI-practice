<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const startTime = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const answerConfirmed = ref(false)
const correctAnswers = ref(0)
const testFinished = ref(false)
const loading = ref(true)
const answerHistory = ref([])

async function fetchQuestions() {
  try {
    const response = await fetch(`http://localhost:3000/api/pitanja/${route.params.tema}/practice`, { cache: 'no-store' })
    const data = await response.json()
    questions.value = data
  } catch (error) {
    console.error('Greška pri dohvaćanju pitanja:', error)
  } finally {
    loading.value = false
  }
}

function selectAnswer(letter) {
  if (answerConfirmed.value) return
  selectedAnswer.value = letter
}

function confirmAnswer() {
  const currentQuestion = questions.value[currentIndex.value]
  const isCorrect = selectedAnswer.value === currentQuestion.tocan_odgovor

  if (isCorrect) {
    correctAnswers.value++
  }

  answerHistory.value.push({
    question: currentQuestion.pitanje,
    selectedLetter: selectedAnswer.value,
    selectedText: currentQuestion['odgovor_' + selectedAnswer.value.toLowerCase()],
    correctLetter: currentQuestion.tocan_odgovor,
    correctText: currentQuestion['odgovor_' + currentQuestion.tocan_odgovor.toLowerCase()],
    isCorrect: isCorrect,
    explanation: currentQuestion.objasnjenje
  })

  answerConfirmed.value = true
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    answerConfirmed.value = false
  } else {
    testFinished.value = true
    const duration = Math.round((Date.now() - startTime.value) / 1000)

    fetch('http://localhost:3000/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'practice',
        category: route.params.tema,
        level: 'practice',
        correct_answers: correctAnswers.value,
        total_questions: questions.value.length,
        time_seconds: duration
      })
    }).catch(err => console.error('Greška pri spremanju rezultata:', err))
  }
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
})
</script>

<template>
  <section class="practice-test-page">
    <div v-if="loading">Učitavam pitanja...</div>

    <div v-else-if="testFinished" class="practice-result">
      <h2>Vježba završena!</h2>
      <p class="result-count">Točno: {{ correctAnswers }} / {{ questions.length }}</p>

      <div class="review-all-answers">
        <div v-for="(item, i) in answerHistory" :key="i" class="review-card">
          <p class="review-question">{{ i + 1 }}. {{ item.question }}</p>

          <div class="review-status" :class="item.isCorrect ? 'status-correct' : 'status-incorrect'">
            <span class="status-icon">{{ item.isCorrect ? '✓' : '✕' }}</span>
            <span>Tvoj odgovor: {{ item.selectedText }} — {{ item.isCorrect ? 'točno' : 'netočno' }}</span>
          </div>

          <p v-if="!item.isCorrect" class="review-correct">Točan odgovor: {{ item.correctText }}</p>
          <p class="review-explanation">Objašnjenje: {{ item.explanation }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="questions.length > 0" class="practice-question">
      <p class="question-number">Pitanje {{ currentIndex + 1 }} / {{ questions.length }}</p>
      <h3>{{ questionPart.text }}</h3>
      <pre v-if="questionPart.code" class="question-code">{{ questionPart.code }}</pre>

      <div class="answers">
        <button
          v-for="letter in ['A', 'B', 'C']"
          :key="letter"
          :class="{
            selected: selectedAnswer === letter && !answerConfirmed,
            correctAnswer: answerConfirmed && letter === questions[currentIndex].tocan_odgovor,
            wrongAnswer: answerConfirmed && selectedAnswer === letter && letter !== questions[currentIndex].tocan_odgovor
          }"
          @click="selectAnswer(letter)"
        >
          {{ questions[currentIndex]['odgovor_' + letter.toLowerCase()] }}
        </button>
      </div>

      <div v-if="answerConfirmed" class="explanation-box">
        <p>
          <strong>{{ selectedAnswer === questions[currentIndex].tocan_odgovor ? 'Točno!' : 'Netočno.' }}</strong>
        </p>
        <p>{{ questions[currentIndex].objasnjenje }}</p>
      </div>

      <button
        v-if="!answerConfirmed"
        class="confirm-btn"
        :disabled="!selectedAnswer"
        @click="confirmAnswer"
      >
        Potvrdi
      </button>
      <button
        v-else
        class="confirm-btn"
        @click="nextQuestion"
      >
        {{ currentIndex < questions.length - 1 ? 'Sljedeće pitanje' : 'Završi vježbu' }}
      </button>
    </div>

    <div v-else>Nema dostupnih pitanja.</div>
  </section>
</template>