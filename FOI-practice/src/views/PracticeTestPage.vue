<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pitanja = ref([])
const trenutnoIndex = ref(0)
const odabranaOdgovor = ref(null)
const odgovorPotvrden = ref(false)
const tocniOdgovori = ref(0)
const testZavrsen = ref(false)
const ucitavanje = ref(true)
const povijestOdgovora = ref([])

async function dohvatiPitanja() {
  try {
    const response = await fetch(`http://localhost:3000/api/pitanja/${route.params.tema}/practice`)
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
  const jeTocno = odabranaOdgovor.value === trenutnoPitanje.tocan_odgovor

  if (jeTocno) {
    tocniOdgovori.value++
  }

  povijestOdgovora.value.push({
    pitanje: trenutnoPitanje.pitanje,
    odabranoSlovo: odabranaOdgovor.value,
    odabranoTekst: trenutnoPitanje['odgovor_' + odabranaOdgovor.value.toLowerCase()],
    tocnoSlovo: trenutnoPitanje.tocan_odgovor,
    tocnoTekst: trenutnoPitanje['odgovor_' + trenutnoPitanje.tocan_odgovor.toLowerCase()],
    jeTocno: jeTocno,
    objasnjenje: trenutnoPitanje.objasnjenje
  })

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

const pitanjeDio = computed(() => {
  const puni = pitanja.value[trenutnoIndex.value]?.pitanje || ''
  const idx = puni.indexOf('\n\n')
  if (idx === -1) return { tekst: puni, kod: null }
  return { tekst: puni.slice(0, idx), kod: puni.slice(idx + 2) }
})

onMounted(() => {
  dohvatiPitanja()
})
</script>

<template>
  <section class="practice-test-page">
    <div v-if="ucitavanje">Učitavam pitanja...</div>

    <div v-else-if="testZavrsen" class="practice-rezultat">
      <h2>Vježba završena!</h2>
      <p class="rezultat-brojka">Točno: {{ tocniOdgovori }} / {{ pitanja.length }}</p>

      <div class="pregled-svih-odgovora">
        <div v-for="(stavka, i) in povijestOdgovora" :key="i" class="pregled-kartica">
          <p class="pregled-pitanje">{{ i + 1 }}. {{ stavka.pitanje }}</p>

          <div class="pregled-status" :class="stavka.jeTocno ? 'status-tocno' : 'status-netocno'">
            <span class="status-ikona">{{ stavka.jeTocno ? '✓' : '✕' }}</span>
            <span>Tvoj odgovor: {{ stavka.odabranoTekst }} — {{ stavka.jeTocno ? 'točno' : 'netočno' }}</span>
          </div>

          <p v-if="!stavka.jeTocno" class="pregled-tocan">Točan odgovor: {{ stavka.tocnoTekst }}</p>
          <p class="pregled-objasnjenje">Objašnjenje: {{ stavka.objasnjenje }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="pitanja.length > 0" class="practice-pitanje">
      <p class="pitanje-broj">Pitanje {{ trenutnoIndex + 1 }} / {{ pitanja.length }}</p>
      <h3>{{ pitanjeDio.tekst }}</h3>
      <pre v-if="pitanjeDio.kod" class="pitanje-kod">{{ pitanjeDio.kod }}</pre>

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