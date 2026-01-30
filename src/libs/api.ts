/**
 * @File        : api.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2025-12-29
 * @Description : api communication module
 * @Site        : https://github.com/xynerzy
 **/
/** polyfills for old browsers */
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import * as C from '@/libs/constants';
import app from './app-context';
import crypto from './crypto';
import dialog from './dialog-context';
import proc from './proc';
import { Function1, type Function0 } from 'lodash';

type OptType = {
  method?: String
  apicd?: String
  resolve?: Function
  reject?: Function
  complete?: Function
  /** for timeout abort */
  abortclr?: Function
} & Record<string, any>

const { putAll, getConfig, log } = app;
const keepalive = true;

/* Creates communication headers that are basically used */
const init = async (method: string, apicd: string, data?: any, opt?: any) => {
  if (!opt?.noprogress) { dialog.progress(true); }
  const headers = putAll({}, opt?.headers || {});
  const timeout = opt?.timeout || (getConfig()?.api[0] || {})?.timeout || 10000;
  /* Create an AbortController to implement timeout (for older browsers) */
  const abortctl = new AbortController();
  const signal = abortctl.signal;
  const url = api.mkuri(apicd);

  let body: any = '';
  if (!headers[C.CONTENT_TYPE]) {
    headers[C.CONTENT_TYPE] = C.CTYPE_JSON;
  }
  if (String(headers[C.CONTENT_TYPE]).startsWith(C.CTYPE_JSON)) {
    body = JSON.stringify(data || {});
  } 
  /* If the request is not processed within the timeout period, an abort signal is generated. */
  const hndtimeout = setTimeout(() => abortctl.abort(), timeout);
  /* Clear to prevent an abort signal from occurring when normal processing is completed. */
  const abortclr = () => clearTimeout(hndtimeout);
  return { method, url, body, headers, signal, abortclr };
}

/* Communication result processing */
const mkres = async (run: Function0<Promise<Response>>, opt?: OptType) => {
  // log.debug('MK-RES..', opt);
  let ret: any = { }
  let resp = { } as Response;
  let hdrs = { } as Headers;
  let t: any = '';
  const state = { error: false, message: '' };
  try {
    resp = await run();
    hdrs = resp?.headers || { get: (v: any) => {} };
    /* Normal processing has been completed, the abort signal is canceled. */
    opt?.abortclr && opt.abortclr();
    /* If a sign-in JWT token is found in the communication result header, it is stored in the token storage. */
    if ((t = hdrs.get(C.AUTHORIZATION.toLowerCase()))) {
      const auth: string[] = String(t).split(' ');
      if (auth.length > 1 && auth[0] === C.BEARER) {
        const current = new Date().getTime();
        const decval = String(crypto.aes.decrypt(auth[1]) || '').split(' ');
        log.debug('AUTH:', decval);
        if (decval && decval.length > 5) {
          /* TODO: sign-in process */
          log.debug('CHECK:', decval[3].length, decval[3]);
          // userContext.checkExpire();
        } else if (decval && decval.length > 3) {
          /* TODO: sign-in extend process */
          /* check expiry */
          // userContext.checkExpire();
        }
      }
    }
  } catch(e) { 
    resp = {
      headers: {},
      status: C.SC_UNKNOWN,
      error: true,
      json: async () => ({ message: 'unknown error' })
    } as any
  }
  /* Error handling based on status value */
  let msgcode = async () => (await (resp?.json && resp.json()))?.message
  switch (resp.status) {
  case C.SC_BAD_GATEWAY:
  case C.SC_GATEWAY_TIMEOUT:
  case C.SC_INTERNAL_SERVER_ERROR:
  case C.SC_RESOURCE_LIMIT_IS_REACHED:
  case C.SC_SERVICE_UNAVAILABLE: {
    putAll(state, { error: true, message: `INTERNAL-SERVER-ERROR`, msgcode: await msgcode() })
  } break
  case C.SC_UNAUTHORIZED: {
    putAll(state, { error: true, message: `SIGN-IN-REQUIRED`, msgcode: await msgcode() })
    // await userContext.logout(false)
  } break
  case C.SC_FORBIDDEN: {
    putAll(state, { error: true, message: `FORBIDDEN`, msgcode: await msgcode() })
  } break
  case C.SC_NOT_FOUND:
  case C.SC_BAD_REQUEST: {
    putAll(state, { error: true, message: `BAD-REQUEST`, msgcode: await msgcode() })
  } break
  case C.SC_UNKNOWN: {
    putAll(state, { error: true, message: `UNKNOWN-ERROR`, msgcode: await msgcode() })
  }
  case C.SC_OK: {
  } break
  default: }

  /* If normal, return the result value */
  if (!state.error) {
    switch (String(hdrs.get('content-type')).toLowerCase().split(/[ ]*;[ ]*/)[0]) {
    /* when result type is JSON */
    case 'application/json': {
      ret = await resp.json()
    } break
    /* when result type is  OCTET-STREAM (Download) */
    case 'application/octet-stream': {
      ret = await resp.blob()
    } break
    default: }
    if (opt?.resolve) { opt.resolve(ret) }
    if (opt?.apicd !== 'ping' && opt?.complete) { opt.complete(ret) }
  } else {
    if (!(opt?.noerror || opt?.noalert)) {
      // await app.until(() => app.astate() >= C.APPSTATE_READY)
      dialog.alert(state.message)
      ret = opt?.reject && opt.reject(state) || {} 
      ret = opt?.reject && opt.reject(state) || {} 
    } else if (!opt?.noerror) {
      ret = opt?.reject && opt.reject(state) || {} 
    }
    if (opt?.apicd !== 'ping' && opt?.complete) { opt.complete(ret) }
  }
  if (!opt?.noprogress) { dialog.progress(false) }
  return ret
}

const api = {
  nextping: 0,
  /* PING. used to health check for backend server. */
  async ping(opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      const apicd = `ping`
      const curtime = new Date().getTime()
      if (opt?.noping) { return resolve(true) }
      if (curtime < api.nextping) { return resolve(true) }
      const { method, headers, signal, url, abortclr } = await init(C.HEAD, apicd, {}, { noprogress: true })
      const run = () => fetch(url, { method, headers, signal, keepalive })
      const res: any = await mkres(run, putAll(opt || {}, { apicd, method, resolve, reject, abortclr }))
      /* 다음 ping 은 10초 이후 */
      api.nextping = curtime + (1000 * 10)
      return res
    })
  },
  /* process POST method */
  async post(apicd: string, data?: any, opt?: OptType) {
    return new Promise<any>(async (resolve, reject) => {
      await proc.until(() => app.ready(), { maxcheck: 1000, interval: 10 })
      await api.ping(opt)
      const { method, url, body, headers, signal, abortclr } = await init(C.POST, apicd, data, opt)
      const run = () => fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(run, putAll(opt || {}, { apicd, method, resolve, reject, abortclr }))
    })
  },
  /* process GET method */
  async get(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      // if (apicd !== 'cmn01001') { await proc.until(() => app.ready(), { maxcheck: 1000, interval: 10 }) }
      await api.ping(opt)
      const { method, url, headers, signal, abortclr } = await init(C.GET, apicd, data, opt)
      const run = () => fetch(url, { method, headers, signal, keepalive })
      return await mkres(run, putAll(opt || {}, { apicd, method, resolve, reject, abortclr }))
    })
  },
  /* process PUT method */
  async put(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await proc.until(() => app.ready(), { maxcheck: 1000, interval: 10 })
      await api.ping(opt)
      const { method, url, body, headers, signal, abortclr } = await init(C.PUT, apicd, data, opt)
      const run = () => fetch(url, { method, body, headers, signal, keepalive })
      return await mkres(run, putAll(opt || {}, { apicd, method, resolve, reject, abortclr }))
    })
  },
  /* process DELETE method */
  async delete(apicd: string, data?: any, opt?: any) {
    return new Promise<any>(async (resolve, reject) => {
      await proc.until(() => app.ready(), { maxcheck: 1000, interval: 10 })
      await api.ping(opt)
      const { method, headers, signal, url, abortclr } = await init(C.DELETE, apicd, data, opt)
      const run = () => fetch(url, { method, headers, signal, keepalive })
      return await mkres(run, putAll(opt || {}, { apicd, method, resolve, reject, abortclr }))
    })
  },
  /* Reassemble the URL into the correct format */
  mkuri(apicd: string) {
    // const mat: any = apicd && /^([a-z]+)([0-9a-zA-Z]+)([/].*){0,1}$/g.exec(apicd) || {}
    const mat: any = apicd && /^([a-z]+)([0-9a-zA-Z_-]+)([/].*){0,1}$/g.exec(apicd) || {}
    if (mat && mat[1]) {
      // return `${(app.getConfig()?.api[0] || {})?.base || '/api'}/${mat[1]}/${mat[0]}`
      return `${(app.getConfig()?.api[0] || {})?.base || '/api'}/${mat[0]}`
    } else {
      return apicd
    }
  }
}

export default api