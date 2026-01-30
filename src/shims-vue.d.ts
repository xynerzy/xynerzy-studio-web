/**
 * @File        : shims-vue.d.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2026-01-30
 * @Description : import types
 * @Site        : https://github.com/xynerzy
 **/
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
};