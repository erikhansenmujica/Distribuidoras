import { ADD_USER } from "../constants";
const initialState = {
  data: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_USER:
      return { ...state, data: action.payload };
    default:
      return state;
  }
};
