import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import ModelerView from '../views/ModelerView.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  { path: '/modeler', component: ModelerView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
