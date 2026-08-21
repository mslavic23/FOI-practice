<script setup>
import { ref, onMounted } from 'vue'

const pitanja = ref([])
const trenutnoIndex = ref(0)
const odabranaOdgovor = ref(null)
const odgovorPotvrden = ref(false)
const tocniOdgovori = ref(0)
const testZavrsen = ref(false)
const ucitavanje = ref(true)

async function dohvatiPitanja() {
  try {
    const response = await fetch('http://localhost:3000/api/pitanja/javascript/practice')
    const data = await response.json()
    pitanja.value = data
  } catch (error) {
    console.error('Greška pri dohvaćanju pitanja:', error)
  } finally {
    ucitavanje.value = false
  }
}

function odaberiOdgovor(slovo) {
  if (odgovorPotvrden.value) return
  odabranaOdgovor.value = slovo
}

function potvrdiOdgovor() {
  const trenutnoPitanje = pitanja.value[trenutnoIndex.value]
  if (odabranaOdgovor.value === trenutnoPitanje.tocan_odgovor) {
    tocniOdgovori.value++
  }
  odgovorPotvrden.value = true
}

function sljedecePitanje() {
  if (trenutnoIndex.value < pitanja.value.length - 1) {
    trenutnoIndex.value++
    odabranaOdgovor.value = null
    odgovorPotvrden.value = false
  } else {
    testZavrsen.value = true
  }
}

onMounted(() => {
  dohvatiPitanja()
})
</script>

<template>
  <section class="practice-test-page">
    <div v-if="ucitavanje">Učitavam pitanja...</div>

    <div v-else-if="testZavrsen" class="practice-rezultat">
      <h2>Vježba završena!</h2>
      <p>Točno: {{ tocniOdgovori }} / {{ pitanja.length }}</p>
    </div>

    <div v-else-if="pitanja.length > 0" class="practice-pitanje">
      <p class="pitanje-broj">Pitanje {{ trenutnoIndex + 1 }} / {{ pitanja.length }}</p>
      <h3>{{ pitanja[trenutnoIndex].pitanje }}</h3>

      <div class="odgovori">
        <button
          v-for="slovo in ['A', 'B', 'C']"
          :key="slovo"
          :class="{
            odabran: odabranaOdgovor === slovo && !odgovorPotvrden,
            tocanOdg: odgovorPotvrden && slovo === pitanja[trenutnoIndex].tocan_odgovor,
            krivOdg: odgovorPotvrden && odabranaOdgovor === slovo && slovo !== pitanja[trenutnoIndex].tocan_odgovor
          }"
          @click="odaberiOdgovor(slovo)"
        >
          {{ pitanja[trenutnoIndex]['odgovor_' + slovo.toLowerCase()] }}
        </button>
      </div>

      <div v-if="odgovorPotvrden" class="objasnjenje-box">
        <p>
          <strong>{{ odabranaOdgovor === pitanja[trenutnoIndex].tocan_odgovor ? 'Točno!' : 'Netočno.' }}</strong>
        </p>
        <p>{{ pitanja[trenutnoIndex].objasnjenje }}</p>
      </div>

      <button
        v-if="!odgovorPotvrden"
        class="potvrdi-btn"
        :disabled="!odabranaOdgovor"
        @click="potvrdiOdgovor"
      >
        Potvrdi
      </button>
      <button
        v-else
        class="potvrdi-btn"
        @click="sljedecePitanje"
      >
        {{ trenutnoIndex < pitanja.length - 1 ? 'Sljedeće pitanje' : 'Završi vježbu' }}
      </button>
    </div>

    <div v-else>Nema dostupnih pitanja.</div>
  </section>
</template>