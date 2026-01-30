/**
 * @File        : media.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2026-01-30
 * @Description : Media Module
 * @Site        : https://github.com/xynerzy
 **/

const getResource = (pth: any) => new URL(pth, import.meta.url).href;

export {
  getResource
};