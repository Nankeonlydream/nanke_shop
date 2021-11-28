// 防抖函数
export function Debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 防抖
export const DebounceBy = (fn, t) => {
  let delay = t || 500
  let timer
  return function () {
    let args = arguments;
    if (timer) {
      clearTimeout(timer)
    }

    let callNow = !timer

    timer = setTimeout(() => {
      timer = null
    }, delay)

    if (callNow) fn.apply(this, args)
  }
}

// 节流
export const ThrottleBy = (fn, interval) => {
  // last为上一次触发回调的时间
  let last = 0

  // 将throttle处理结果当作函数返回
  return function () {
    // 保留调用时的this上下文
    let context = this
    // 保留调用时传入的参数
    let args = arguments
    // 记录本次触发回调的时间
    let now = +new Date()

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(context, args);
    }
  }
}