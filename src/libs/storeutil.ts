/**
 * @File        : storeutil.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2025-12-29
 * @Description : Store control
 * @Site        : https://github.com/xynerzy
 **/

import * as C from '@/libs/constants';
import log from '@/libs/log';
import values from '@/libs/values';

import { type PiniaPluginContext } from 'pinia';

const storeutil = {
  checkExpire(ctx: PiniaPluginContext<any, any>) {
    let ret = { };
    const sid = ctx?.store?.$id || '';
    const curtime = new Date().getTime();
    try {
      /* Check if there is an object stored in Localstorage */
      let data: any = localStorage.getItem(sid);
      if (data.startsWith('{')) {
        data = JSON.parse(data);
      } else {
        try {
          data = storeutil.crypto.deserialize(data);
        } catch (ignore) { }
      }
      /* It will be deleted after the expiration time. */
      checkSubExpired(data, sid, curtime);
      if (data?.expireTime <= curtime) {
        localStorage.removeItem(sid);
      } else {
        ret = data;
      }
    } catch (e) {
      localStorage.removeItem(sid);
    }
    return ret;
  },
  crypto: {
    serialize: (obj: any) => {
      let ret = '';
      // try {
      //     const str = JSON.stringify(obj)
      //     ret = values.enc(str)
      // } catch (ignore) { }
      return ret;
    },
    deserialize: (enc: any) => {
      let ret = {};
      // try {
      //     const dec = values.dec(enc)
      //     ret = JSON.parse(dec)
      // } catch (ignore) { }
      return ret;
    }
  }
}

const checkSubExpired = (data: any, parent: string, curtime: number) => {
  for (const k in data) {
    const item = data[k];
    if (item && item.expireTime && item.expireTime <= curtime) {
      delete data[k];
    }
    if (item instanceof Array || item instanceof Object) {
      checkSubExpired(item, parent, curtime);
    }
  }
}

export { storeutil };