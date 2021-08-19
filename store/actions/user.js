import { ADD_USER } from "../constants";

export const addUser = (user) => ({
  type: ADD_USER,
  payload: user,
});
