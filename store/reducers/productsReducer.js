import { ADD_PRODUCTS } from "../constants";
const initialState = {
  all: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCTS:
      // let number;
      // let arr = [];
      // if (action.payload.length > 100) {
      //   number = Math.ceil(action.payload.length / 10);
      //   for (let i = 0; i < 10; i++) {
      //     arr.push(action.payload.splice(0, number));
      //   }
      //   if(arr.length)
      //   return { ...state, all: arr };
      // }
      // arr.push(action.payload)
      return { ...state, all: action.payload };

    default:
      return state;
  }
};
