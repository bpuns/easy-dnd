import { h } from 'vue'
import { DragNode, NODE_TYPE } from './utils'
import { FormControl } from './FormControl'
import { Grid } from './Grid'

export function formFactory(node: DragNode, fatherPosition: string, index: number): any {
  let control = node.type === NODE_TYPE.GRID ? Grid : FormControl
  return h(control, { key: node.id, node, fatherPosition, index })
}

export * from './Form/index'
export * from './Grid/index'
export * from './NewControl/index'
export * from './FormControl/index'