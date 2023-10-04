# React下使用

在安装`easy-dnd`的时候就会携带上 react 相关桥接文件，所以不要单独安装

```js
import { 
  // react下使用的拖拽上下文
  DndProvider,
  // drag hook
  useDrop,
  // drop hook
  useDrag
} from 'easy-dnd/react'
```

可以直接从`easy-dnd/react`中引入所有`easy-dnd`的变量和方法

```js
import { 
  DND_MODE,
  DragCore,
  DropCore,
  ...
} from 'easy-dnd/react'
```

## DndProvider

用于提供拖拽的上下文，是基于 createProvider 的 React 封装版本

```jsx
import { DndProvider } from 'easy-dnd/react'

function Example1() {
  return (
    <DndProvider>
	  <Component />
    </DndProvider>
  )
}
```

同理，你也可以配置dnd mode与delay

```jsx{3,9,10}
import { 
  DndProvider,
  DND_MODE
} from 'easy-dnd/react'

function Example1() {
  return (
    <DndProvider
      type={DND_MODE.SCOPE}
      delay={100}    
    >
	  <Component />
    </DndProvider>
  )
}
```

## hooks

`easy-dnd/react` 提供了如下两个 hooks

- **useDrag：** 用于创建拖拽实例
- **useDrop：** 用于创建放置实例

hooks的好处有以下两点

1. 不需要手动调用 subscribe 与 unSubscribe
2. 不需要传递上下文

### useDrag

在 react hooks 中，因为 react 的渲染机制问题，因此创建 drag 与 drop 实例需要把配置项放到一个函数中，此函数的返回值作为其配置项，理想情况下，这个拖拽对象只会实例化一次，你可以把`easy-dnd/react`提供的 hooks 看成一个 useMemo

```jsx
import { useDrag } from 'easy-dnd/react'

function A() {

  // 创建拖拽实例
  const drag = useDrag(() => ({
    config: {
      // 不需要传递上下文
      // context: null
      type:  'A'
    },
    // 拖拽开始的回调
    dragStart: () => {
      console.log('A 开始拖拽')
    },
    // 拖拽结束的回调
    dragEnd: () => {
      console.log('A 结束拖拽')
    }
  // 不传第二个参数参数，那么效果与 useMemo(()=>config, []) 一致
  }))
  // 如果配置内部需要使用到最新的数据，需要在这里添加依赖性，防止闭包
  // }), [ data1, data2 ])

  return (
    <div
      // 与dom绑定
      ref={drag.dragRef}
    >
      盒子A
    </div>
  )
}
```

### useDrop

与 useDrag 同理，同样不需要传递上下文与显性的调用  subscribe 与 unSubscribe

```jsx
import { useDrop } from 'easy-dnd/react'

function B() {

  const drop = useDrop(() => ({
    config: {
      // 不需要传递上下文
      // context: null
      acceptType: new Set([ 'A' ])
    },
    dragEnter() {
      console.log('A进入了B的范围')
    },
    // A放置时触发的回调
    drop(monitor) {
      console.log('A放置在B上', '存放的数据:' + monitor.getDragData())
    },
    dragOver() {
      console.log('A在B中移动')
    },
    dragLeave() {
      console.log('A离开了B的范围')
    }
  // 不传第二个参数参数，那么效果与 useMemo(()=>config, []) 一致
  }))
  // 如果配置内部需要使用到最新的数据，需要在这里添加依赖性，防止闭包
  // }), [ data1, data2 ])

  return (
    <div
      ref={drop.dropRef}
      style={{ width: 100, height: 100, border: '1px dashed #000' }}
    >
      盒子B
    </div>
  )
}
```

## 既可以drag又可以drop

如果当前元素既可以drag又可以drop，你可以这么写

```jsx{16}
function ListItem() {

  const drag = useDrag(() => ({
    config: {
      type:  'list'
    }
  }))

  const drop = useDrop(() => ({
    config: {
      acceptType: new Set([ 'list' ])
    }
  }))

  // 当前控件既可以拖拽，也可以放置
  const dropDragRef = useMemo(() => drop.dropRef(drag.dragRef), [])

  return (
    <li ref={dropDragRef}>
	
    </li>
  )
}
```

## class下使用

不是很推荐在`class`下使用，因为使用起来相对繁琐，但是`easy-dnd/react`依然提供了对应的方法

```jsx
import {
  useDrag,
  useDrop,
  Drop,
  Drag
} from 'easy-dnd/react'

class DropDrag extends PureComponent {

  // 注入上下文
  static contextType = DndContext

  // Drop实例
  dropInstance = null
  // Drag实例
  dragInstance = null

  constructor(props) {
    super(props)
    this.createDragInstance()
    this.createDropInstance()
  }

  /** 
   * 创建drag实例
   * @param context 拖拽上下文
   */
  createDragInstance = (context) => {
    this.dragInstance = new Drag({
      config: {
        type: 'A',
        data: () => 'data',
        context
      }
    })
  }

  /** 
   * 创建drop实例
   * @param context     拖拽上下文
   */
  createDropInstance = (context) => {
    this.dropInstance = new Drop({
      config: {
        context,
        acceptType: new Set([ 'A' ])
      }
    })
  }

  componentDidMount() {
    const { dragInstance, dropInstance } = this
    dragInstance && dragInstance.subscribe()
    dropInstance && dropInstance.subscribe()
  }

  componentWillUnmount() {
    const { dragInstance, dropInstance } = this
    dragInstance && dragInstance.unSubscribe()
    dropInstance && dropInstance.unSubscribe()
  }

  render = () => {

    return (
      <div ref={this.dragInstance.dragRef}>
        <div ref={this.dropInstance.dragRef}>
      
        </div>
      </div>
    )

  }

}
```

