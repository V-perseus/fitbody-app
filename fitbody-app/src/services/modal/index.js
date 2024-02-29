import { store } from '../../store';
import { update, clear } from './actions';

export const modalNotAvailable = () => {
  store.dispatch(update());
};

export const modalAvailable = () => {
  store.dispatch(clear());
};
