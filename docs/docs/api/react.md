# React API

## DndProvier

react 拖拽作用域组件

- 类型

```ts:no-line-numbers
import { PureComponent, FunctionComponentElement } from 'react';
import { type IDnDProvider, type IDragHooksParams, type IDropHooksParams, DragCore, DropCore } from 'easy-dnd';

interface IDndProviderProps {
    /** 拖拽类型 */
    type?: IDnDProvider<any, any>['dndMode'];
    /** 延时多久触发dragenter */
    delay?: IDnDProvider<any, any>['delay'];
    /** react子节点 */
    children: any;
}

declare class DndProvider extends PureComponent<IDndProviderProps> {
    /** 每个Dnd下都有属于自己的上下文, 里面可以存储一些基本的拖拽数据 */
    dndCtx: IDnDProvider<any, any>;
    constructor(props: IDndProviderProps);
    render(): FunctionComponentElement<import("react").ProviderProps<IDnDProvider<any, any>>>;
}
```

- 参考

[React下使用 > DndProvider](/react.md#dndprovider)

## Drag

继承至 DragCore，扩展 dragRef 方法

- 类型

```ts:no-line-numbers
class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {
    dragRef: (dom: HTMLElement | null) => any;
}
```

- 指南

[React下使用 > class](/react.md#class下使用)

## Drop

继承至 DropCore，扩展 dropRef 方法

- 类型

```ts:no-line-numbers
class Drop<Data = any, Rubbish = any> extends DropCore<Data, Rubbish> {
    dropRef: (forwardRef: HTMLElement | null | Drag<any, any>['dragRef']) => (dom: HTMLElement | null) => void;
}
```

- 指南

[React下使用 > class](/react.md#class下使用)

## useDrag

创建Drag对象

- 类型

```ts:no-line-numbers
type IDragHooksParams<Data, Rubbish> = Omit<IDragCoreConstructorParams<Data, Rubbish>, 'config'> & {
    config: Omit<IDragCoreConstructorParams<Data, Rubbish>['config'], 'context'>;
};

function useDrag<Data = {}, Rubbish = {}>(params: IDragHooksParams<Data, Rubbish>): Drag<Data, Rubbish>
```

- 参考

[React下使用 > hooks > useDrag](/react.md#usedrag) 

## useDrop

创建Drop对象

- 类型

```ts:no-line-numbers
type IDropHooksParams<Data, Rubbish> = Omit<IDropCoreConstructorParams<Data, Rubbish>, 'config'> & {
    config: Omit<IDropCoreConstructorParams<Data, Rubbish>['config'], 'context'>;
};

function useDrop<Data, Rubbish>(params: IDropHooksParams<Data, Rubbish>): Drop<Data, Rubbish>
```

- 参考

[React下使用 > hooks > useDrop](/react.md#usedrop) 