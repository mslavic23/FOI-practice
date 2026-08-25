<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const vrijemePocetka = ref(null)
const pitanja = ref([])
const trenutnoIndex = ref(0)
const odabranaOdgovor = ref(null)
const tocniOdgovori = ref(0)
const testZavrsen = ref(false)
const ucitavanje = ref(true)
const route = useRoute()

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

function potvrdiOdgovor() {
  const trenutnoPitanje = pitanja.value[trenutnoIndex.value]
  if (odabranaOdgovor.value === trenutnoPitanje.tocan_odgovor) {
    tocniOdgovori.value++
  }


  if (trenutnoIndex.value < pitanja.value.length - 1) {
    trenutnoIndex.value++
    odabranaOdgovor.value = null
  } else {
    testZavrsen.value = true
    const trajanje = Math.round((Date.now() - vrijemePocetka.value) / 1000)

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
}
  
onMounted(() => {
  vrijemePocetka.value = Date.now()
  dohvatiPitanja()
})

</script>

<template>
  <section class="oexam-test-page">
    <div v-if="ucitavanje">Učitavam pitanja...</div>

    <div v-else-if="testZavrsen" class="test-rezultat">
      <h2>Test završen!</h2>
      <p>Točno: {{ tocniOdgovori }} / {{ pitanja.length }}</p>
    </div>

    <div v-else-if="pitanja.length > 0" class="test-pitanje">
      <p class="pitanje-broj">Pitanje {{ trenutnoIndex + 1 }} / {{ pitanja.length }}</p>
      <h3 class="pitanje-tekst" style="white-space: pre-wrap; font-family: monospace;">{{ pitanja[trenutnoIndex].pitanje }}</h3>

      <div class="odgovori">
        <button
          :class="{ odabran: odabranaOdgovor === 'A' }"
          @click="odaberiOdgovor('A')"
        >
          {{ pitanja[trenutnoIndex].odgovor_a }}
        </button>
        <button
          :class="{ odabran: odabranaOdgovor === 'B' }"
          @click="odaberiOdgovor('B')"
        >
          {{ pitanja[trenutnoIndex].odgovor_b }}
        </button>
        <button
          :class="{ odabran: odabranaOdgovor === 'C' }"
          @click="odaberiOdgovor('C')"
        >
          {{ pitanja[trenutnoIndex].odgovor_c }}
        </button>
      </div>

      <button
        class="potvrdi-btn"
        :disabled="!odabranaOdgovor"
        @click="potvrdiOdgovor"
      >
        Potvrdi
      </button>
    </div>

    <div v-else>Nema dostupnih pitanja.</div>
  </section>
</template>