<script setup lang="ts">
const emit = defineEmits(['setCards'])

const sets = [
  {
    label: 'Set 1',
    string: `verbinden	connect	з'єднати	kumonekta
in de loop van	in the course of	протягом	sa kurso ng
met terugwerkende kracht	retroactively	ретроактивно	pabalik
bepalen	determine	визначити	tukuyin
behandeld	treated	оброблені	ginamot
opgeven	to report	повідомляти	mag-ulat
de schutting	the fence	паркан	ang bakod
de aanpak	the approach	підхід	ang pamamaraan
het ritme	the rhythm	ритм	ang ritmo
beseffen	to realize	усвідомити	mapagtanto
het graan	the grain	зерно	ang butil
het middel	the means	засіб	ang lunas
kampen met	to struggle with	бореться з	nahihirapan sa
horen bij	belong to	належать	nabibilang sa
ten eerste ... ten tweede	first ... second	перший ... другий	una ... pangalawa
stap voor stap	step by step	крок за кроком	hakbang-hakbang
uiteindelijk	eventually	зрештою	kalaunan
vertrouwelijk	confidential	конфіденційний	kumpidensyal
zowel ... als	both ... and	обидва ... як	pareho ... bilang
dat houdt in (dat)	that means (that)	що означає (що)	na nagpapahiwatig (na)
de rondvraag	the round of questions	загальне обговорення	ang pangkalahatang talakayan
ik kan me voorstellen dat ...	I can imagine that...	Я можу собі уявити, що...	Naiisip ko na...
contact opnemen met	contact with	контакт	makipag-ugnayan
verlopen	expired	закінчився	nag-expire na
economisch	economic	економічний	pang-ekonomiya`
  },
  {
    label: 'Set 2',
    string: `accepteren	accept	прийняти	tanggapin
de beperking	the limitation	обмеження	ang limitasyon
inzamelen	collect	збирати	mangolekta
daarnaast	in addition	крім того	bilang karagdagan
besteden aan	spend on	витрачати на	gumastos sa
chronisch	chronic	хронічний	talamak
aannemen	contract	контракт	kontrata
op ... gebied	in ... area	у ... районі	sa ... lugar
bekijken	to look at	дивитися на	para tingnan
stabiel	stable	стабільний	matatag
sociaal	social	соціальний	sosyal
aanlopen tegen	run into	зіткнутися з	makasalubong
biologisch	organic	органічний	organiko
de sector	the sector	сектор	ang sektor
professioneel	professional	професійний	propesyonal
de zorg	care	турбота	pangangalaga
zich inzetten (voor)	to commit oneself (to)	зобов'язуватися (щось)	mangako (sa)
het interview	the interview	інтерв'ю	ang panayam
opslaan	save	зберегти	i-save
zakken	to fail a test	зазнати невдачі	mabigo
vergeleken met	compared to	порівняно з	kumpara sa
geestelijk	spiritual	духовний	espirituwal
ontstaan	to arise	виникати	lumitaw
de strook	the strip	смуга	ang strip
het goede doel	the good cause	благодійна організація	ang kawanggawa`
  },
  {
    label: 'Set 1.5',
    string: `het middel	the means	засіб	ang lunas
kampen met	to struggle with	бореться з	nahihirapan sa
horen bij	belong to	належать	nabibilang sa
ten eerste ... ten tweede	first ... second	перший ... другий	una ... pangalawa
stap voor stap	step by step	крок за кроком	hakbang-hakbang
uiteindelijk	eventually	зрештою	kalaunan
vertrouwelijk	confidential	конфіденційний	kumpidensyal
zowel ... als	both ... and	обидва ... як	pareho ... bilang
dat houdt in (dat)	that means (that)	що означає (що)	na nagpapahiwatig (na)
de rondvraag	the round of questions	загальне обговорення	ang pangkalahatang talakayan
ik kan me voorstellen dat ...	I can imagine that...	Я можу собі уявити, що...	Naiisip ko na...
contact opnemen met	contact with	контакт	makipag-ugnayan
verlopen	expired	закінчився	nag-expire na
economisch	economic	економічний	pang-ekonomiya
accepteren	accept	прийняти	tanggapin
de beperking	the limitation	обмеження	ang limitasyon
inzamelen	collect	збирати	mangolekta
daarnaast	in addition	крім того	bilang karagdagan
besteden aan	spend on	витрачати на	gumastos sa
chronisch	chronic	хронічний	talamak
aannemen	contract	контракт	kontrata
op ... gebied	in ... area	у ... районі	sa ... lugar
bekijken	to look at	дивитися на	para tingnan
stabiel	stable	стабільний	matatag
sociaal	social	соціальний	sosyal`
  },
  {
    label: 'Set 2',
    string: `opgeven	to report	повідомляти	mag-ulat
stap voor stap	step by step	крок за кроком	hakbang-hakbang
uiteindelijk	eventually	зрештою	kalaunan
contact opnemen met	contact with	контакт	makipag-ugnayan
stabiel	stable	стабільний	matatag
het interview	the interview	інтерв'ю	ang panayam
ontstaan	to arise	виникати	lumitaw
het avontuur	the adventure	пригода	ang pakikipagsapalaran
(een afspraak) nakomen	to keep (an appointment/agreement)	(до) записатися на зустріч	(upang) magtakda ng appointment
ondanks	Despite	Незважаючи	Sa kabila
deskundig	expert	експерт	eksperto
het talent	the talent	талант	ang talento
aan de slag gaan	get started	почати	magsimula
weigeren	to refuse	відмовити	tumanggi
het verzorgingshuis	the nursing home	будинок для людей похилого віку	ang tahanan ng mga nars
de eigenschap	the property	власність	ang ari-arian
deelnemen aan	participate in	брати участь у	lumahok sa
beleefd	polite	ввічливий	magalang
in verband met, i.v.m.	in connection with, in connection with	у зв'язку з, щодо	kaugnay ng, patungkol sa
God	God	Бог	Diyos
in het openbaar	in public	публічно	sa publiko
toegeven (aan)	to give in (to)	піддаватися (комусь)	sumuko (sa)
onder leiding van, o.l.v.	under the leadership of, o.l.v.	під керівництвом, на чолі з	sa ilalim ng direksyon ni, pinangunahan ni
de landbouw	the agriculture	сільське господарство	agrikultura
het gedrag	the behavior	поведінка	ang pag-uugali`
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
  <h3>Or just click here, for some pre-made sets</h3>
  <div id="ghost-button-wrapper">
    <button
      class="black"
      v-for="set in sets"
      :key="set.string"
      @click="emit('setCards', makeCards(set.string))"
    >
      {{ set.label }}
    </button>
  </div>
</template>
