import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProcessModelerView from '../views/ProcessModelerView.vue';
import DecisionModelerView from '../views/DecisionModelerView.vue';
import FormEditorView from '../views/FormEditorView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/process-modeler', component: ProcessModelerView },
  { path: '/decision-modeler', component: DecisionModelerView },
  { path: '/form-editor', component: FormEditorView },
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
