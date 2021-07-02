import { createRouter, createWebHashHistory, RouteRecordRaw, Router } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProcessModelerView from '@/views/ProcessModelerView.vue';
import DecisionModelerView from '@/views/DecisionModelerView.vue';
import FormEditorView from '@/views/FormEditorView.vue';
import ProcessView from '@/views/ProcessView.vue';

/**
 * 路由记录
 *
 * @private
 * @static
 * @readonly
 * @memberof Router
 */
const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  { path: '/process-modeler', component: ProcessModelerView },
  { path: '/decision-modeler', component: DecisionModelerView },
  { path: '/form-editor', component: FormEditorView },
  { path: '/process', component: ProcessView },
];

/**
 * 路由器
 *
 * @static
 * @readonly
 */
const router: Router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default  router;
