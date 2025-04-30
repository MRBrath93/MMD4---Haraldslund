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
  ],
});

export default router;