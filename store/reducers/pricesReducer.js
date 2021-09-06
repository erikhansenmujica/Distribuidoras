import { ADD_PRICES } from "../constants";
const initialState = {
  all: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRICES:
      return { ...state, all: action.payload };
    default:
      return state;
  }
};
