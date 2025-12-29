/**
 * @File        : log.ts
 * @Author      : lupfeliz@gmail.com
 * @Since       : 2025-12-29
 * @Description : A logger written similarly to Java's Logger, with dynamic leveling possible by setLevel. 
 * @Site        : https://github.com/xynerzy
 **/
import * as C from './constants'

const { FN_NIL, ROOT, TRACE, DEBUG, INFO, WARN, ERROR, UNDEFINED } = C

const fnclog = console.log
const fncinfo = console.info
const fnwarn = console.warn
const fnerrr = console.error

type LogCtxType = { [name: string]: Log }
type Levels = 'trace' | 'debug' | 'info' | 'warn' | 'error'
type AppenderType = typeof console | {
  log?: typeof FN_NIL,
  info?: typeof FN_NIL,
  warn?: typeof FN_NIL,
  error?: typeof FN_NIL
}

const logctx: LogCtxType = {
  ROOT: UNDEFINED as Log
}

class Log {
  constructor(namespace: string = ROOT, appender?: AppenderType) {
    if (namespace === undefined) { namespace = ROOT }
    logctx[namespace] = this
    let level = logctx[ROOT]?.level || DEBUG
    this.inst = this
    this.namespace = namespace
    this.setLevel(level, appender)
  }
  /* proxy setter 용 */
  private inst = UNDEFINED as any as Log
  private level: Levels = DEBUG
  private namespace = ROOT
  private appender: AppenderType = console
  trace = FN_NIL
  debug = fnclog
  info = fncinfo
  warn = fnwarn
  error = fnerrr
  getLogger(namespace: string = ROOT, appender?: AppenderType) {
    let ret: Log = UNDEFINED
    let inst: Log = UNDEFINED
    let level = logctx[namespace]?.level || logctx[ROOT]?.level || DEBUG
    if (namespace) { inst = logctx[namespace] }
    if (!inst && namespace) { inst = new Log(namespace, appender) }
    if (!inst) { inst = logctx[ROOT] }
    if (inst) {
      inst.setLevel(level)
      ret = makeProxy(inst)
    }
    return ret
  }
  getLevel() { return this.level }
  getNamespace() { return this.namespace }
  /* Log leveling, log.setLevel('info') is executed, then log.debug('log') is called, but no output is displayed on the console. */
  setLevel(level: Levels, appender?: AppenderType) {
    let inst = this.inst
    if (appender) { inst.appender = appender }
    switch (level) {
    case TRACE: {
      inst.trace = inst?.appender?.log || fnclog
      inst.debug = inst?.appender?.log || fnclog
      inst.info = inst?.appender?.info || inst?.appender?.log || fncinfo
      inst.warn = inst?.appender?.warn || inst?.appender?.log || fnwarn
      inst.error = inst?.appender?.error || inst?.appender?.log || fnerrr
      inst.level = level
    } break
    case DEBUG: {
      inst.trace = FN_NIL
      inst.debug = inst?.appender?.log || fnclog
      inst.info = inst?.appender?.info || inst?.appender?.log || fncinfo
      inst.warn = inst?.appender?.warn || inst?.appender?.log || fnwarn
      inst.error = inst?.appender?.error || inst?.appender?.log || fnerrr
      inst.level = level
    } break
    case INFO: {
      inst.trace = FN_NIL
      inst.debug = FN_NIL
      inst.info = inst?.appender?.info || inst?.appender?.log || fncinfo
      inst.warn = inst?.appender?.warn || inst?.appender?.log || fnwarn
      inst.error = inst?.appender?.error || inst?.appender?.log || fnerrr
      inst.level = level
    } break
    case WARN: {
      inst.trace = FN_NIL
      inst.debug = FN_NIL
      inst.info = FN_NIL
      inst.warn = inst?.appender?.warn || inst?.appender?.log || fnwarn
      inst.error = inst?.appender?.error || inst?.appender?.log || fnerrr
      inst.level = level
    } break
    case ERROR: {
      inst.trace = FN_NIL
      inst.debug = FN_NIL
      inst.info = FN_NIL
      inst.warn = FN_NIL
      inst.error = inst?.appender?.error || inst?.appender?.log || fnerrr
      inst.level = level
    } break
    default: { inst.setLevel(DEBUG, appender) }}
    return this
  }
  /* Used when you want to use an appender other than window.console */
  setAppender(appender: AppenderType = console) {
    this.setLevel(this.level, appender)
  }
  setGlobalLevel(level: Levels, namespace?: string, appender?: AppenderType) {
    if (namespace && namespace !== 'all') {
      logctx[namespace].setLevel(level, appender)
    } else {
      for (const key in logctx) {
        logctx[key].setLevel(level, appender)
      }
    }
  }
  setGlobalAppender(namespace?: string, appender?: AppenderType) {
    if (namespace && namespace !== 'all') {
      logctx[namespace].setAppender(appender)
    } else {
      for (const key in logctx) {
        logctx[key].setAppender(appender)
      }
    }
  }
}

/* Objectify the proxy so that internal members cannot be manipulated. */
const makeProxy = (log: Log) => {
  return new Proxy(log, {
    set(o: any, k: any, v: any) {
      throw Error(`NOT ALLOWED MODIFY! log.${k}`)
    }
  }) as Log 
}

const log = makeProxy(new Log(ROOT, console)).setLevel(DEBUG)
const getLogger = log.getLogger

export default log
export { getLogger, type Levels, type AppenderType }