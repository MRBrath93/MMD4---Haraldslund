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
import HaraldslundCafé from '@/views/HaraldslundCaféView.vue';
import HaraldslundHistorie from '@/views/HaraldslundHistorieView.vue';
import HaraldslundPersonale from '@/views/HaraldslundPersonaleView.vue';
import HaraldslundBibliotek from '@/views/HaraldslundBibliotekView.vue';
import HaraldslundFirmaaftaler from '@/views/HaraldslundFirmaaftalerView.vue';
import HaraldslundBrugerraad from '@/views/HaraldslundBrugerraadView.vue';
import Booking from '@/views/BookingView.vue';
import ModerOgKonferencer from '@/views/ModerOgKonferencerView.vue';

const router = createRouter({
  history: createWebHashHistory(), // Brug hash-baseret historik
  routes: [
    {
      path: '/forside',
      component: Frontpage,
      name: 'frontpage',
      meta: {
        title: 'Forside - Haraldslund',
      }
    },
    {
      path: '/vand-og-wellness',
      component: VandOgWellness,
      name: 'vandogwellness',
      meta: {
        title: 'Vand & Wellness - Haraldslund',
      }
    },
    {
      path: '/vand-og-wellness_holdoversigt',
      component: HoldoversigtVandOgWellness,
      name: 'holdoversigt-vandogwellness',
      meta: {
        title: 'Holdoversigt - Vand & Wellness - Haraldslund',
      }
    },
    {
      path: '/vand-og-wellness_priser',
      component: VWPriser,
      name: 'priser-vandogwellness',
      meta: {
        title: 'Priser - Vand & Wellness - Haraldslund',
      }
    },
    {
      path: '/vand-og-wellness_regler',
      component: VWRegler,
      name: 'regler-vandogwellness',
      meta: {
        title: 'Vand & Wellness - Regler - Haraldslund',
      }
    },
    {
      path: '/vand-og-wellness_svommehallen',
      component: VWSvoemmehallen,
      name: 'svommehallen-vandogwellness',
      meta: {
        title: 'Svømmehallen - Vand & Wellness - Haraldslund',
      }
    },
    {
      path: '/wellness_svommehallen',
      component: VWWellness,
      name: 'wellness-vandogwellness',
      meta: {
        title: 'Wellness - Vand & Wellness - Haraldslund',
      }
    },
    {
      path: '/motion',
      component: Motion,
      name: 'motion',
      meta: {
        title: 'Motion - Haraldslund',
      }
    },
    {
      path: '/om-motioncenteret',
      component: MOmMotionscenteret,
      name: 'om-motionscenteret',
      meta: {
        title: 'Om Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_priser',
      component: MPriser,
      name: 'priser-motionscenteret',
      meta: {
        title: 'Priser - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_regler',
      component: MRegler,
      name: 'regler-motionscenteret',
      meta: {
        title: 'Regler - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_leje-af-sal-og-instruktor',
      component: MLejeAfSalogInstruktor,
      name: 'leje-af-sal-og-instruktor-motionscenteret',
      meta: {
        title: 'Leje af sal og instruktør - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_personlig-traening',
      component: MPersonligTraening,
      name: 'personlig-traening-motionscenteret',
      meta: {
        title: 'Personlig træning - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_holdoversigt',
      component: MHoldoversigt,
      name: 'holdoversigt-motionscenteret',
      meta: {
        title: 'Holdoversigt - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/motioncenteret_sundhed-i-bevaegelse',
      component: MSIB,
      name: 'sib-motionscenteret',
      meta: {
        title: 'Sundhed i bevægelse - Motioncenteret - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund',
      component: OmHaraldslund,
      name: 'om-haraldslund',
      meta: {
        title: 'Om Haraldslund - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_priser',
      component: HaraldslundPriser,
      name: 'haraldslund-priser',
      meta: {
        title: 'Priser - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_café-harald',
      component: HaraldslundCafé,
      name: 'haraldslund-café',
      meta: {
        title: 'Café Harald - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_vores-historie',
      component: HaraldslundHistorie,
      name: 'haraldslund-historie',
      meta: {
        title: 'Vores historie - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_personale',
      component: HaraldslundPersonale,
      name: 'haraldslund-personale',
      meta: {
        title: 'Personale - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_bibliotek',
      component: HaraldslundBibliotek,
      name: 'haraldslund-bibliotek',
      meta: {
        title: 'Bibliotek - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_firmaaftaler',
      component: HaraldslundFirmaaftaler,
      name: 'haraldslund-firmaaftaler',
      meta: {
        title: 'Firmaaftaler - Haraldslund',
      }
    },
    {
      path: '/om-haraldslund_brugerraad',
      component: HaraldslundBrugerraad,
      name: 'haraldslund-brugerraad',
      meta: {
        title: 'Brugerraad - Haraldslund',
      }
    },
    {
      path: '/moder-og-konferencer',
      component: ModerOgKonferencer,
      name: 'moder-og-konferencer',
      meta: {
        title: 'Møder og konferencer - Haraldslund',
      }
    },
    {
      path: '/booking',
      component: Booking,
      name: 'booking',
      meta: {
        title: 'Booking - Haraldslund',
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
