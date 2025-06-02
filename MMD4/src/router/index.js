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
              }
            },
            {
              path: ':id',
              component: VWEnkeltHoldView,
              name: 'holdbeskrivelse-vandogwellness',
              meta: {
                title: 'Holdbeskrivelse - Vand & Wellness - Haraldslund',
                breadcrumb: 'Holdbeskrivelse',
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
          }
        },
        {
          path: 'regler',
          component: VWRegler,
          name: 'regler-vandogwellness',
          meta: {
            title: 'Vand & Wellness - Regler - Haraldslund',
            breadcrumb: 'Regler',
          }
        },
        {
          path: 'svommehallen',
          component: VWSvoemmehallen,
          name: 'svommehallen-vandogwellness',
          meta: {
            title: 'Svømmehallen - Vand & Wellness - Haraldslund',
            breadcrumb: 'Svømmehallen',
          }
        },
        {
          path: 'wellness',
          component: VWWellness,
          name: 'wellness-vandogwellness',
          meta: {
            title: 'Wellness - Vand & Wellness - Haraldslund',
            breadcrumb: 'Wellness',
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
          }
        },
        {
          path: 'om-motioncenteret',
          component: MOmMotionscenteret,
          name: 'om-motionscenteret',
          meta: {
            title: 'Om Motioncenteret - Haraldslund',
            breadcrumb: 'Om Motioncenteret',
          }
        },
        {
          path: 'priser',
          component: MPriser,
          name: 'priser-motionscenteret',
          meta: {
            title: 'Priser - Motioncenteret - Haraldslund',
            breadcrumb: 'Priser',
          }
        },
        {
          path: 'regler',
          component: MRegler,
          name: 'regler-motionscenteret',
          meta: {
            title: 'Regler - Motioncenteret - Haraldslund',
            breadcrumb: 'Regler',
          }
        },
        {
          path: 'leje-af-sal-og-instruktor',
          component: MLejeAfSalogInstruktor,
          name: 'leje-af-sal-og-instruktor-motionscenteret',
          meta: {
            title: 'Leje af sal og instruktør - Motioncenteret - Haraldslund',
            breadcrumb: 'Leje af sal og instruktør',
          }
        },
        {
          path: 'personlig-traening',
          component: MPersonligTraening,
          name: 'personlig-traening-motionscenteret',
          meta: {
            title: 'Personlig træning - Motioncenteret - Haraldslund',
            breadcrumb: 'Personlig træning',
            description: 'Denne side handler om at kunne modtage personlig træning i Haraldslund Motioncenteret. Her kan du finde information om, hvordan du booker en personlig træner, priser og tilgængelige trænere.',

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
              }
            },
            {
              path: ':id',
              component: MEnkeltHoldView,
              name: 'holdbeskrivelse-motion',
              meta: {
                title: 'Holdbeskrivelse - Motion - Haraldslund',
                breadcrumb: 'Holdbeskrivelse',
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
          },
        },
        {
          path: 'priser',
          component: HaraldslundPriser,
          name: 'haraldslund-priser',
          meta: {
            title: 'Priser - Haraldslund',
            breadcrumb: 'Priser',
          }
        },
        {
          path: 'praktisk-info',
          component: HaraldslundPraktiskInfo,
          name: 'haraldslund-praktisk-info',
          meta: {
            title: 'Praktisk Information - Haraldslund',
            breadcrumb: 'Praktisk Information',
          }
        },
        {
          path: 'cafe-harald',
          component: HaraldslundCafe,
          name: 'haraldslund-cafe',
          meta: {
            title: 'Café Harald - Haraldslund',
            breadcrumb: 'Café Harald',
          }
        },
        {
          path: 'vores-historie',
          component: HaraldslundHistorie,
          name: 'haraldslund-historie',
          meta: {
            title: 'Vores historie - Haraldslund',
            breadcrumb: 'Historien',
          }
        },
        {
          path: 'personale',
          component: HaraldslundPersonale,
          name: 'haraldslund-personale',
          meta: {
            title: 'Personale - Haraldslund',
            breadcrumb: 'Personale',
          }
        },
        {
          path: 'bibliotek',
          component: HaraldslundBibliotek,
          name: 'haraldslund-bibliotek',
          meta: {
            title: 'Bibliotek - Haraldslund',
            breadcrumb: 'Bibliotek',
          }
        },
        {
          path: 'firmaaftaler',
          component: HaraldslundFirmaaftaler,
          name: 'haraldslund-firmaaftaler',
          meta: {
            title: 'Firmaaftaler - Haraldslund',
            breadcrumb: 'Firmaaftaler',
          }
        },
        {
          path: 'brugerraad',
          component: HaraldslundBrugerraad,
          name: 'haraldslund-brugerraad',
          meta: {
            title: 'Brugerraad - Haraldslund',
            breadcrumb: 'Brugerråd',
          }
        },
        {
          path: 'events',
          component: EventsView,
          name: 'haraldslund-events',
          meta: {
            title: 'Events - Haraldslund',
            breadcrumb: 'Events',
          }
        },
        {
          path: 'aktivitetsoversigt',
          component: AktivitetsoversigtView,
          name: 'haraldslund-aktivitetsoversigt',
          meta: {
            title: 'Aktivitetsoversigt - Haraldslund',
            breadcrumb: 'Aktivitetsoversigt',
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
      }
    },
    {
      path: '/booking',
      component: Booking,
      name: 'booking',
      meta: {
        title: 'Booking - Haraldslund',
        breadcrumb: 'Booking',
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Hvis du navigerer tilbage, behold positionen
    if (savedPosition) {
      return savedPosition;
    } else {
      // Ellers scroll til toppen
      return { top: 0 };
    }
  }
});

export default router;

// INSPIRATIONSKILDE NESTED ROUTING: Guide - Essentials - Nested Routes. Vue Router. 2014 Evan You, Eduardo San Martin Morote. [Accessed 14/05/2025] URL: https://router.vuejs.org/guide/essentials/nested-routes