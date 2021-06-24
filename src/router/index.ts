import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ModelerView from '../views/ModelerView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: HomeView },
  { path: '/modeler', component: ModelerView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
