/**
 * @File        : main.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2026-01-30
 * @Description : Main
 * @Site        : https://github.com/xynerzy
 **/
import { createApp } from 'vue';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/rating/rating.js';
import '@/assets/style/style.scss';
import App from '@/app.vue';

createApp(App).mount('#app');
