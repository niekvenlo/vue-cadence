<script setup lang="ts">
const emit = defineEmits(['setCards'])

const sets = [
  {
    label: 'Set 0',
    string: `zuinig	frugal	matipid
de druk	the pressure	ang presyon
het ritme	the rhythm	ang ritmo
de jeuk	the itch	ang pangangati
het slachtoffer	the victim	ang biktima
knikken	to nod	pagtango
de verdeling	the distribution	ang pamamahagi
beperkt	limited	limitado
opslaan	save	i-save`
  },
  {
    label: 'Set 1',
    string: `de strook	the strip	ang strip
de werkzaamheden	the work	ang trabaho
het avontuur	the adventure	ang pakikipagsapalaran
aannemen	contract	kontrata
ondertussen	meanwhile	samantala
de industrie	the industry	ang industriya
misgaan	go wrong	magkamali
schaatsen	to skate	mag-skate
het goede doel	the good cause	ang kawanggawa
mengen	to mix	paghahalo
onder andere (o.a.)	among other things (among others)	bukod sa iba pa
de beperking	the limitation	ang limitasyon
met terugwerkende kracht	retroactively	pabalik
degene (degenen)	the one (those)	ang isa (mga iyon)
contact opnemen met	contact with	makipag-ugnayan
tropisch	tropical	tropikal
ontstaan	to arise	lumitaw
(geld) opnemen	withdraw (money)	mag-withdraw (pera)
minstens	at least	kahit papaano
zich inzetten (voor)	to commit oneself (to)	mangako (sa)`
  },
  {
    label: 'Set 1.5',
    string: `mengen	to mix	paghahalo
onder andere (o.a.)	among other things (among others)	bukod sa iba pa
de beperking	the limitation	ang limitasyon
met terugwerkende kracht	retroactively	pabalik
degene (degenen)	the one (those)	ang isa (mga iyon)
contact opnemen met	contact with	makipag-ugnayan
tropisch	tropical	tropikal
ontstaan	to arise	lumitaw
(geld) opnemen	withdraw (money)	mag-withdraw (pera)
minstens	at least	kahit papaano
zich inzetten (voor)	to commit oneself (to)	mangako (sa)
de handel	the trade	ang kalakalan
overnemen	to take over	para pumalit
de instantie	the agency	ang ahensya
de hovenier	the gardener	ang hardinero
de toegang	the access	ang pag-access
voorschrijven	prescribe	magreseta
de presentator	the presenter	ang tagapagtanghal
de brandstof	the fuel	ang gasolina
ergens anders	somewhere else	sa ibang lugar`
  },
  {
    label: 'Set 2',
    string: `de handel	the trade	ang kalakalan
overnemen	to take over	para pumalit
de instantie	the agency	ang ahensya
de hovenier	the gardener	ang hardinero
de toegang	the access	ang pag-access
voorschrijven	prescribe	magreseta
de presentator	the presenter	ang tagapagtanghal
de brandstof	the fuel	ang gasolina
ergens anders	somewhere else	sa ibang lugar
functioneren	function	tungkulin
openstaan voor	be open to	maging bukas sa
de logistiek	logistics	logistik
genezen (van)	to heal (from)	gumaling (ng)
de gracht	the canal	ang kanal
de aandacht	the attention	ang atensyon
de oorzaak	the cause	ang sanhi
eenvoudig	simple	simple
afwisselend	varied	iba-iba
de maatregel	the measure	ang sukat
voorlopig	provisional	pansamantala`
  },
  {
    label: 'Set 2.5',
    string: `functioneren	function	tungkulin
openstaan voor	be open to	maging bukas sa
de logistiek	logistics	logistik
genezen (van)	to heal (from)	gumaling (ng)
de gracht	the canal	ang kanal
de aandacht	the attention	ang atensyon
de oorzaak	the cause	ang sanhi
eenvoudig	simple	simple
afwisselend	varied	iba-iba
de maatregel	the measure	ang sukat
voorlopig	provisional	pansamantala
de aanpak	the approach	ang pamamaraan
de ICT	ICT	ICT
de notulen	the minutes	ang mga minuto
gevlucht, vluchten	fled, flee	tumakas, tumakas
het budget	the budget	ang badyet
beleefd	polite	magalang
echter	however	gayunpaman
de schutting	the fence	ang bakod
de ademhaling	the breathing	paghinga`
  },
  {
    label: 'Set 3',
    string: `de aanpak	the approach	ang pamamaraan
de ICT	ICT	ICT
de notulen	the minutes	ang mga minuto
gevlucht, vluchten	fled, flee	tumakas, tumakas
het budget	the budget	ang badyet
beleefd	polite	magalang
echter	however	gayunpaman
de schutting	the fence	ang bakod
de ademhaling	the breathing	paghinga
deskundig	expert	eksperto
uiteindelijk	eventually	kalaunan
dat houdt in (dat)	that means (that)	na nagpapahiwatig (na)
rechtstreeks	directly	direkta
ik kan me voorstellen dat ...	I can imagine that...	Naiisip ko na...
de kust	the coast	ang baybayin
rollen	roll	mga tungkulin
nauwkeurig	accurate	tumpak
combineren (met)	combine (with)	pagsamahin (kasama)
volhouden	to persevere	magtiyaga
door middel van (d.m.v.)	by means of (by means of)	sa pamamagitan ng (sa pamamagitan ng)`
  },
  {
    label: 'Set 3.5',
    string: `deskundig	expert	eksperto
uiteindelijk	eventually	kalaunan
dat houdt in (dat)	that means (that)	na nagpapahiwatig (na)
rechtstreeks	directly	direkta
ik kan me voorstellen dat ...	I can imagine that...	Naiisip ko na...
de kust	the coast	ang baybayin
rollen	roll	mga tungkulin
nauwkeurig	accurate	tumpak
combineren (met)	combine (with)	pagsamahin (kasama)
volhouden	to persevere	magtiyaga
door middel van (d.m.v.)	by means of (by means of)	sa pamamagitan ng (sa pamamagitan ng)
het lot	the fate	kapalaran
de mogelijkheid	the possibility	ang posibilidad
weigeren	to refuse	tumanggi
de agenda	the agenda	ang adyenda
zuinig	frugal	matipid
het verzoek	the request	ang kahilingan
het saldo	the balance	ang balanse
de muis	the mouse	ang daga
de motivatie	the motivation	ang motibasyon`
  },
  {
    label: 'Set 4',
    string: `het lot	the fate	kapalaran
de mogelijkheid	the possibility	ang posibilidad
weigeren	to refuse	tumanggi
de agenda	the agenda	ang adyenda
zuinig	frugal	matipid
het verzoek	the request	ang kahilingan
het saldo	the balance	ang balanse
de muis	the mouse	ang daga
de motivatie	the motivation	ang motibasyon
verbinden	connect	kumonekta
schoonhouden	to keep clean	manatiling malinis
digitaal	digital	digital
de druk	the pressure	ang presyon
behoefte hebben aan	need to	magkaroon ng pangangailangan para sa
het inkomen	the income	ang kita
professioneel	professional	propesyonal
de sector	the sector	ang sektor
noodzakelijk	necessary	kinakailangan
de loonsverhoging	the wage increase	ang pagtaas ng sahod
de rondvraag	the round of questions	ang pangkalahatang talakayan`
  }
]

const makeCards = (string: string) => string.split(/\n/).map((line) => line.split(/\t/))
</script>

<style>
#ghost-button-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1px;
  button {
    width: unset;
    &:hover {
      filter: hue-rotate(30deg);
      background: linear-gradient(-30deg, rgb(40, 40, 40), rgb(120, 120, 120));
    }
  }
}
</style>

<template>
  <h3>Or just click here, ghost, for pre-made sets</h3>
  <div id="ghost-button-wrapper">
    <button class="black" v-for="set in sets" :key="set.string" @click="emit('setCards', makeCards(set.string))">
      {{ set.label }}
    </button>
  </div>
</template>
