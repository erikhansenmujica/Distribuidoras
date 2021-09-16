import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import { ADD_ORDERS } from "../constants";

export const addOrders = (orders: any) => ({
  type: ADD_ORDERS,
  payload: orders,
});

export const setNewOrder = async (
  order: {
    products: any[];
    order: {
      fecha: any;
      cliente: any;
      hora: string;
      usuario: any;
      ruta: any;
      tilde: number;
      fecha_entrega: any;
      hora_inicio: string;
    };
  },
  setLoading: any,
  navigation: any
) => {
  setLoading(true);
  let res: any;
  try {
    res = await axios.post(ApiUrl + "/company/neworder", order);
  } catch (error) {
    setLoading(false);
    alert("Error de conexión");
    return;
  }
  if (res.data.error) {
    setLoading(false);
    alert(res.data.error);
    return;
  }
  setLoading(false);
  alert("Pedido agregado exitosamente!");
  navigation.goBack();
};

export const getOrders =
  (company: any, route: any, setLoading: any) => async (dispatch: any) => {
    setLoading(true);
    let res: any;
    try {
      res = await axios.get(
        ApiUrl + "/route/orders/" + company + "/" + route
      );
    } catch (error) {
      setLoading(false);
      console.log(error)
      alert("Error de conexión");
      return;
    }
    if (res.data.error) {
      setLoading(false);
      alert(res.data.error);
      return;
    }
    console.log(res.data)
    dispatch(addOrders(res.data));
    setLoading(false);
  };
