<template>
  <button @click="listen = !listen">
    {{ listen ? "取消监听" : "开启拖拽监听" }}
  </button>
  <div class="container">
    <A></A>
    <B ref="targetDomRef"></B>
  </div>
  <div class="layer" ref="layerDom"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { type IDnDProvider, type DropCore, useDragListen } from "easy-dnd/vue";
import A from "./A.vue";
import B from "./B.vue";

const listen = ref(true);

// 拿到目标节点的实例
const targetDomRef = ref<{ drop: DropCore }>();
// 存储拖拽过程图层
const layerDom = ref<HTMLDivElement>();

// 拖拽的原始的dom节点
let dragDom!: HTMLDivElement,
  // 拷贝了一份的拖拽节点
  cloneDragDom!: HTMLDivElement,
  // 拖拽节点最开始的Rect
  startRect: DOMRect,
  // 获取目标节点的盒子模型尺寸
  targetRect: DOMRect,
  // 存储拖拽过程修改transform字符函数
  setTransformStr: ReturnType<typeof createSetTransformStr>;

// 缩放倍率 拖拽盒子是 50px * 50px  目标盒子是 200px * 200px
const scale = 4;

/**
 * 创建拖拽过程 transform 变化函数
 * @param context
 * @param cloneDragDom
 */
function createSetTransformStr(
  context: IDnDProvider<unknown, unknown>,
  cloneDragDom: HTMLDivElement,
) {
  /** 存储目标节点的dom */
  const targetDom = targetDomRef.value!.drop.dropDom as HTMLDivElement;

  targetRect = targetDom.getBoundingClientRect();

  const /** 拖拽起始点的x点 */
    startX = context.dragCoord.x,
    /** 拖拽起始点的y点 */
    startY = context.dragCoord.y,
    /** 获取目标节点的盒子模型尺寸 */

    /** 开始拖拽的时候，目标节点和拖拽节点的距离 */
    startDistance = calculateDistance(
      ...getRectCenterPoint(targetRect),
      ...getRectCenterPoint(startRect),
    );

  /** 斜率 (y2 - y1) / (x2 - x1) */
  const k = (1 - scale) / (startDistance - 0);
  /** 截距 */
  const b = scale - k * 0;

  /**
   * 计算两个正方形盒子模型的中心点
   * @param rect
   */
  function getRectCenterPoint(rect: DOMRect): [number, number] {
    return [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
  }

  /**
   * 计算直角坐标系上任意两点之间的距离
   */
  function calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    return distance;
  }

  /**
   * 计算缩放比（已知斜率和截距，传入x，获取y）
   * @param x
   */
  function getScale(x: number) {
    return x * k + b;
  }

  /**
   * 获取transform字符串
   * @param draggingCoord 拖拽中的指针位置
   */
  function setTransformStr(draggingCoord: Record<"x" | "y", number>) {
    const [currentX, currentY] = [draggingCoord.x, draggingCoord.y];
    const translateX = startRect.x + currentX - startX;
    const translateY = startRect.y + currentY - startY;
    const scale = getScale(
      calculateDistance(
        ...getRectCenterPoint(targetRect),
        ...getRectCenterPoint(cloneDragDom.getBoundingClientRect()),
      ),
    );
    cloneDragDom.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  return setTransformStr;
}

let isDrop = false;

// 监听函数
useDragListen({
  filter: () => listen.value,
  dragStart(_, context) {
    // 存储拖拽dom
    dragDom = context.dragDom as HTMLDivElement;
    // 获取初始Rect
    startRect = dragDom.getBoundingClientRect();
    // 克隆一份
    cloneDragDom = dragDom.cloneNode(true) as HTMLDivElement;
    // 添加dom到图层上
    layerDom.value!.appendChild(cloneDragDom);

    // 获取设置偏移的函数
    setTransformStr = createSetTransformStr(context, cloneDragDom);

    // 设置克隆dom的初始化设置
    cloneDragDom.style.transform = `translate(${startRect.x}px, ${startRect.y}px)`;

    dragDom.classList.add("hide");
  },
  drag(_, { dragCoord }) {
    setTransformStr(dragCoord);
  },
  dragEnd() {
    cloneDragDom.classList.add("reset-animation");
    cloneDragDom.style.transform = `translate(${startRect.x}px, ${startRect.y}px)`;
    cloneDragDom.ontransitionend = () => {
      // 还原样式
      layerDom.value!.innerHTML = "";
      dragDom.classList.remove("hide");
    };
  },
});
</script>

<style>
.container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

/* 隐藏拖拽节点 */
.hide {
  opacity: 0;
}

/* 动画效果 */
.reset-animation {
  transition: 0.3s all;
}
</style>
