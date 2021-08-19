import axios from "axios";
import { ADD_PRODUCTS } from "../constants";

const addProducts = (products) => ({
  type: ADD_PRODUCTS,
  payload: products,
});

export const fetchProducts = () => (dispatch) =>
  axios
    .get(`${"URL"}/products/all`)
    .then((products) => {
      dispatch(addProducts(products.data.productos));
    })
    .catch(console.log);
