# Vue API

## DndProvier

vue拖拽作用域组件

- 类型

```ts:no-line-numbers
const DndProvider: DefineComponent<
  {
    /** 拖拽类型 */
    type: {
      default: DND_MODE;
    };
    /** dragEnter延时时间 */
    delay: {
      type: NumberConstructor;
      default: number;
    };
  }
>
```

- 参考

[Vue下使用 > DndProvider](/vue.md#dndprovider)

## Drag

继承至 DragCore，扩展 dragRef 方法

- 类型

```ts:no-line-numbers
class Drag<Data = any, Rubbish = any> extends DragCore<Data, Rubbish> {
    dragRef: (dom: any) => any;
}
```

## Drop

继承至 DropCore，扩展 dropRef 方法

- 类型

```ts:no-line-numbers
class Drop<Data = any, Rubbish = any> extends DropCore<Data, Rubbish> {
    dropRef: (forwardRef: any | null | Drag<any, any>['dragRef']) => (dom: any) => void;
}
```

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

[Vue下使用 > hooks > useDrag](/vue.md#usedrag) 

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

[Vue下使用 > hooks > useDrop](/vue.md#usedrop) 