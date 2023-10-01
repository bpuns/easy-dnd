import type { IDragCoreMonitor } from '../@types'
import type { Drag } from '../Drag'

function createDragMonitor<Data, Rubbish>(instance: Drag<Data, Rubbish>): IDragCoreMonitor<Data, Rubbish> {
  return {
    event:      null!,
    getContext: () => instance.context
  }
}

export {
  createDragMonitor
}