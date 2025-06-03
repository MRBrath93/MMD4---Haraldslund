import { createRouter, createWebHashHistory } from 'vue-router';
import Frontpage from '@/views/ForsideView.vue';
import VandOgWellness from '@/views/Vand&WellnessView.vue';
import HoldoversigtVandOgWellness from '@/views/VWHoldoversigtView.vue';
import VWPriser from '@/views/VWPriserView.vue';
import VWRegler from '@/views/VWReglerView.vue';
import VWSvoemmehallen from '@/views/VWSvoemmehallenView.vue';
import VWWellness from '@/views/VWWellnessView.vue';
import Motion from '@/views/MotionView.vue';
import MOmMotionscenteret from '@/views/MOmMotionscenteretView.vue';
import MPriser from '@/views/MPriserView.vue';
import MRegler from '@/views/MReglerView.vue';
import MLejeAfSalogInstruktor from '@/views/MLejeAfSalogInstruktorView.vue';
import MPersonligTraening from '@/views/MPersonligtraeningView.vue';
import MHoldoversigt from '@/views/MHoldoversigtView.vue';
import MSIB from '@/views/MSIBView.vue';
import OmHaraldslund from '@/views/HaraldslundView.vue';
import HaraldslundPriser from '@/views/HaraldslundPriserView.vue';
import HaraldslundCafe from '@/views/HaraldslundCafeView.vue';
import HaraldslundHistorie from '@/views/HaraldslundHistorieView.vue';
import HaraldslundPersonale from '@/views/HaraldslundPersonaleView.vue';
import HaraldslundBibliotek from '@/views/HaraldslundBibliotekView.vue';
import HaraldslundFirmaaftaler from '@/views/HaraldslundFirmaaftalerView.vue';
import HaraldslundBrugerraad from '@/views/HaraldslundBrugerraadView.vue';
import Booking from '@/views/BookingView.vue';
import ModerOgKonferencer from '@/views/ModerOgKonferencerView.vue';
import HaraldslundPraktiskInfo from '@/views/HaraldslundPraktiskInfo.vue';
import MEnkeltHoldView from '@/views/MEnkeltHoldView.vue';
import VWEnkeltHoldView from '@/views/VWEnkeltHoldView.vue';
import EventsView from '@/views/EventsView.vue';
import AktivitetsoversigtView from '@/views/AktivitetsoversigtView.vue';
import { useClassesStoreMotion } from '@/stores/motion-classes';
import { useClassesStoreWater } from '@/stores/water-classes';

const router = createRouter({
  history: createWebHashHistory(), // Brug hash-baseret historik
  routes: [
    {
      path: '/',
      component: Frontpage,
      name: 'frontpage',
      meta: {
        title: 'Forside - Haraldslund',
        breadcrumb: 'Forside',
        description: 'Velkommen til Haraldslund vand- og kulturhus, hvor du kan finde information om vores faciliteter, hold og aktiviteter.',
      }
    },
    {
      path: '/vand-og-wellness',
      children: [
        {
          path: '',
          component: VandOgWellness,
          name: 'vandogwellness',
          meta: {
            title: 'Vand & Wellness - Haraldslund',
            breadcrumb: 'Vand & Wellness',
            description: 'Se vores tilbud inden for vand og wellness, herunder svømmehal, wellness-område og forskellige holdaktiviteter.',

          },
        },
        {
          path: 'holdoversigt',
          children: [
            {
              path: '',
              component: HoldoversigtVandOgWellness,
              name: 'holdoversigt-vandogwellness',
              meta: {
                title: 'Holdoversigt - Vand & Wellness - Haraldslund',
                breadcrumb: 'Holdoversigt',
                description: 'Se vores holdoversigt for Vand & Wellness, hvor du kan se alle de forskellige hold, vi tilbyder.',

              }
            },
            {
              path: ':id',
              component: VWEnkeltHoldView,
              name: 'holdbeskrivelse-vandogwellness',
              meta: {
                title: 'Holdbeskrivelse - Vand & Wellness - Haraldslund',
                breadcrumb: 'Holdbeskrivelse',
                description: 'Her kan du læse mere om det specifikke hold, find tidspunkter, og niveau.',
              },
            },
          ]
        },
        {
          path: 'priser',
          component: VWPriser,
          name: 'priser-vandogwellness',
          meta: {
            title: 'Priser - Vand & Wellness - Haraldslund',
            breadcrumb: 'Priser',
            description: 'Find information om priser for adgang til svømmehal, wellness-område og holdaktiviteter.',

          }
        },
        {
          path: 'regler',
          component: VWRegler,
          name: 'regler-vandogwellness',
          meta: {
            title: 'Vand & Wellness - Regler - Haraldslund',
            breadcrumb: 'Regler',
            description: 'Læs vores regler for brug af svømmehal og wellness-område',
          }
        },
        {
          path: 'svommehallen',
          component: VWSvoemmehallen,
          name: 'svommehallen-vandogwellness',
          meta: {
            title: 'Svømmehallen - Vand & Wellness - Haraldslund',
            breadcrumb: 'Svømmehallen',
            description: 'Oplev vores svømmehal med forskellige bassiner og aktiviteter for hele familien.',
          }
        },
        {
          path: 'wellness',
          component: VWWellness,
          name: 'wellness-vandogwellness',
          meta: {
            title: 'Wellness - Vand & Wellness - Haraldslund',
            breadcrumb: 'Wellness',
            description: 'Forkæl dig selv i vores wellness-område med sauna, dampbad og afslapningsområder.',
          }
        },
      ]
    },
    {
      path: '/motion',
      children: [
        {
          path: '',
          component: Motion,
          name: 'motion',
          meta: {
            title: 'Motion - Haraldslund',
            breadcrumb: 'Motion',
            description: 'Oplev vores motionstilbud, herunder motionscenter, holdaktiviteter og personlig træning.',
          }
        },
        {
          path: 'om-motioncenteret',
          component: MOmMotionscenteret,
          name: 'om-motionscenteret',
          meta: {
            title: 'Om Motioncenteret - Haraldslund',
            breadcrumb: 'Om Motioncenteret',
            description: 'Læs om vores motionscenter, faciliteter og hvad vi tilbyder.',
          }
        },
        {
          path: 'priser',
          component: MPriser,
          name: 'priser-motionscenteret',
          meta: {
            title: 'Priser - Motioncenteret - Haraldslund',
            breadcrumb: 'Priser',
            description: 'Find information om priser for adgang til motionscenteret og personlig træning.',
          }
        },
        {
          path: 'regler',
          component: MRegler,
          name: 'regler-motionscenteret',
          meta: {
            title: 'Regler - Motioncenteret - Haraldslund',
            breadcrumb: 'Regler',
            description: 'Læs vores regler for brug af motionscenteret.',
          }
        },
        {
          path: 'leje-af-sal-og-instruktor',
          component: MLejeAfSalogInstruktor,
          name: 'leje-af-sal-og-instruktor-motionscenteret',
          meta: {
            title: 'Leje af sal og instruktør - Motioncenteret - Haraldslund',
            breadcrumb: 'Leje af sal og instruktør',
            description: 'Se, hvordan du kan leje en sal og instruktør til dine egne arrangementer i Haraldslund Motioncenter.',
          }
        },
        {
          path: 'personlig-traening',
          component: MPersonligTraening,
          name: 'personlig-traening-motionscenteret',
          meta: {
            title: 'Personlig træning - Motioncenteret - Haraldslund',
            breadcrumb: 'Personlig træning',
            description: 'Få personlig træning i Haraldslund Motioncenter. Læs mere om vores personlige trænere',
          }
        },
        {
          path: 'holdoversigt',
          children: [
            {
              path: '',
              component: MHoldoversigt,
              name: 'holdoversigt-motionscenteret',
              meta: {
                title: 'Holdoversigt - Motioncenteret - Haraldslund',
                breadcrumb: 'Holdoversigt',
                description: 'Se vores holdoversigt for Motioncenteret, hvor du kan finde alle de forskellige hold, vi tilbyder.',
              }
            },
            {
              path: ':id',
              component: MEnkeltHoldView,
              name: 'holdbeskrivelse-motion',
              meta: {
                title: 'Holdbeskrivelse - Motion - Haraldslund',
                breadcrumb: 'Holdbeskrivelse',
                description: 'Læs mere om det specifikke motionshold, find tidspunkter og niveau.',
              }
            },
          ]
        },
        {
          path: 'sundhed-i-bevaegelse',
          component: MSIB,
          name: 'sib-motionscenteret',
          meta: {
            title: 'Sundhed i bevægelse - Motioncenteret - Haraldslund',
            breadcrumb: 'Sundhed & bevægelse',
            description: 'Læs om vores Sundhed i Bevægelse-program, der tilbyder træning og aktiviteter.',
          }
        },
      ]
    },
    {
      path: '/om-haraldslund',
      children: [
        {
          path: '',
          component: OmHaraldslund,
          name: 'om-haraldslund',
          meta: {
            title: 'Om Haraldslund - Haraldslund',
            breadcrumb: 'Om Haraldslund',
            description: 'Få indsigt i Haraldslunds historie, vores praktiske informationer, samt hvad vi tilbyder.',
          },
        },
        {
          path: 'priser',
          component: HaraldslundPriser,
          name: 'haraldslund-priser',
          meta: {
            title: 'Priser - Haraldslund',
            breadcrumb: 'Priser',
            description: 'Find information om priser for adgang til Haraldslund og vores forskellige faciliteter.',
          }
        },
        {
          path: 'praktisk-info',
          component: HaraldslundPraktiskInfo,
          name: 'haraldslund-praktisk-info',
          meta: {
            title: 'Praktisk Information - Haraldslund',
            breadcrumb: 'Praktisk Information',
            description: 'Find praktisk information om Haraldslund, herunder åbningstider, kontaktinformation og faciliteter.',
          }
        },
        {
          path: 'cafe-harald',
          component: HaraldslundCafe,
          name: 'haraldslund-cafe',
          meta: {
            title: 'Café Harald - Haraldslund',
            breadcrumb: 'Café Harald',
            description: 'Besøg Café Harald for en lækker bid mad eller en kop kaffe i hyggelige omgivelser.',
          }
        },
        {
          path: 'vores-historie',
          component: HaraldslundHistorie,
          name: 'haraldslund-historie',
          meta: {
            title: 'Vores historie - Haraldslund',
            breadcrumb: 'Historien',
            description: 'Lær om Haraldslunds lange spændende historie og hvordan vi har udviklet os gennem årene.',

          }
        },
        {
          path: 'personale',
          component: HaraldslundPersonale,
          name: 'haraldslund-personale',
          meta: {
            title: 'Personale - Haraldslund',
            breadcrumb: 'Personale',
            description: 'Mød vores dedikerede personale, der arbejder hårdt for at gøre din oplevelse i Haraldslund så god som muligt.',
          }
        },
        {
          path: 'bibliotek',
          component: HaraldslundBibliotek,
          name: 'haraldslund-bibliotek',
          meta: {
            title: 'Bibliotek - Haraldslund',
            breadcrumb: 'Bibliotek',
            description: 'Besøg Haraldslund Bibliotek for at låne bøger og afhente din bestillinger.',
          }
        },
        {
          path: 'firmaaftaler',
          component: HaraldslundFirmaaftaler,
          name: 'haraldslund-firmaaftaler',
          meta: {
            title: 'Firmaaftaler - Haraldslund',
            breadcrumb: 'Firmaaftaler',
            description: 'Læs om vores firmaaftaler, der tilbyder specielle vilkår for virksomheder og organisationer.',
          }
        },
        {
          path: 'brugerraad',
          component: HaraldslundBrugerraad,
          name: 'haraldslund-brugerraad',
          meta: {
            title: 'Brugerraad - Haraldslund',
            breadcrumb: 'Brugerråd',
            description: 'Læs om vores brugerråd, der repræsenterer brugerne af Haraldslund.',
          }
        },
        {
          path: 'events',
          component: EventsView,
          name: 'haraldslund-events',
          meta: {
            title: 'Events - Haraldslund',
            breadcrumb: 'Events',
            description: 'Hold dig opdateret med de seneste events og arrangementer i Haraldslund.',
          }
        },
        {
          path: 'aktivitetsoversigt',
          component: AktivitetsoversigtView,
          name: 'haraldslund-aktivitetsoversigt',
          meta: {
            title: 'Aktivitetsoversigt - Haraldslund',
            breadcrumb: 'Aktivitetsoversigt',
            description: 'Se hvornår der er flest mennesker i Haraldslund',
          }
        },
      ]
    },
    {
      path: '/moder-og-konferencer',
      component: ModerOgKonferencer,
      name: 'moder-og-konferencer',
      meta: {
        title: 'Møder og Events - Haraldslund',
        breadcrumb: 'Møder og Events',
        description: 'Planlæg dit næste møde eller event i Haraldslund med vores moderne faciliteter.',
      }
    },
    {
      path: '/booking',
      component: Booking,
      name: 'booking',
      meta: {
        title: 'Booking - Haraldslund',
        breadcrumb: 'Booking',
        description: 'Book dine aktiviteter, hold eller faciliteter i Haraldslund nemt online.',
      }
    },
  ],

  // Scroll-adfærd ved navigation i Vue Router
  scrollBehavior(to, from, savedPosition) {
    // Hvis brugeren bruger browserens "tilbage"-knap, behold scrollpositionen
    if (savedPosition) {
      return savedPosition;
    } else {
      // Ellers scroll til toppen af siden ved navigation
      return { top: 0 };
    }
  }
});

export default router;

// Global navigationfunktion, der kører før hver route-skift
router.beforeEach((to, from, next) => {
  const defaultTitle = 'Haraldslund';

  // Sæt dokumentets titel til den titel, der er defineret i route meta, ellers brug standardtitel
  document.title = to.meta.title || defaultTitle;

  // Hent meta description for den nye route
  const description = to.meta.description;

  // Find det eksisterende meta-tag for beskrivelse i dokumentets head
  let tag = document.querySelector("meta[name='description']");

  // Hvis meta-tagget ikke findes, opret det og tilføj det til head
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', 'description');
    document.head.appendChild(tag);
  }

  // Sæt eller opdater meta description indholdet til route-specifik beskrivelse eller en standardtekst
  tag.setAttribute('content', description || 'Velkommen til Haraldslund, hvor du kan finde information om vores faciliteter, hold og aktiviteter.');

  // Fortsæt navigationen
  next();
});

// INSPIRATIONSKILDE NESTED ROUTING: Guide - Essentials - Nested Routes. Vue Router. 2014 Evan You, Eduardo San Martin Morote. [Accessed 14/05/2025] URL: https://router.vuejs.org/guide/essentials/nested-routes