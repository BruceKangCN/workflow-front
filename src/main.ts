/* eslint-disable max-len */
import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';

createApp(App).use(router).mount('#app');

// 在非生产环境下提示设置本地环境变量
if (process.env.NODE_ENV !== 'production') {
  console.warn([
    `You are in ${process.env.NODE_ENV} mode.`,
    `Remember to set the variables below in your .env.${process.env.NODE_ENV}.local file in the root directory,`,
    'and DON\'T FORGET to restart the service after making changes:',
    `    VUE_APP_REST_API_URL(${process.env.VUE_APP_REST_API_URL}): the REST API url for process engine`,
  ].join('\n'));
}
