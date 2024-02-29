import { CHANGE_REMINDER_STATE } from './types';

// CHANGE REMINDER STATE
export const changeReminderState = state => dispatch => {
  dispatch({ type: CHANGE_REMINDER_STATE, payload: state });
};
