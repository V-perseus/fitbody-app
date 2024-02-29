import React from 'react'
import { RootState, store } from './index'

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
type RefObject<T> = {
  current: T
}

let _store: RefObject<null | typeof store> = React.createRef<null>()

export const storeRegistry = {
  init(s: typeof store) {
    _store.current = s
  },
  getState(): RootState {
    return _store.current!.getState()
  },
  dispatch(data: any) {
    return _store.current?.dispatch(data)
  },
}
