/** 上下文销毁提示 */
export const DESTROY_TIP = '上下文已经被销毁，不能再次注册'
/** 订阅提示 */
export const SUBSCRIBE_TIP = (s: string) => `class ${s}调用subscribe方法前必须调用registerDom方法`

/**
 * 从数组中删除某个元素
 * @param arr 
 * @param deleteItem 
 */
export function spliceItem<T>(arr: T[], deleteItem: T) {
  const index = arr.indexOf(deleteItem)
  ~index && arr.splice(index, 1)
}