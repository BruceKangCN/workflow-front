import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import AppHome from '../views/AppHome.vue';
import ModelerView from '../views/ModelerView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: AppHome },
  { path: '/modeler', component: ModelerView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
