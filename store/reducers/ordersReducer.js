import { ADD_ORDERS } from "../constants";
const initialState = {
  all: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDERS:
      return { ...state, all: action.payload };
    default:
      return state;
  }
};
