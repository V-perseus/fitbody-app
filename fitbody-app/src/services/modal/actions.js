import * as types from './types';
import { initialState } from './reducer';

export const update = () => ({
  type: types.UPDATE
});

export const clear = () => ({
  type: types.CLEAR,
  payload: initialState
});
