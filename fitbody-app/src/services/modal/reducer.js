import * as types from './types';

export const initialState = {
  canDisplay: true
};

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.UPDATE:
      return {
        canDisplay: false
      };
    case types.CLEAR:
      return payload;
    default:
      return state;
  }
}
