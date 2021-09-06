import axios from "axios";
import JWT from "expo-jwt";
import ApiUrl from "../../constants/ApiUrl";
import { getToken, removeToken, setToken } from "../../token";
import { ADD_ROUTES } from "../constants";

export const addRoutes = (routes) => ({
  type: ADD_ROUTES,
  payload: routes,
});

export const fetchRoutes = (distribuidoraId,setLoading)=>async (dispatch:any)=>{

    setLoading(true);

    const res = await axios.get(
      ApiUrl + "/company/routes/" + distribuidoraId
    );
    if (res.data.error) alert(res.data.error);
    else dispatch(addRoutes(res.data))
    setLoading(false);
}