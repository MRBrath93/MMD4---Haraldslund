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
    <footer class="site-footer">
  <div class="footer-container">
    <div class="footer-column">
      <h3>Navigation</h3>
      <ul>
        <li>
                        <router-link :to="{ name: 'frontpage' }">Forside</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'om-haraldslund' }">Om Haraldslund</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'motion' }">Motion</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'vandogwellness' }">Vand & Wellness</router-link>
                    </li>
                    <li>
                        <router-link :to="{ name: 'moder-og-konferencer' }">Møder & Events</router-link>
                    </li>
                    <li>
                        <a href="#">Booking</a>
                    </li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Genveje</h3>
      <ul>
        <li>
                    <a href="#">Opret ny bruger</a>
                </li>
                <li>
                    <a href="#">Ledige stillinger</a>
                </li>
                <li>
                    <a href="#">Privatlivspolitik</a>
                </li>
                <li>
                    <a 
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://www.findsmiley.dk/22876">Smiley-rapport</a>
                </li>
                <li>
                    <a
                    rel="noopener noreferrer"
                    target="_blank" 
                    href="http://www.aalborgkommune.dk/">Aalborg Kommune</a>
                </li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Formedlemmer</h3>
      <ul>
         <li>
                        <router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link>
                    </li>
                    <li>
                        <a href="#">Events</a>
                    </li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Tilgængelighed</h3>
      <ul>
         <li>
                        <a 
                        rel="noopener noreferrer"
                        target="_blank"
                        href="https://was.digst.dk/haraldslund-com">Tilgængelighedserklæring</a>
                    </li>
                    <li>
                        <button 
                        role="button"
                        aria-label="Skift farvetema mellem lys og mørk tilstand"
                        :aria-pressed="themeStore.moerkTemaAktivt.toString()"
                        @click="themeStore.toggleTema()">
                        Skift farvetema
                        </button>
                        <p class="sr-only" aria-live="assertive">
                            {{ themeStore.moerkTemaAktivt ? 'Mørkt tema aktiveret' : 'Lyst tema aktiveret' }}
                        </p>
                    </li>
      </ul>
    </div>
     <div class="footer-column">
      <h3>Åbningstider</h3>
      <div 
            role="region"
            class="large-column"
            aria-labelledby="opening-hours-headline"
            >
            <div class="opening-hours-container">
                        <ul class="opening-hours" v-for="aabningstider in footerData?.Almindelige_aabningstider || []"
                        :key="aabningstider.id">
                            <li v-if="aabningstider.Dag">{{ aabningstider.Dag }}:</li>
                            <li v-if="aabningstider.Har_Vi_Lukket === true">Lukket</li>
                            <li v-else-if="aabningstider.Har_Vi_Lukket === false">
                                <span v-if="aabningstider.Start_tidspunkt">
                                {{ aabningstider.Start_tidspunkt.split(':')[0] }}:{{ aabningstider.Start_tidspunkt.split(':')[1] }} -
                                </span>
                                <span v-if="aabningstider.Slut_tidspunkt">
                                {{ aabningstider.Slut_tidspunkt.split(':')[0] }}:{{ aabningstider.Slut_tidspunkt.split(':')[1] }}
                                </span>
                            </li>
                        </ul>
                </div>
        </div>
    </div>
     <div class="footer-column">
      <h3>Specielle åbningstider</h3>
      <div 
            role="region"
            class="large-column"
            aria-labelledby="opening-hours-headline"
            >
             <div
                        v-if="footerData?.Specielle_aabningstider && footerData.Specielle_aabningstider.length > 0"
                        class="special-opening-hours"
                    >
                        <div
                        v-for="specielTid in footerData.Specielle_aabningstider"
                        :key="specielTid.id"
                        class="special-opening-day"
                        >
                            <p v-if="specielTid.Anledning">{{ specielTid.Anledning }} ({{ formatDato(specielTid.Dato) }}):</p>
                            <span v-if="specielTid.Har_Vi_Lukket === true">Lukket</span>
                            <span v-else-if="specielTid.Har_Vi_Lukket === false">
                                <span v-if="specielTid.Start_tidspunkt">
                                {{ specielTid.Start_tidspunkt.split(':')[0] }}:{{ specielTid.Start_tidspunkt.split(':')[1] }} -
                                </span>
                                <span v-if="specielTid.Slut_tidspunkt">
                                {{ specielTid.Slut_tidspunkt.split(':')[0] }}:{{ specielTid.Slut_tidspunkt.split(':')[1] }}
                                </span>
                            </span>
                        </div>
                    </div>
        </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2025 Haraldslund Vand- og Kulturhus</p>
  </div>
  <div class="logoholder">
                <div 
            role="region"
            class="footer-column wide-column"
            aria-label="links"
            >
                <router-link 
                :to="{ name: 'frontpage' }"
                aria-label="Gå til forsiden"
                >
                    <img src="../assets/images/image-removebg-preview.png" alt="Logo" class="footer-logo">
                </router-link>
                <div class="footer-icons">
                <a 
                    href="https://www.instagram.com/haraldslundvandogkulturhus/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    role="link"
                    aria-label="Åben Haraldslunds Instagram-side i ny fane"
                    >
                    <img src="../assets/images/instagram_Glyph_White.png" class="social-icon" alt="Instagram-logo" />
                </a>
                <!-- Linket åbner i en ny fane med target="_blank" og rel="noopener noreferrer".
                Noopener er en sikkerhedsforanstaltning mod "reverse tabnabbing". Den forhindrer at den nye side får adgang til window.opener (mhp. at manipulere med siden ved at ændre URL'en i adresselinjen, når brugeren klikker på linket).
                Noreferrer forhindrer, at henvisningsinformation sendes til den nye side. Det er med til at beskytte brugerens privatliv, da det forhindrer den nye side i at se, hvor brugeren kom fra.
                INSPIRATIONSKILDE noopener noreferrer: Haim Itamar. What Does The rel=”noopener noreferrer” Tag Mean?. Elementor Blog. 23/02/2025 (online). [Accessed 24/05/2025] URL: https://elementor.com/blog/noopener-noreferrer/ -->
                <a 
                    href="https://www.facebook.com/Haraldslund" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Åben vores Facebook-side i ny fane"
                    role="link"
                >
                    <img src="../assets/images/Facebook_Logo_Secondary.png" class="social-icon" alt="Facebook-logo" />
                </a>
                    <img src="../assets/images/DK_Logo.png" 
                    class="payment-icon" 
                    alt="Dankort-logo" 
                    aria-label="Du kan betale med Dankort i vores webshop"/>
                
                </div>
            </div>
            <div 
            role="region"
            class="wide-column footer-contact-info"
            aria-label="contact information">
                <p>Kastetvej 83 9000 Aalborg</p>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
                <a href="tel:99316750">Tlf: 99 31 67 50</a>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
                <a href="mailto:Haraldslund@aalborg.dk">Haraldslund@aalborg.dk</a>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
                <p>CVR: 29189420</p>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
            </div>   
            </div>
</footer>

</template>
<style scoped>
.site-footer {
  background-color: var(--color-navigation);
  padding: 40px 20px;
  font-family: sans-serif;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: var(--max-width);
  margin: 0 auto;
  gap: 20px;
  color: var(--color-font-2);
}

.footer-column {
  flex: 1 1;
}

.footer-column h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
  border-bottom: 1px solid var(--color-font-2);;
  padding-bottom: 5px;
  color: var(--color-font-2);
}

.footer-column ul {
  list-style: none;
  padding: 0;
}

.footer-column ul li {
  margin-bottom: 8px;
  color: var(--color-font-2);
}

.footer-column ul li a {
  color: var(--color-font-2);
  text-decoration: none;
  color: var(--color-font-2);
}

.footer-column ul li a:hover {
  color: var(--color-font-2);
  text-decoration: underline;
}

.footer-bottom {
  text-align: center;
  margin-top: 30px;
  font-size: 0.9em;
  color: #aaa;
  border-top: 1px solid #444;
  padding-top: 15px;
}

.large-column {
  display: flex;
  gap: var(--spacer-x1);
  min-width: 20rem;
}

.opening-hours, .special-opening-day {
    display: flex;
    justify-content: space-between;
    min-width: 20rem;
    color: var(--color-font-2);
}

.special-opening-day>p {
    color: var(--color-font-2);
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
}



</style>