<script setup>
import { RouterLink } from "vue-router";
import { ref } from "vue";

</script>

<template>
    <footer class="footer">
        <div class=footer-container>
                <div>
                    <h4 class="footer-headline">Navigation</h4>
                    <ul>
                        <li>
                            <router-link :to="{ name: 'frontpage' }">Forside</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'om-haraldslund' }"> Om Haraldslund</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'motion' }">Motion</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'vandogwellness' }">Vand & Wellness</router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'moder-og-konferencer' }">Møder & Konferencer</router-link>
                        </li>
                        <li>
                            <a href="#">Booking</a>
                        </li>
                    </ul>
                </div>
                <div>
                <h4 class="footer-headline">Genveje</h4>
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
                        <a href="https://www.findsmiley.dk/22876">Smiley-rapport</a>
                    </li>
                    <li>
                        <a href="http://www.aalborgkommune.dk/">Aalborg Kommune</a>
                    </li>
                </ul>
                </div>
                <div>
                    <h4 class="footer-headline">For medlemmer</h4>
                    <ul>
                        <li>
                            <router-link :to="{ name: 'haraldslund-bibliotek' }">Bibliotek</router-link>
                        </li>
                        <li>
                            <a href="#">Events</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-headline">Tilgængelighed</h4>
                    <ul>
                        <li>
                            <a href="https://was.digst.dk/haraldslund-com">Tilgængelighedserklæring</a>
                        </li>
                        <li>
                            <button>Læs højt</button>
                        </li>
                        <li>
                            <button>Skift farvetema</button>
                        </li>
                    </ul>
                </div>
                <div class="large-column">
                    <h4 class="footer-headline">Åbningstider</h4>
                    <div id="opening-hours-container">
                        <ul class="opening-hours">
                            <li> Mandag - Torsdag:</li>
                            <li> Fredag:</li>
                            <li> Lør-, søn- & helligdage:</li>
                        </ul>
                        <ul class="opening-hours">
                            <li> 06:30 - 20:30</li>
                            <li> 06:30 - 18:00</li>
                            <li> 08:00 - 15:30</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="footer-column">
                <div>
                    <img src="../assets/images/image-removebg-preview.png" class="footer-logo" alt="Logo Haraldslund" />
    
                </div>
                <div class="footer-icons">
                    <img src="../assets/images/instagram_Glyph_White.png" class="social-icon" alt="Logo Instagram" />
                    <img src="../assets/images/Facebook_Logo_Secondary.png" class="social-icon" alt="Logo Facebook" />
                    <img src="../assets/images/DK_Logo.png" class="payment-icon" alt="Logo DK" />

                </div>
                <div class="footer-info">
                    <p> Kastetvej 83 9000 Aalborg</p>
                    <img src="../assets/images/separator.png" class="separator" alt="Line separation" aria-hidden="true" />
                    <p> Tlf: 99 31 67 50</p>
                    <img src="../assets/images/separator.png" class="separator" alt="Line separation" aria-hidden="true" />
                    <p> Haraldslund@aalborg.dk</p>
                    <img src="../assets/images/separator.png" class="separator" alt="Line separation" aria-hidden="true" />
                    <p> CVR: 29189420</p>
                </div>
            </div>
    </footer>
</template>
<style scoped>

footer {
    background-color: var(--color-navigation);
    color: var(--color-font-2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: var(--spacer-x1) var(--spacer-x3);
}

footer ul {
    list-style-type: none;

}

footer li a {
    color: var(--color-font-2);
    font-size: 1.25rem;
    padding-bottom: var(--spacer-x0-5);
}

footer li button {
    background-color: transparent;
    border: none;
    color: var(--color-font-2);
    font-size: 1.25rem;
    padding-bottom: var(--spacer-x0-5);
    padding-left: 1px;
    padding-top: 0.2rem;
    border: none;
    cursor: pointer;
}


footer p, footer li {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-font-2);

}

footer li a:hover, footer li button:hover {
    text-decoration: underline;
    text-underline-offset: 0.5rem;
}

.footer-logo {
    width: 17rem;
    height: 5rem;
}

footer div {
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

footer h4 {
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
    justify-content: flex-start;
    gap: 0.6rem;
    width: 13.5rem;
}

#opening-hours-container {
    display: flex;
    justify-content: space-between;
    gap: var(--spacer-x1);
    flex-wrap: wrap;
}

.separator {
    display: none;
}

@media screen and (min-width: 768px) {
    .footer-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        width: 100%;
    }


    .footer-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
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
        gap: var(--spacer-x3);
    }

    .separator {
        display: inline-block;
    }

    .footer-info {
        width: 69rem;
    }
}
</style>