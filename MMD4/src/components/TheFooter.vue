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


</script>

<template>
    <div 
    class="footer"
    role="contentinfo"
    aria-label="Sidefod med links til navigation, genveje, åbningstider og sociale medier"
    >
        <div class="footer-container">
            <div role="region"
            aria-labelledby="navigation-headline"
            >
                <h4 class="footer-headline"
                id="navigation-headline">
                    Navigation
                </h4>
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
            <div role="region"
            aria-labelledby="genveje-headline"
            >
            <h4 class="footer-headline"
            id="genveje-headline">
                Genveje
            </h4>
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
            <div role="region"
            aria-labelledby="for-medlemmer-headline"
            >
                <h4 
                class="footer-headline"
                id="for-medlemmer-headline">
                    For medlemmer
                </h4>
                <ul>
                    <li>
                        <router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link>
                    </li>
                    <li>
                        <a href="#">Events</a>
                    </li>
                </ul>
            </div>
            <div role="region"
            aria-labelledby="footer-accessibility-headline"
            >
                <h4 
                class="footer-headline"
                id="footer-accessibility-headline">
                    Tilgængelighed
                </h4>
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
            <div 
            role="region"
            class="large-column"
            aria-labelledby="opening-hours-headline"
            >
                <h4 class="footer-headline" id="opening-hours-headline">Åbningstider</h4>
                    <div class="opening-hours-container">
                        <ul class="opening-hours" v-for="aabningstider in footerData?.Almene_aabningstider || []"
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
                    <div
                        v-if="footerData?.Specielle_aabningstider && footerData.Specielle_aabningstider.length > 0"
                        class="special-opening-hours"
                    >
                        <h4>Specielle åbningstider</h4>
                        <div
                        v-for="specielTid in footerData.Specielle_aabningstider"
                        :key="specielTid.id"
                        class="special-opening-day"
                        >
                            <p v-if="specielTid.Dag">{{ specielTid.Dag }}</p>
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
                <p>Tlf: 99 31 67 50</p>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
                <p>Haraldslund@aalborg.dk</p>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
                <p>CVR: 29189420</p>
                <img src="../assets/images/separator.png" class="separator" alt="Streg" aria-hidden="true" />
            </div>   
        </div>
    </div>
</template>
<style scoped>


.footer {
    background-color: var(--color-navigation);
    color: var(--color-font-2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: var(--spacer-x1) var(--spacer-x3);
}

.footer h4 {
    color: var(--color-font-2);
}

.footer ul {
    list-style-type: none;
    padding: 0;
}

.footer ul li a {
    color: var(--color-font-2);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    min-width: 1.5rem;
    min-height: 1.5rem;
}

.footer li button {
    background-color: transparent;
    border: none;
    color: var(--color-font-2);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    padding-bottom: var(--spacer-x0-5);
    padding-left: 1px;
    padding-top: 0.2rem;
    border: none;
    cursor: pointer;
}

.footer p, .footer li {
    font-family: var(--font-heading);
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    color: var(--color-font-2);
}

footer li a:hover, footer li button:hover {
    text-decoration: underline;
    text-underline-offset: 0.5rem;
}

.footer-logo {
    width: 12rem;
    height: 3.5rem;
}

.footer div {
    width: fit-content;
}

.footer-icons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    padding: var(--spacer-x1) 0;
}

.footer h4 {
    padding-bottom: var(--spacer-x0-5);
}

.social-icon {
    width: 2.1rem;
    height: 2.2rem;
}
.payment-icon {
    height: 2rem;
    width: 3.125rem;
}

.footer-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.footer-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacer-x1-5);
    max-width: 100%;
}

.large-column {
    grid-column: span 2;
}

.opening-hours {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding-bottom: var(--spacer-x1);
}

#opening-hours-container {
    display: flex;
    justify-content: space-between;
    gap: var(--spacer-x1);
    flex-wrap: wrap;
}

.special-opening-hours {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: var(--spacer-x1);
    padding: var(--spacer-x1);
    background-color: var(--color-pricetable);
}

.separator {
    display: none;
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

.footer-contact-info {
    display: flex;
    flex-direction: column;
}

.footer-contact-info p {
    font-size: clamp(0.875rem, 1.2vw, 1rem);
    font-weight: 300;
    align-items: flex-start;
}

@media screen and (min-width: 768px) {
    .footer-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    }

    .opening-hours {
        flex-direction: row;
        gap: var(--spacer-x1);
    }

    .footer-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

}

@media screen and (min-width: 800px) {
    .footer-contact-info {
        padding-left: var(--spacer-x1);
    }

    .footer {
        align-items: center;
    }
}    

@media screen and (min-width: 1024px) {

    .footer-info {
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        padding-top: var(--spacer-x1);
    }

    .footer-container {
        gap: var(--spacer-x2);
        row-gap: var(--spacer-x1);
    }

    .separator {
        display: inline-block;
    }

    .footer-info {
        width: 69rem;
    }

    .wide-column {
        grid-column: span 6;
        margin: 0 auto;    
    }

    .footer-logo {
        width: 17rem;
        height: 5rem;
    }

    .footer-contact-info {
        flex-direction: row;
        justify-content: space-between;
        gap: var(--spacer-x2-5);
    }
}

@media screen and (min-width: 1300px) {
    .footer-container {
        width: 100%;

    }

}


</style>