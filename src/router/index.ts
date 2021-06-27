import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProcessModelerView from '../views/ProcessModelerView.vue';
import DecisionModelerView from '../views/DecisionModelerView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/process-modeler', component: ProcessModelerView },
  { path: '/decision-modeler', component: DecisionModelerView },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
