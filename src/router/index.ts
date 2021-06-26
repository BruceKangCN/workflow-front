import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProcessModelerView from '../views/ProcessModelerView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/process-modeler', component: ProcessModelerView },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
