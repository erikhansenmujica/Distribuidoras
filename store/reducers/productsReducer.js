import { ADD_PRODUCTS } from "../constants";
const initialState = {
  all: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCTS:
      const prods = action.payload.map((prod) => {
        return { ...prod, label: prod.producto };
      });
      return { ...state, all: prods };

    default:
      return state;
  }
};
