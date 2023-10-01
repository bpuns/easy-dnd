# 1	入门指南

安装之前，先把`npm`源切换到公司下：http://192.168.43.54:8081/repository/npm/，然后安装

```shell
$ npm i bpm-dnd
```

`bpm-dnd`不止可以在`React`下使用，它可以在全部的前端框架下运行，甚至可以直接在原生下运行（需要二次开发，目前只实现了`React`与原生）

<img src="image/image-20220713083509650.png" alt="image-20220713083509650" style="zoom:80%;" />

`bpm-dnd`出现的目的，是为了解决原生拖拽方法的问题，在复杂情况下，原生方法如果不做一点处理，几乎是不可用的。因此，`bpm-dnd`应运而生，并且屏蔽了原生事件的一些摸不着头脑的问题，且性能优异（此处需要`diss`一下`react-dnd`，难用，并且触发机制比原生还摸不到头脑）

如果只想在`React`下运行，以下几个方法就足够我们使用

```js
// 拖拽数据中心
DndContext
DndProvider

// 拖拽（Drag）类
Drag
// 放置（Drop）类
Drop

// hooks中的的拖拽对象
useDrag
// hooks中的拖拽对象
useDrop
```



# 2	class组件中的使用

## 2.1	入门

比如，现在有`A`，`B`两个盒子

```jsx
class A extends Component {
  render(){
    return (
      <div style={{ width: 50, height: 50, border: '1px solid #000' }}>
        盒子A
      </div>
    )
  }
}

class B extends Component {
  render(){
    return (
      <div style={{ width: 100, height: 100, border: '1px dashed #000' }}>
        盒子B
      </div>
    )
  }
}
```

![image-20220712175051204](image/image-20220712175051204.png)

现在想要实现，`A`可以拖拽，并且，`A`拖动到`B`中的时候，松开`A`，`B`能接收到`A`放置的提示，那么在`bpm-dnd`中可以这么写

### 第一步

在想要`drag`/`drop`的组件的外面包一层`DndProvider`

```jsx
import ReactDom from 'react-dom'
import { DndProvider } from 'bpm-dnd'
import { Component } from 'react'

.......

ReactDom.render(
  <DndProvider>
    <A />
    <B />
  </DndProvider>,
  document.querySelector('#app')
)
```

### 第二步

给`A`绑定一个`Drag`实例

```jsx
import { Drag, DndContext } from 'bpm-dnd'
import { Component } from 'react'

class A extends Component {

  // 注入Dnd的上下文
  static contextType = DndContext

  constructor(props, context) {
    super(props)
    // 创建拖拽实例
    this.dragInstance = new Drag({
      config: {
        // 把上下文放在这里
        context,
        // 给拖拽元素设置一个type（任意类型都可以）
        type: 'A',
        // 拖拽元素存放的数据
        data: () => 'A存放的数据'
      },
      // 拖拽开始的回调
      dragStart: () => {
        console.log('A 开始拖拽')
      },
      // 拖拽结束的回调
      dragEnd: () => {
        console.log('A 结束拖拽')
      }
    })
  }

  componentDidMount() {
    // 订阅
    this.dragInstance.subscribe()
  }

  componentWillUnMount() {
    // 取消订阅
    this.dragInstance.unSubscribe()
  }

  render() {
    return (
      <div
        // 把想要拖拽的元素，附上dragInstance.dragRef
        ref={this.dragInstance.dragRef}
        style={{ width: 50, height: 50, border: '1px solid #000' }}
      >
        盒子A
      </div>
    )
  }
}
```

这样，`A`就可以拖拽了

![GIF 2022-7-12 18-00-09](image/GIF 2022-7-12 18-00-09.gif)

并且，控制台还有相对应的打印

![image-20220712180113713](image/image-20220712180113713.png)

### 第三步

给`B`绑定一个`Drop`类

```jsx
import { Drop, DndContext } from 'bpm-dnd'
import { Component } from 'react'

class B extends Component {

  // 注入Dnd的上下文
  static contextType = DndContext

  constructor(props, context) {
    super(props)
    // 创建拖拽实例
    this.dropInstance = new Drop({
      config: {
        // 把上下文放在这里
        context,
        // 设置当前控件允许放置的类型，和 new Drag 中的 config.type 一一对应
        acceptType: new Set(['A'])
      },
      dragEnter() {
        console.log('A进入了B的范围')
      },
      // A放置时触发的回调
      drop() {
        console.log('A放置在B上')
      },
      dragOver() {
        console.log('A在B中移动')
      },
      dragLeave() {
        console.log('A离开了B的范围')
      }
    })
  }

  componentDidMount() {
    // 订阅
    this.dropInstance.subscribe()
  }

  componentWillUnMount() {
    // 取消订阅
    this.dropInstance.unSubscribe()
  }

  render() {
    return (
      <div
        ref={this.dropInstance.dropRef}
        style={{ width: 100, height: 100, border: '1px dashed #000' }}
      >
        盒子B
      </div>
    )
  }
}
```

这样，`A`拖动到`B`中间，就会触发相应的回调

![GIF 2022-7-12 18-12-12](image/GIF 2022-7-12 18-12-12.gif)

### 基本原理

在给`A`设置`Drag`实例的时候，配置了一个`type`

![image-20220712221841470](image/image-20220712221841470.png)

这个`type`在`Drop`实例中，和`acceptType`关联起来了。这样，`bpm-dnd`就知道，"哪些元素"可以放置在"哪些元素"中

![image-20220712222018576](image/image-20220712222018576.png)

然后，通过拖拽实例上的 `dropInstance.dropRef` 与 `dragInstance.dragRef` 和真实`dom`关联起来

![image-20220713082246895](image/image-20220713082246895.png)

![image-20220713082307268](image/image-20220713082307268.png)

然后这些`Drag`，`Drop`实例，全部由 `DndContext` 来管理，这样就形成了一个**拖拽系统**

![image-20220712223618806](image/image-20220712223618806.png)



## 2.2	Drag详解

### 2.2.1	构造函数

在实例化`Drag`这个类的时候，可以传两类参数，一类是**配置项**，一类是**事件触发函数**，以上面的例子为例，分类如下

![image-20220712223936259](image/image-20220712223936259.png)

#### 配置项

可配置的属性一共有4个

- **context（必填）**

拖拽上下文，类组件统一使用如下方式注入

<img src="image/image-20220713081346361.png" alt="image-20220713081346361" style="zoom:67%;" />

- **type（必填）**

每个用于拖拽的拖拽的元素，都要设置一个`key`，这个`key`用于和`Drop.acceptType`的`key`关联

- **data（必填）**

用于存放拖拽数据，你可以把想要携带的数据放在这里。此参数必须是一个函数，返回的值，可以在`monitor`（稍后会说到）中获取到

- **hoverClassName（选填）**

比如，添加这么一个`css`属性

```css
.drag-hover-class {
  box-shadow: 0 0 5px 1px red
}
```

然后配置如下

<center>
    <img src="image/image-20220713082510426.png" alt="image-20220713082510426" style="zoom:80%;" />
	<img src="image/GIF 2022-7-13 8-26-26.gif" alt="GIF 2022-7-13 8-26-26" style="zoom:80%;" />
</center>



#### 事件触发函数

事件触发函数一共有三个

- **dragStart：**当前元素开始拖拽
- **drag：**当前元素拖拽中
- **dragEnd：**当前元素结束拖拽

例子如下

<center>
    <img src="image/image-20220713083155852.png" alt="image-20220713083155852" style="zoom:80%;" />
    <img src="image/GIF 2022-7-13 8-26-26-16576722075531.gif" alt="GIF 2022-7-13 8-26-26" style="zoom:80%;" />
</center>



### 2.2.2	实例化对象

实例化`Drag`之后，会返回一个实例化对象，我们可以打印一下`dragInstance`，看下里面有什么

![image-20220713084730610](image/image-20220713084730610.png)

可以看到，其中的属性和方法特别多，但是大部分开发时都用不到

![image-20220713084830027](image/image-20220713084830027.png)

其中有几个属性和方法会经常用到

- **subscribe()/unSubscribe()**

在组件初始化和卸载的时候调用，触发这两个方法，能够在`dndContext`上注册拖拽信息，和移除拖拽信息

![image-20220713085407379](image/image-20220713085407379.png)

- **dragRef()**

用于和真实`dom`关联起来

![image-20220713085439828](image/image-20220713085439828.png)

- **config**

其实就是实例化的时候传进去的`config`

![image-20220713085657260](image/image-20220713085657260.png)

- **context**

存储在`dndContext`上的数据，在[2.5 DndContext](##2.5	DndContext)中会详细说明

- **dragDom**

当前绑定到`Drag`上的真的`dom`引用

![image-20220713090107010](image/image-20220713090107010.png)



## 2.3	Drop详解

`Drop`类的实例化参数，同样也可以分为两类，一类是**配置项**，一类是**事件触发函数**

### 2.2.1	构造函数

#### 配置项

在配置项中，有以下几个配置项特别常用

- **acceptType（必填）**

用于设置允许接收哪些类型的`drag`，此处传一个`Set`，因此可以传递多种类型

![image-20220713090854952](image/image-20220713090854952.png)

- **hoverClassName（选填）**

与`Drag`一致

- **context（必填）**

与`Drag`一致

- **canDrop（选填）**

用于验证某个`dom`可否放置在此`dom`下，一般情况下用不到这个属性，因为`config.type`与`config.acceptType`已经把是否可以放置的关系关联起来

但是在实际开发过程中，遇到过这么一种情况，`B`元素中只能放置一个`A`元素。也就是说这时候，`config.type`与`config.acceptType`关联就不够了，这种复杂逻辑需要开发者介入，使用方式如下

```ts
this.dropInstance = new Drop({
    config: {
		......
        canDrop: () => {
            if ( ... ) {
                return true  // B元素当前不存在A，允许放置，返回true
            } else {
                return false // B元素已经存在A，不允许放置，返回false
            }
        }
    }
})
```

#### 事件触发函数

`drag`的事件触发函数有这么多种

```ts
/** acceptType里允许接收的元素进入当前元素触发的回调 */
dragEnter?: () => any
/** acceptType里允许接收的元素在当前元素中移动触发的回调 */
dragOver?: () => any
/** acceptType里允许接收的元素离开当前元素触发的回调 */
dragLeave?: () => any
/** acceptType里允许接收的元素放置到当前元素触发的回调 */
drop?: () => any
/** acceptType里允许接收的元素开始拖拽的时候，会触发此方法 */
dragStart?: () => any
/** acceptType里允许接收的元素结束拖拽的时候，会触发此方法 */
dragEnd?: () => any
```

因为方法过多，实例开发中可以把这些方法拆出来

![image-20220713092548122](image/image-20220713092548122.png)

### 2.2.2	实例化对象

`Drop`返回的实例化对象常用的属性和方法和`Drag`一致，这里就不再赘述，只不过有两个属性名字发生了变化

- **dragRef**  变成了 **dropRef**
- **dragDom**  变成了 **dropDom**



## 2.4	monitor

在`Drag`与`Drop`的事件触发回调中，都可以接收到一个参数，就是`monitor`

<center>
	<img src="image/image-20220713093757322.png" alt="image-20220713093757322" style="zoom:80%;" />
    <img src="image/image-20220713093722318.png" alt="image-20220713093722318" style="zoom:86%;" />
</center>
`monitor`中，可以获取到当前拖拽的所有数据

`drag`的`monitor`类型定义如下

```ts
interface IDragCoreMonitor<Data, Rubbish> {
  /** 拖拽事件对象 */
  event: DragEvent
  /** 获取整个dnd的上下文 */
  getContext: () => IDnDProvider<Data, Rubbish>
}
```

`drop`的`monitor`类型定义如下

```ts
interface IDropCoreMonitor<Data, Rubbish> {
  /** 获取dropDom的尺寸，返回的值就是 dropDom.getBoundingClientRect()  */
  getDomRect: () => DOMRect
  /** 拖拽事件对象 */
  event: DragEvent
  /** 获取整个dnd的上下文 */
  getContext: () => IDnDProvider<Data, Rubbish>
  /** 获取正在拖拽的元素的type */
  getDragType: () => IDnDProvider<Data, Rubbish>['dragType']
  /** 获取正在拖拽的元素的dom */
  getDragDom: () => IDnDProvider<Data, Rubbish>['dragDom']
  /** 获取正在拖拽元素的data */
  getDragData: () => IDnDProvider<Data, Rubbish>['dragData']
  /** 获取允许放置的元素的dropInstance */
  getDropInstance: () => IDnDProvider<Data, Rubbish>['dropInstance']
  /** 判断正在拖拽的元素是否在drop元素的上50%区域 */
  isOverTop: (domRect?: DOMRect) => boolean
  /** 判断正在拖拽的元素是否在drop元素的下50%区域 */
  isOverBottom: (domRect?: DOMRect) => boolean
  /** 判断正在拖拽的元素是否在drop元素的左50%区域 */
  isOverLeft: (domRect?: DOMRect) => boolean
  /** 判断正在拖拽的元素是否在drop元素的右50%区域 */
  isOverRight: (domRect?: DOMRect) => boolean
}
```



## 2.5	DndContext

`dnd`的上下文，类型定义如下，可以通过 `monitor.getContext()` 获取到，

```ts
/** 存储拖拽作用域下的所有数据 */
interface IDnDProvider<Data, Rubbish> {
  /** 拖拽格式 */
  dndMode: Readonly<DND_MODE>
  /** 正在拖拽元素的x与y点坐标 */
  dragCoord: Record<'x' | 'y', number>
  /** 正在拖拽元素的描述 */
  dragType: any
  /** 保存正在拖拽的元素的dom */
  dragDom: HTMLElement
  /** 拖拽元素的data */
  dragData: Data
  /** 某个元素执行了drop，那么这个drop的实例就会存储在这里，在整个拖拽生命周期结束后，此变量也会被删除 */
  dropInstance: DropCore | null
  /** 保存当前dragEnter的dom是哪一个，解决 doc/拖拽研究.md 2.4 问题 */
  enterDom: HTMLElement
  /** dragEnter延时多长事件触发, 解决 doc/拖拽研究.md 2.4 问题 */
  delay: number
  /** 用来存储被drag包裹的元素的开始事件，当有元素开始拖动的时候，会触发此方法 */
  dragItemDragStarts: Set<() => void>
  /** 用来存储被drop包裹的元素的结束事件，当有元素结束拖动的时候，会触发此方法 */
  dragItemDragEnds: Set<() => void>
  /** 用来存储被drop包裹的元素的开始事件，当有元素开始拖动的时候，会触发此方法 */
  dropItemDragStarts: Set<() => void>
  /** 用来存储被drop包裹的元素的结束事件，当有元素结束拖动的时候，会触发此方法 */
  dropItemDragEnds: Set<() => void>
  /** 存放拖拽的时候具体业务逻辑中的一些数据 */
  rubbish: Rubbish
}
```

其中，大部分的属性都是`bpm-dnd`内部使用，一般开发使用不到



# 3	hooks组件中的使用

如果你不习惯使用类组件，`bpm-dnd`同样提供了`hooks`可以选择

## 3.1	useDrag

`Drag`的`hooks`实现，使用比`Drag`类方便，**但性能不如`Drag`类**，对比如下

<img src="image/image-20220713102845811.png" alt="image-20220713102845811" style="zoom: 67%;" />

对比`class`发现，`hooks`不需要订阅与取消订阅了，也不需要传`context`了，其余的使用方式与类一致

<img src="image/image-20220713103020301.png" alt="image-20220713103020301" style="zoom:67%;" />



## 3.2	useDrop

`Drop`的`hooks`实现，使用比`Drop`类方便，但性能不如`Drop`类，使用方式如下

<img src="image/image-20220713103759179.png" alt="image-20220713103759179" style="zoom:67%;" />

对比`class`发现，`hooks`不需要订阅与取消订阅了，也不需要传`context`了，其余的使用方式与类一致

<img src="image/image-20220713103551457.png" alt="image-20220713103551457" style="zoom: 67%;" />





