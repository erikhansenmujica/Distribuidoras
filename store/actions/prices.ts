import axios from "axios"
import ApiUrl from "../../constants/ApiUrl"

import { ADD_PRICES } from "../constants";

export const addRoutes = (prices:any) => ({
  type: ADD_PRICES,
  payload: prices,
});




export const getPriceList= (company:string , setLoading:any) =>async (dispatch:any)=>{
    setLoading(true)
    let res:any
    try {
     res= await axios.post(ApiUrl+"/company/pricelist",{company})
    } catch (error) {
      alert("Error de conexión")
    }
    if(res.data.error){
      setLoading(false)
      alert(res.error())
      return
    }
    dispatch(addRoutes(res.data))
    setLoading(false)
  }