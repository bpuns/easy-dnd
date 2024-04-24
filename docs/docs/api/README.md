# 核心 API

## 常量

### DND_MODE

用于标识当前拖拽事件调用逻辑

- 类型

```ts:no-line-numbers
enum DND_MODE {
    /** 范围模式 */
    SCOPE = "scope",
    /** 自治模式 */
    SWARAJ = "swaraj"
}
```

- 参考

[进阶 > 上下文高阶配置 > 拖拽模式](/extras.md#拖拽模式) 

### DND_CTX

库内部使用，用于标识上下文

- 类型

```ts:no-line-numbers
const DND_CTX: unique symbol
```

- 详细信息

用于 `easy-dnd/vue`中获取拖拽上下文用到的[唯一标识](https://github.com/bpuns/easy-dnd/blob/master/src/vue/index.ts)，如果要为第三方库开发桥接文件，可以使用它作为唯一值

### BIND_DRAG

库内部使用，用于标识上下文

- 类型

```ts:no-line-numbers
const BIND_DRAG: unique symbol
```

- 详细信息

与 DragCore 绑定在一起的 dom 上，会多出一个 key 为 BIND_DRAG 的属性，值是 true

## 方法

### createProvider

用于创建拖拽上下文

- 类型

```ts:no-line-numbers
interface ProviderConfig {
    /** 拖拽类型，有 SCOPE 和 SWARAJ 两种可选 */
    dndMode?: DND_MODE;
    /** 拖拽延时时间，必须大于等于0 */
    delay?: number;
}

/**
 * 创建拖拽作用域下的基本数据
 * @param {ProviderConfig} param
 * @returns
 */
function createProvider<Data, Rubbish>(
	{ dndMode, delay }?: ProviderConfig
): IDnDProvider<Data, Rubbish>;
```

- 参考

[进阶 > 上下文高阶配置](/extras.md#上下文高阶配置) 



### DragCore

用于创建drag实例

- 构造函数类型

```ts:no-line-numbers
/** Drag 构造函数参数 */
interface IDragCoreConstructorParams<Data, Rubbish> {
    /** 拖动开始触发的方法 */
    dragStart?: (monitor: IDragCoreMonitor<Data, Rubbish>) => any;
    /** 拖动中触发的方法 */
    drag?: (monitor: IDragCoreMonitor<Data, Rubbish>) => any;
    /** 拖动结束触发的方法 */
    dragEnd?: (monitor: IDragCoreMonitor<Data, Rubbish>) => any;
    /** 配置 */
    config: {
        /** 当前拖拽元素的类型 */
        type: IDnDProvider<Data, Rubbish>['dragType'];
        /** 拖拽元素携带的数据 */
        data?: () => Data;
        /** 动态添加的className */
        className?: {
            /** 鼠标移入的时候添加的className */
            hover?: string;
            /** 该元素拖拽中触发添加的className */
            dragging?: string;
        };
        /** 设置默认是否允许拖拽   true 允许拖拽 | false 不允许拖拽，默认是true */
        defaultDraggable?: boolean;
        /** 拖拽作用域 */
        context: IDnDProvider<Data, Rubbish>;
    };
}
```

- 实例化对象类型

DragCore 继承至 DragDropBase，允许外部调用的方法有以下三个

```ts:no-line-numbers
abstract class DragDropBase {
    /** 注册dom */
    abstract registerDom: (dom: HTMLElement) => any;
    /** 绑定事件 */
    abstract subscribe: () => void;
    /** 取消绑定事件 */
    abstract unSubscribe: () => void;
}
```

- 参考

[快速上手 > 创建drag对象](/quickStart.md#创建drag对象)

### DropCore

用于创建drop实例

- 构造函数类型

```ts:no-line-numbers
/** Drop 构造函数参数 */
interface IDropCoreConstructorParams<Data, Rubbish> {
    /** 外部元素进入this元素触发的方法 */
    dragEnter?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** 外部元素在this元素中移动触发的方法 */
    dragOver?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** 外部元素离开this元素触发的方法 */
    dragLeave?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** 外部元素放置到this元素触发的方法 */
    drop?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** acceptType里允许接收的元素开始拖拽的时候，会触发此方法 */
    dragStart?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** acceptType里允许接收的元素结束拖拽的时候，会触发此方法 */
    dragEnd?: (monitor: IDropCoreMonitor<Data, Rubbish>) => any;
    /** 配置 */
    config: {
        /**
         * 验证是否允许放置在这里
         * ！！！注意！！！
         * 请不要在canDrop中去做一些判断位置的操作
         * 在这个函数在整个拖拽生命周期内返回的值必须是一样的
         */
        canDrop?: (monitor: Pick<IDropCoreMonitor<Data, Rubbish>, 'event' | 'getContext' | 'getDragData' | 'getDragType' | 'getDropInstance'>) => boolean;
        /** 在这里配置允许接收的元素的类型 */
        acceptType: Set<IDnDProvider<Data, Rubbish>['dragType']>;
        /** 动态添加的className */
        className?: {
            /** 允许放置的元素进入添加的className */
            dragEnter?: string;
            /** 允许放置的元素开始拖拽添加的className */
            canDrop?: string;
        };
        /** 上下文 */
        context: IDnDProvider<Data, Rubbish>;
    };
}
```

- 实例化对象类型

DropCore 继承至 DragDropBase，允许外部调用的方法有以下三个

```ts:no-line-numbers
abstract class DragDropBase {
    /** 注册dom */
    abstract registerDom: (dom: HTMLElement) => any;
    /** 绑定事件 */
    abstract subscribe: () => void;
    /** 取消绑定事件 */
    abstract unSubscribe: () => void;
}
```

- 参考

[快速上手 > 创建drop对象](/quickStart.md#创建drop对象)

### createDragMonitor

用于创建drag事件回调中的事件对象，

- 类型

```ts:no-line-numbers
interface IDragCoreMonitor<Data, Rubbish> extends Pick<IDnDProvider<Data, Rubbish>, 'getRubbish'> {
    /** 拖拽事件对象 */
    event: DragEvent;
    /** 获取dnd上下文 */
    getContext: () => IDnDProvider<Data, Rubbish>;
}
```

- 指南

[进阶 > monitor > DragMonitor](/extras.md#dragmonitor)

### createDropMonitor

用于创建drop事件回调中的事件对象

- 类型

```ts:no-line-numbers
interface IDropCoreMonitor<Data, Rubbish> extends Pick<IDnDProvider<Data, Rubbish>, 'getRubbish'> {
    /** 获取dropDom的尺寸 */
    getDomRect: () => DOMRect;
    /** 拖拽事件对象 */
    event: DragEvent;
    /** 获取整个dnd的上下文 */
    getContext: () => IDnDProvider<Data, Rubbish>;
    /** 获取正在拖拽的元素的type */
    getDragType: () => IDnDProvider<Data, Rubbish>['dragType'];
    /** 获取正在拖拽的元素的dom */
    getDragDom: () => IDnDProvider<Data, Rubbish>['dragDom'];
    /** 获取拖拽元素的data */
    getDragData: () => IDnDProvider<Data, Rubbish>['dragData'];
    /** 获取dropInstance */
    getDropInstance: () => IDnDProvider<Data, Rubbish>['dropInstance'];
    /**
     * 判断dragDom是否在dropDom的上侧区域
     * @param domRect        DOMRect
     * @param middleExists   false|鼠标在上50%的位置就返回true(默认值)  true|鼠标在上33.333%的位置就返回true
     */
    isOverTop: (domRect?: DOMRect, middleExists?: boolean) => boolean;
    /**
     * 判断dragDom是否在dropDom的下侧区域
     * @param domRect        DOMRect
     * @param middleExists   false|鼠标在下50%的位置就返回true(默认值)  true|鼠标在下33.333%的位置就返回true
     */
    isOverBottom: (domRect?: DOMRect, middleExists?: boolean) => boolean;
    /**
     * 判断dragDom是否在dropDom的左侧区域
     * @param domRect        DOMRect
     * @param middleExists   false|鼠标在左50%的位置就返回true(默认值)  true|鼠标在左33.333%的位置就返回true
     */
    isOverLeft: (domRect?: DOMRect, middleExists?: boolean) => boolean;
    /**
     * 判断dragDom是否在dropDom的右侧区域
     * @param domRect        DOMRect
     * @param middleExists   false|鼠标在右50%的位置就返回true(默认值)  true|鼠标在右33.333%的位置就返回true
     */
    isOverRight: (domRect?: DOMRect, middleExists?: boolean) => boolean;
    /** 判断正在拖拽的元素是否在横向的 > 33.333% & < 66.666% 位置 */
    isOverRowCenter: (domRect?: DOMRect) => boolean;
    /** 判断正在拖拽的元素是否在纵向的 > 33.333% & < 66.666% 位置 */
    isOverColumnCenter: (domRect?: DOMRect) => boolean;
}
```

- 指南

[进阶 > monitor > DropMonitor](/extras.md#dropmonitor)



### isElement

用于判断当前变量是否是继承至 HtmlElement

- 类型

```ts:no-line-numbers
/**
 * 验证元素是否是HtmlElement
 * @param dom
 * @returns
 */
function isElement(dom: unknown): dom is HTMLElement;
```



### onListenDrag <Badge text="1.1.0+" vertical="top" />

拖拽监听事件

- 类型

```ts
/** 监听拖拽参数 */
type IListenDragParams<Data, Rubbish> = {
    /** 拖拽上下文 */
    context: IDnDProvider<Data, Rubbish>;
    /** 此次拖拽是否需要监听 */
    filter?: (ctx: IDnDProvider<Data, Rubbish>) => void;
} & Pick<IDragCoreConstructorParams<Data, Rubbish>, 'dragStart' | 'drag' | 'dragEnd'> & Pick<IDropCoreConstructorParams<Data, Rubbish>, 'dragEnter' | 'dragOver' | 'dragLeave' | 'drop'>;

function onListenDrag<Data, Rubbish>(params: IListenDragParams<Data, Rubbish>): Omit<IListenDragParams<Data, Rubbish>, "context"> & {
    unbind: () => void;
};
```

- 指南

[进阶 >  拖拽全局监听方法](/extras.md#拖拽全局监听方法)
