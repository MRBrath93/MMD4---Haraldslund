import { createRouter, createWebHashHistory } from 'vue-router';
import Frontpage from '@/views/ForsideView.vue';
import VandOgWellness from '@/views/Vand&WellnessView.vue';
import HoldoversigtVandOgWellness from '@/views/VWHoldoversigtView.vue';
import VWPriser from '@/views/VWPriserView.vue';
import VWRegler from '@/views/VWReglerView.vue';
import VWSvoemmehallen from '@/views/VWSvoemmehallenView.vue';
import VWWellness from '@/views/VWWellnessView.vue';

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
  ],
});

export default router;