import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import { ADD_PRODUCTS } from "../constants";

export const addProducts = (products: any) => ({
  type: ADD_PRODUCTS,
  payload: products,
});

export const fetchProducts =
  (distribuidoraId: any, setLoading: any) => async (dispatch: any) => {
    setLoading(true);
    let res:any
    try {
       res = await axios.get(
        ApiUrl + "/company/products/" + distribuidoraId
      
        );
    } catch (error) {
      
    }
    if (res.data.error) alert(res.data.error);
    else dispatch(addProducts(res.data));
    setLoading(false);
  };
