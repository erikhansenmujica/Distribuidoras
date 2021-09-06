import products from "./productsReducer";
import user from "./userReducer";
import routes from "./routesReducer";
import prices from "./pricesReducer";
import { combineReducers } from "redux";

export const rootReducer = combineReducers({ products, user, routes, prices });
export type RootState = ReturnType<typeof rootReducer>;
