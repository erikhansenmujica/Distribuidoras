import thunkMiddleware from "redux-thunk";
//import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import {rootReducer} from "./reducers/index";

//const loggerMiddleware = createLogger();

export default createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware // nos permite despachar funciones
    //loggerMiddleware // buen middleware que registra las acciones
  )
);
