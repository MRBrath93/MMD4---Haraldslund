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
    },
    {
      path: '/vand-og-wellness',
      component: VandOgWellness,
      name: 'vandogwellness',
    },
    {
      path: '/vand-og-wellness_holdoversigt',
      component: HoldoversigtVandOgWellness,
      name: 'holdoversigt-vandogwellness',
    },
    {
      path: '/vand-og-wellness_priser',
      component: VWPriser,
      name: 'priser-vandogwellness',
    },
    {
      path: '/vand-og-wellness_regler',
      component: VWRegler,
      name: 'regler-vandogwellness',
    },
    {
      path: '/vand-og-wellness_svommehallen',
      component: VWSvoemmehallen,
      name: 'svommehallen-vandogwellness',
    },
    {
      path: '/wellness_svommehallen',
      component: VWWellness,
      name: 'wellness-vandogwellness',
    },
    {
      path: '/motion',
      component: Motion,
      name: 'motion',
    },
    {
      path: '/om-motioncenteret',
      component: MOmMotionscenteret,
      name: 'om-motionscenteret',
    },
    {
      path: '/motioncenteret_priser',
      component: MPriser,
      name: 'priser-motionscenteret',
    },
    {
      path: '/motioncenteret_regler',
      component: MRegler,
      name: 'regler-motionscenteret',
    },
    {
      path: '/motioncenteret_leje-af-sal-og-instruktor',
      component: MLejeAfSalogInstruktor,
      name: 'leje-af-sal-og-instruktor-motionscenteret',
    },
    {
      path: '/motioncenteret_personlig-traening',
      component: MPersonligTraening,
      name: 'personlig-traening-motionscenteret',
    },
    {
      path: '/motioncenteret_holdoversigt',
      component: MHoldoversigt,
      name: 'holdoversigt-motionscenteret',
    },
    {
      path: '/motioncenteret_sundhed-i-bevaegelse',
      component: MSIB,
      name: 'sib-motionscenteret',
    },
    {
      path: '/om-haraldslund',
      component: OmHaraldslund,
      name: 'om-haraldslund',
    },
    {
      path: '/om-haraldslund_priser',
      component: HaraldslundPriser,
      name: 'haraldslund-priser',
    },
    {
      path: '/om-haraldslund_café-harald',
      component: HaraldslundCafé,
      name: 'haraldslund-café',
    },
    {
      path: '/om-haraldslund_vores-historie',
      component: HaraldslundHistorie,
      name: 'haraldslund-historie',
    },
    {
      path: '/om-haraldslund_personale',
      component: HaraldslundPersonale,
      name: 'haraldslund-personale',
    },
    {
      path: '/om-haraldslund_bibliotek',
      component: HaraldslundBibliotek,
      name: 'haraldslund-bibliotek',
    },
    {
      path: '/om-haraldslund_firmaaftaler',
      component: HaraldslundFirmaaftaler,
      name: 'haraldslund-firmaaftaler',
    },
    {
      path: '/om-haraldslund_brugerraad',
      component: HaraldslundBrugerraad,
      name: 'haraldslund-brugerraad',
    },
    {
      path: '/moder-og-konferencer',
      component: ModerOgKonferencer,
      name: 'moder-og-konferencer',
    },
    {
      path: '/booking',
      component: Booking,
      name: 'booking',
    },
  ],
});

export default router;
