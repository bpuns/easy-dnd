import { useState } from 'react'
import { DndProvider } from 'easy-dnd/react'
import { BpmOrderList } from './BpmOrderList'
import s from './index.module.css'

function Example3() {

  const [ list, setList ] = useState([ 'a', 'b', 'c', 'd', 'e', 'f' ])

  return (
    <BpmOrderList
      orderList={list}
      onChange={setList}
      render={({ dropRef, dragRef, item, index }) => {
        return (
          <div
            ref={dropRef}
            className={s.dropItem}
            // 注意 dropItem 节点一定要设置一个 relative，不然没有放置蓝条
            style={{ position: 'relative' }}
          >
            {/* 按住拖拽节点 */}
            <div ref={dragRef} className={s.dragItem}>
              按住这里拖拽
            </div>
            {/* 信息节点 */}
            <p>
              当前节点信息：{item} - {index}
            </p>
          </div>
        )
      }}
    />
  )

}

Example3.tip = '列表拖拽排序'

export {
  Example3
}