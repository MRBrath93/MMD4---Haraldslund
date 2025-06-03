<script setup>
// IMPORTS
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore(); // Kobling til Pinia-store


// FETCH DATA
onMounted(() => {

  const cachedFooterRaw = localStorage.getItem('footerData');
  const cachedTimestampRaw = localStorage.getItem('cacheTimestamp');
  const now = Date.now();

  if (cachedFooterRaw && cachedTimestampRaw) {
    const cachedTimestamp = Number(cachedTimestampRaw);

    if (now - cachedTimestamp < CACHE_DURATION_MS) {
      try {
        footerData.value = JSON.parse(cachedFooterRaw);
        
    return;
      } catch (e) {
        console.warn('Fejl ved parsing af cached data:', e);
      }
    }
  }

  fetch('https://popular-gift-b355856076.strapiapp.com/api/praktisk-information?pLevel')
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP fejl! Status: ${response.status}`);
      }
      return response.json();
    })    
    .then(json => {
        footerData.value = json.data;
        localStorage.setItem('footerData', JSON.stringify(footerData.value));
        localStorage.setItem('cacheTimestamp', now.toString());   
    })
    .catch(err => {
      error.value = err.message;
    })
   

});

// REAKTIVE VARIABLER
const footerData = ref([]);


// CACHE VARIABLER
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutter

function formatDato(datoStr) {
  const [year, month, day] = datoStr.split('-');
  return `${day}.${month}.${year}`;
}

</script>

<template>
<div class="footer">
    <div class="footer-container">
        <div class="footer-column">
            <p class="headline">Navigation</p>
            <ul>
                <li><router-link :to="{ name: 'frontpage' }">Forside</router-link></li>
                <li><router-link :to="{ name: 'om-haraldslund' }">Om Haraldslund</router-link></li>
                <li><router-link :to="{ name: 'motion' }">Motion</router-link></li>
                <li><router-link :to="{ name: 'vandogwellness' }">Vand & Wellness</router-link></li>
                <li><router-link :to="{ name: 'moder-og-konferencer' }">Møder & Konferencer</router-link></li>
                <li><router-link :to="{ name: 'booking' }">Booking</router-link></li>
            </ul>
        </div>
        <div class="footer-column">
            <p class="headline">Genveje</p>
            <ul>
                <li><a href="#">Opret ny bruger</a></li>
                <li> <a href="#">Ledige stillinger</a></li>
                <li><a href="#">Privatlivspolitik</a></li>
                <li><a rel="noopener noreferrer" target="_blank" href="https://www.findsmiley.dk/22876">Smiley-rapport</a></li>
                <li><a rel="noopener noreferrer" target="_blank" href="http://www.aalborgkommune.dk/">Aalborg Kommune</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <p class="headline">For medlemmer</p>
            <ul>
                <li><router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link></li>
                <li><a href="#">Events</a></li>
            </ul>
        </div>
        <div class="footer-column">
            <p class="headline">Tilgængelighed</p>
            <ul>
                <li><a rel="noopener noreferrer" target="_blank" href="https://was.digst.dk/haraldslund-com">Tilgængelighedserklæring</a></li>
                <li>
                    <button role="button" aria-label="Skift farvetema mellem lys og mørk tilstand" :aria-pressed="themeStore.moerkTemaAktivt.toString()" @click="themeStore.toggleTema()">Skift farvetema</button>
                    <p class="sr-only" aria-live="assertive">{{ themeStore.moerkTemaAktivt ? 'Mørkt tema aktiveret' : 'Lyst tema aktiveret' }}</p>
                </li>
            </ul>
        </div>
        <div class="footer-column">
            <p class="headline">Åbningstider</p>
            <div role="region" class="large-column" aria-labelledby="opening-hours-headline">
                <div class="opening-hours-container">
                    <ul class="opening-hours" v-for="aabningstider in footerData?.Almindelige_aabningstider || []" :key="aabningstider.id">
                        <li v-if="aabningstider.Dag">{{ aabningstider.Dag }}:</li>
                        <li v-if="aabningstider.Har_Vi_Lukket === true">Lukket</li>
                        <li v-else-if="aabningstider.Har_Vi_Lukket === false">
                            <span v-if="aabningstider.Start_tidspunkt">{{ aabningstider.Start_tidspunkt.split(':')[0] }}:{{ aabningstider.Start_tidspunkt.split(':')[1] }} -</span>
                            <span v-if="aabningstider.Slut_tidspunkt">{{ aabningstider.Slut_tidspunkt.split(':')[0] }}:{{ aabningstider.Slut_tidspunkt.split(':')[1] }}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-if="footerData?.Specielle_aabningstider && footerData.Specielle_aabningstider.length > 0" class="footer-column">
            <p class="headline">Specielle åbningstider</p>
            <div role="region" class="large-column" aria-labelledby="opening-hours-headline">
                <div class="special-opening-hours">
                    <div v-for="specielTid in footerData.Specielle_aabningstider" :key="specielTid.id" class="special-opening-day">
                        <p v-if="specielTid.Anledning">{{ specielTid.Anledning }} ({{ formatDato(specielTid.Dato) }}):</p>
                        <span v-if="specielTid.Har_Vi_Lukket === true">Lukket</span>
                        <span v-else-if="specielTid.Har_Vi_Lukket === false">
                            <span v-if="specielTid.Start_tidspunkt">{{ specielTid.Start_tidspunkt.split(':')[0] }}:{{ specielTid.Start_tidspunkt.split(':')[1] }} -</span>
                            <span v-if="specielTid.Slut_tidspunkt">{{ specielTid.Slut_tidspunkt.split(':')[0] }}:{{ specielTid.Slut_tidspunkt.split(':')[1] }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="logoholder">
            <div role="region" class="wide-column" aria-label="links">
                <router-link :to="{ name: 'frontpage' }" aria-label="Gå til forsiden">
                    <img src="../assets/images/image-removebg-preview.png" alt="Logo" class="footer-logo">
                </router-link>
                <div class="footer-icons">
                    <a href="https://www.instagram.com/haraldslundvandogkulturhus/" target="_blank" rel="noopener noreferrer" role="link" aria-label="Åben Haraldslunds Instagram-side i ny fane">
                        <img src="../assets/images/instagram_Glyph_White.png" class="social-icon" alt="Instagram-logo" />
                    </a>
                    <!-- Linket åbner i en ny fane med target="_blank" og rel="noopener noreferrer". Noopener er en sikkerhedsforanstaltning mod "reverse tabnabbing". Den forhindrer at den nye side får adgang til window.opener (mhp. at manipulere med siden ved at ændre URL'en i adresselinjen, når brugeren klikker på linket). Noreferrer forhindrer, at henvisningsinformation sendes til den nye side. Det er med til at beskytte brugerens privatliv, da det forhindrer den nye side i at se, hvor brugeren kom fra. INSPIRATIONSKILDE noopener noreferrer: Haim Itamar. What Does The rel=”noopener noreferrer” Tag Mean?. Elementor Blog. 23/02/2025 (online). [Accessed 24/05/2025] URL: https://elementor.com/blog/noopener-noreferrer/ -->
                    <a href="https://www.facebook.com/Haraldslund" target="_blank" rel="noopener noreferrer" aria-label="Åben vores Facebook-side i ny fane" role="link">
                        <img src="../assets/images/Facebook_Logo_Secondary.png" class="social-icon" alt="Facebook-logo" />
                    </a>
                    <img src="../assets/images/DK_Logo.png" class="payment-icon" alt="Dankort-logo" aria-label="Du kan betale med Dankort i vores webshop"/>
                </div>
            </div>
            <div role="region" class="wide-column footer-contact-info" aria-label="contact information">
                <p>Kastetvej 83 9000 Aalborg</p>
                <p class="seperator" aria-hidden="true">|</p>
                <a href="tel:99316750">Tlf: 99 31 67 50</a>
                <p class="seperator" aria-hidden="true">|</p>
                <a href="mailto:Haraldslund@aalborg.dk">Haraldslund@aalborg.dk</a>
                <p class="seperator" aria-hidden="true">|</p>
                <p>CVR: 29189420</p>
            </div>
            <p>&copy; 2025 Haraldslund Vand- og Kulturhus</p>
        </div>
    </div>
</div>
</template>
<style scoped>
.footer {
  background-color: var(--color-navigation);
  padding: var(--spacer-x3) var(--spacer-x2);
  font-family: var(--font-text);
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: var(--max-width);
  margin: 0 auto;
  gap: var(--spacer-x1);
  color: var(--color-font-2);
}

.footer-column {
  flex: 1 1 200px;
  max-width: 50%;
}

.footer-column .headline {
  margin-bottom: var(--spacer-x0-5);
  border-bottom: 1px solid #bcbcbc85;
  padding-bottom: 5px;
  color: var(--color-font-2);
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 700;
  font-family: var(--font-heading);
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin-bottom: var(--spacer-x0-5);
  color: var(--color-font-2);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.footer-column ul li a {
  color: var(--color-font-2);
  text-decoration: none;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.footer-column ul li a:hover, .footer-column ul li button:hover {
    text-decoration: underline;
    text-underline-offset: 0.5rem;
}

.footer-bottom {
  text-align: center;
  color: var(--color-font-2);
  padding-top: var(--spacer-x1);
}

.large-column {
  display: flex;
  gap: var(--spacer-x1);
}

.opening-hours, .special-opening-day {
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
    color: var(--color-font-2);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.special-opening-day>p, .special-opening-day>span {
    color: var(--color-font-2);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
}

.footer-contact-info {
    display: flex;
    gap: var(--spacer-x2);
}

.logoholder{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.logoholder p {
    font-size: clamp(0.5rem, 1.2vw, .7rem);
    font-weight: 300;
    color: var(--color-font-2);
    margin: 0;
}

.footer-contact-info p, .footer-contact-info a {
    font-size: clamp(0.875rem, 1.2vw, 1rem);
    font-weight: 300;
    align-items: flex-start;
    color: var(--color-font-2);
}

.social-icon {
    width: 2.1rem;
    height: 2.2rem;
}
.payment-icon {
    height: 2rem;
    width: 3.125rem;
}

.footer-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacer-x1-5);
    width: 100%;
    padding: var(--spacer-x1) 0;
}

.footer-logo {
    width: 12rem;
    height: 3.5rem;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
}

.footer li button {
    background-color: transparent;
    border: none;
    color: var(--color-font-2);
    padding-bottom: var(--spacer-x0-5);
    padding-left: 1px;
    padding-top: 0.2rem;
    border: none;
    cursor: pointer;
    font-family: var(--font-text);
    font-size: 1rem;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
}

/* Responsiv til mobil */
@media (max-width: 600px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-column {
    flex: none;
    width: 100%;
  }

  .large-column {
  justify-content: center;
}

.opening-hours, .special-opening-day {
    min-width: unset;
    gap: var(--spacer-x0-5);
}

.footer {
  padding: var(--spacer-x2) var(--spacer-x1);
}

}

@media (max-width: 800px) {
    .footer-contact-info {
    flex-direction: column;
    gap: var(--spacer-x0-5);
}

.seperator {
    display: none;
}

.opening-hours, .special-opening-day {
    width: 100%;
}

.footer-column {
  max-width: 100%;
}

}
</style>