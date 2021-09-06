import { ADD_ROUTES } from "../constants";
const initialState = {
  all: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ROUTES:
      return { ...state, all: action.payload };
    default:
      return state;
  }
};
