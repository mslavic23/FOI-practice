<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted, computed } from 'vue'

const route = useRoute()

const vrijemePocetka = ref(null)
const pitanja = ref([])
const trenutnoIndex = ref(0)
const odabranaOdgovor = ref(null)
const tocniOdgovori = ref(0)
const testZavrsen = ref(false)
const ucitavanje = ref(true)

const preostaloSekundi = ref(160)
const zavrsnoVrijeme = ref(null)
let timerId = null

async function dohvatiPitanja() {
  try {
    const response = await fetch(`http://localhost:3000/api/pitanja/${route.params.kategorija}/${route.params.razina}`)
    const data = await response.json()
    pitanja.value = data
  } catch (error) {
    console.error('Greška pri dohvaćanju pitanja:', error)
  } finally {
    ucitavanje.value = false
  }
}

function odaberiOdgovor(slovo) {
  odabranaOdgovor.value = slovo
}

function posaljiRezultat(preostalo) {
  const trajanje = 120 - preostalo
  fetch('http://localhost:3000/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'exam',
      category: route.params.kategorija,
      level: route.params.razina,
      correct_answers: tocniOdgovori.value,
      total_questions: pitanja.value.length,
      time_seconds: trajanje
    })
  }).catch(err => console.error('Greška pri spremanju rezultata:', err))
}

function potvrdiOdgovor() {
  const trenutnoPitanje = pitanja.value[trenutnoIndex.value]
  if (odabranaOdgovor.value === trenutnoPitanje.tocan_odgovor) {
    tocniOdgovori.value++
  }

  if (trenutnoIndex.value < pitanja.value.length - 1) {
    trenutnoIndex.value++
    odabranaOdgovor.value = null
  } else {
    clearInterval(timerId)
    zavrsnoVrijeme.value = preostaloSekundi.value
    testZavrsen.value = true
    posaljiRezultat(preostaloSekundi.value)
  }
}

function zavrsiTestZbogVremena() {
  if (testZavrsen.value) return
  zavrsnoVrijeme.value = 0
  testZavrsen.value = true
  posaljiRezultat(0)
}

function pokreniTimer() {
  timerId = setInterval(() => {
    preostaloSekundi.value--
    if (preostaloSekundi.value <= 0) {
      clearInterval(timerId)
      zavrsiTestZbogVremena()
    }
  }, 1000)
}

function formatirajVrijeme(sekunde) {
  const min = Math.floor(sekunde / 60)
  const sek = sekunde % 60
  return `${min}:${sek.toString().padStart(2, '0')}`
}

function formatirajPuno(sekunde) {
  const h = Math.floor(sekunde / 3600)
  const m = Math.floor((sekunde % 3600) / 60)
  const s = sekunde % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const pitanjeDio = computed(() => {
  const puni = pitanja.value[trenutnoIndex.value]?.pitanje || ''
  const idx = puni.indexOf('\n\n')
  if (idx === -1) return { tekst: puni, kod: null }
  return { tekst: puni.slice(0, idx), kod: puni.slice(idx + 2) }
})

onMounted(() => {
  vrijemePocetka.value = Date.now()
  dohvatiPitanja()
  pokreniTimer()
})

onUnmounted(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<template>
  <section class="exam-test-page">
    <div
      v-if="!ucitavanje && !testZavrsen"
      class="timer-fiksni"
      :class="{ 'timer-hitno': preostaloSekundi <= 20 }"
    >
      ⏱ {{ formatirajVrijeme(preostaloSekundi) }}
    </div>

    <div v-if="ucitavanje">Učitavam pitanja...</div>

    <div v-else-if="testZavrsen" class="test-rezultat">
    <p class="zavrsno-vrijeme" :class="zavrsnoVrijeme > 0 ? 'vrijeme-zeleno' : 'vrijeme-zuto'">
      {{ formatirajPuno(zavrsnoVrijeme) }}
    </p>
     <h2>Test završen!</h2>
     <p class="rezultat-brojka">Točno: {{ tocniOdgovori }} / {{ pitanja.length }}</p>
    </div>

    <div v-else-if="pitanja.length > 0" class="test-pitanje">
      <p class="pitanje-broj">Pitanje {{ trenutnoIndex + 1 }} / {{ pitanja.length }}</p>
      <h3>{{ pitanjeDio.tekst }}</h3>
      <pre v-if="pitanjeDio.kod" class="pitanje-kod">{{ pitanjeDio.kod }}</pre>

      <div class="odgovori">
        <button :class="{ odabran: odabranaOdgovor === 'A' }" @click="odaberiOdgovor('A')">
          {{ pitanja[trenutnoIndex].odgovor_a }}
        </button>
        <button :class="{ odabran: odabranaOdgovor === 'B' }" @click="odaberiOdgovor('B')">
          {{ pitanja[trenutnoIndex].odgovor_b }}
        </button>
        <button :class="{ odabran: odabranaOdgovor === 'C' }" @click="odaberiOdgovor('C')">
          {{ pitanja[trenutnoIndex].odgovor_c }}
        </button>
      </div>

      <button class="potvrdi-btn" :disabled="!odabranaOdgovor" @click="potvrdiOdgovor">
        Potvrdi
      </button>
    </div>

    <div v-else>Nema dostupnih pitanja.</div>
  </section>
</template>