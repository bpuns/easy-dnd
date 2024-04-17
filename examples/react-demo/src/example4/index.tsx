import { useState, useCallback } from 'react'
import { GridOrderList } from './GridOrderList'
import s from './index.module.css'

function Example4() {

  const [ list, setList ] = useState([
    'a', 'b', 'c', 'd', 'e', 'f', 'j', 'h', 'i', 'g', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ])

  return (
    <div className={s.drag}>
      <GridOrderList

        // 获取用于渲染子项的key
        // ！！！！！！！！！！！！！一定要确保key唯一，不然可能会碰到不可预料的bug！！！！！！！！！！
        // 不能使用索引！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        getKey={useCallback<(item: string) => string>(item => item, [])}
        // getKey={useCallback((item: { id: string }) => item.id, [])}

        orderList={list}
        onChange={setList}
        render={({ dropRef, dragRef, item }) => {
          const dragDropRef = dropRef(dragRef)
          return (
            <div
              ref={dragDropRef}
              className={s.dropItem}
            >
              <p>
                {item}
              </p>
            </div>
          )
        }}
      />
    </div>
  )

}

Example4.tip = '网格拖拽排序'

export {
  Example4
}