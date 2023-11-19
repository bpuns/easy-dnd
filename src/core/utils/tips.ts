export const DESTROY_TIP = '上下文已经被销毁，不能再次注册'
export const SUBSCRIBE_TIP = (s: string) => `class ${s}调用subscribe方法前必须调用registerDom方法`