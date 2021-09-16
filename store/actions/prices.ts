import axios from "axios"
import ApiUrl from "../../constants/ApiUrl"

import { ADD_PRICES } from "../constants";

export const addPrices = (prices:any) => ({
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
      alert(res.data.error)
      return
    }
    dispatch(addPrices(res.data))
    setLoading(false)
  }