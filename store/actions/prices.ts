import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";

import { ADD_PRICES } from "../constants";
import * as SQLite from "expo-sqlite";
function openDatabase() {
  const db = SQLite.openDatabase("distributor");
  return db;
}
const db = openDatabase();
export const addPrices = (prices: any) => ({
  type: ADD_PRICES,
  payload: prices,
});

export const getPriceList =
  (company: string, setLoading: any) => async (dispatch: any) => {
    setLoading(true);
    // let res:any
    // try {
    //  res= await axios.post(ApiUrl+"/company/pricelist",{company})
    // } catch (error) {
    //   alert("Error de conexión")
    // }
    // if(res.data.error){
    //   setLoading(false)
    //   alert(res.data.error)
    //   return
    // }
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT distinct(lista_precio) FROM vista_clientes ORDER BY lista_precio",
        [],
        function (_, { rows }) {
          dispatch(addPrices(rows["_array"]));
          setLoading(false);
        }
      );
    });
  };
