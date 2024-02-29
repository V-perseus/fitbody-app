import { CHANGE_REMINDER_STATE } from './types';

const initialState = {
  active: false,
  week: 0,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CHANGE_REMINDER_STATE: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
