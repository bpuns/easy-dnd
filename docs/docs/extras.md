# 进阶

## 上下文高阶配置

### 拖拽模式

在创建拖拽上下文的时候，可以指定拖拽模式，默认值是 `DND_MODE.SWARAJ`

```ts{8}
enum DND_MODE {
  SCOPE = 'scope',
  SWARAJ = 'swaraj'
}

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
function createProvider<Data, Rubbish>(params?: ProviderConfig): IDnDProvider<Data, Rubbish>;
```

`DND_MODE.SWARAJ`的效果，可以看下面多层级嵌套的例子

```html
<div class="drag-box" style="border: 1px double;width:100px; margin: 50px" >
  dragItem
</div>

<div 
  class="drop1-box" 
  style="border: 1px solid;width:200px; height: 200px;margin: 50px;"
>
  drop1

  <div 
    class="drop2-box" 
    style="border: 1px solid;width:120px; height: 120px;margin: 30px;"
  >
    drop2
    <p
      class="drop3-box" 
      style="border: 1px solid;background: red;margin-top: 20px;height:40px"
    >
      drop3
    </p>
  </div>

</div>

<script type="module">

  import {
    createProvider,
    DragCore,
    DropCore
  } from 'easy-dnd'

  // 创建拖拽上下文
  const context = createProvider()

  // 创建一个拖拽类型
  const DRAG_TYPE = 'a'

  function createDrop(domClassName) {
    // 创建放置实例
    const drop = new DropCore({
      config: {
        context,
        acceptType: new Set([DRAG_TYPE]),
      },
      dragEnter() {
        console.log(`${domClassName}：dragEnter`)
      },
      dragLeave() {
        console.log(`${domClassName}：dragLeave`)
      },
      drop() {
        console.log(`${domClassName}：drop`)
      }
    })
      .registerDom(document.querySelector(`.${domClassName}`))
      .subscribe()
  }

  new DragCore({
    config: {
      type: DRAG_TYPE,
      context
    }
  })
    .registerDom(document.querySelector('.drag-box'))
    .subscribe()

  createDrop('drop1-box')
  createDrop('drop2-box')
  createDrop('drop3-box')

</script>
```

<center>
    <img src="./images/image-20221002140927928.png" alt="image-20221002140927928" style="zoom:50%;" />
</center>

执行`1`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop1-box
```

执行`2`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop2-box
dragleave drop1-box
```

执行`3`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop3-box
dragleave drop2-box
```

执行`4`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop2-box
dragleave drop3-box
```

执行`5`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop1-box
dragleave drop2-box
```

执行`6`操作的时候，控制台打印

```console:no-line-numbers
dragleave drop1-box
```

### DND_MODE.SCOPE

如果在创建上下文的时候，把默认修改为 `DND_MODE.SCOPE`

```js{5,10}
import {
  createProvider,
  DragCore,
  DropCore,
  DND_MODE
} from 'easy-dnd'

// 创建拖拽上下文
// const context = createProvider()
const context = createProvider(DND_MODE.SCOPE)
```

那么执行拖拽步骤的时候打印如下

<center>
    <img src="./images/image-20221002140927928.png" alt="image-20221002140927928" style="zoom:50%;" />
</center>

执行`1`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop1-box
```

执行`2`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop2-box
```

执行`3`操作的时候，控制台打印

```console:no-line-numbers
dragenter drop3-box
```

执行`4`操作的时候，控制台打印

```console:no-line-numbers
dragleave drop3-box
```

执行`5`操作的时候，控制台打印

```console:no-line-numbers
dragleave drop2-box
```

执行`6`操作的时候，控制台打印

```console:no-line-numbers
dragleave drop1-box
```

但这种模式一般不常用

### delay

创建上下文的时候，还有一个配置参数，叫做`delay`

```ts{5}
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
function createProvider<Data, Rubbish>(params?: ProviderConfig): IDnDProvider<Data, Rubbish>;
```

它的目的是为了延迟dragEnter事件触发的时间，单位是`ms`，它出现的目的是为了解决多层级嵌套的时候，外层dragEnter立马触发，导致执行外层节点立马触发动画逻辑（比如translate偏移让位），内层节点跟着外层跑，导致**内层节点不好触发**dragEnter，体验感不佳（一般不需要配置，遇到此问题的时候，可以按需要设置100-200ms延迟执行dragEnter来解决这个问题）

<center>
    <img src="./images/drag.gif" alt="image-20221002140927928" style="zoom:70%;" />
</center>




## className



## canDrop



## monitor



## rubbish





## 既可以拖拽又可以放置





## 关闭拖拽





## 卸载
