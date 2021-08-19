import products from "./productsReducer";
import user from "./userReducer";

const { combineReducers } = require("redux");

export const rootReducer= combineReducers({ products,  user });
export type RootState = ReturnType<typeof rootReducer>
