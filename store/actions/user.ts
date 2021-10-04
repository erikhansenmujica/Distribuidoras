import axios from "axios";
import JWT from "expo-jwt";
import ApiUrl from "../../constants/ApiUrl";
import { getToken, removeToken, setToken } from "../../token";
import { ADD_USER } from "../constants";

export const addUser = (user) => ({
  type: ADD_USER,
  payload: user,
});

export const registerUserAction = async (
  user: {
    deviceId: string;
    company: string;
    name: string;
    email: string;
    password: string;
  },
  navigation: any,
  setLoading: any
) => {
  let res: any;
  setLoading&&setLoading(true)
  try {
    res = await axios.post(ApiUrl + "/register", user);
  } catch (error) {
    alert("Error del servidor.");
    setLoading && setLoading(false);
    return;
  }
  if (res.data.error) {
    setLoading && setLoading(false);
    alert(res.data.error);
    return;
  }
  setLoading && setLoading(false);
  navigation && navigation.navigate("Login");
  return;
};

export const logUserAction =
  async (
    user: { deviceId: string; email: string; password: string },
    navigation: any,
    setLoading: any
  ) =>
  async (dispatch: any) => {
    let res: any;
    setLoading && setLoading(true);

    try {
      res = await axios.post(ApiUrl + "/login", user);
    } catch (error) {
      setLoading && setLoading(false);
      alert("Error del servidor");
      return;
    }
    if (res.data.error) {
      alert(res.data.error);
      setLoading && setLoading(false);
      return;
    }
    if (res.data.auth_token) await setToken(res.data.auth_token);
    const token = JWT.decode(res.data.auth_token, "shhhhh").dataValues;
    dispatch(addUser({ ...token, device: res.data.device }));
    setLoading && setLoading(false);
    return (
      navigation &&
      navigation.navigate(token.habilitado ? "Root" : "NotFound")
    );
  };



 export const  getUserSavedToken= (deviceId:string, setLoading:any)=>async (dispatch:any)=> {
    const token = await getToken();
    if (token) {
      const u = JWT.decode(token, "shhhhh").dataValues;
      if (u) {
        let res:any;
        try {
          res = await axios.get(ApiUrl + "/user/device/" + deviceId);
        } catch (error) {
          alert(error);
        }
        if (res.data.error) {
          alert(res.data.error);
          dispatch(addUser(null));
          await removeToken();
          setLoading(false);
          return;
        }
        dispatch(addUser({ ...u, device: res.data }));
      }
    }
    setLoading(false);
  }