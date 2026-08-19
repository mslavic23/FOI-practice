<script setup>
import { ref, onMounted } from 'vue'

const pitanja = ref([])
const trenutnoIndex = ref(0)
const odabranaOdgovor = ref(null)
const tocniOdgovori = ref(0)
const testZavrsen = ref(false)
const ucitavanje = ref(true)

async function dohvatiPitanja() {
  try {
    const response = await fetch('http://localhost:3000/api/pitanja/frontend/osnovna')
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
  }
}

onMounted(() => {
  dohvatiPitanja()
})
</script>

<template>
  <section class="test-page">
    <div v-if="ucitavanje">Učitavam pitanja...</div>

    <div v-else-if="testZavrsen" class="test-rezultat">
      <h2>Test završen!</h2>
      <p>Točno: {{ tocniOdgovori }} / {{ pitanja.length }}</p>
    </div>

    <div v-else-if="pitanja.length > 0" class="test-pitanje">
      <p class="pitanje-broj">Pitanje {{ trenutnoIndex + 1 }} / {{ pitanja.length }}</p>
      <h3>{{ pitanja[trenutnoIndex].pitanje }}</h3>

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