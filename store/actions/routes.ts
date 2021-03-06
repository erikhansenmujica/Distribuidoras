import axios from "axios";
import JWT from "expo-jwt";
import ApiUrl from "../../constants/ApiUrl";
import { getToken, removeToken, setToken } from "../../token";
import { ADD_ROUTES } from "../constants";
import * as SQLite from "expo-sqlite";
function openDatabase() {
  const db = SQLite.openDatabase("distributor");
  return db;
}

const db = openDatabase();

export const addRoutes = (routes) => ({
  type: ADD_ROUTES,
  payload: routes,
});

export const fetchRoutes =
  (distribuidoraId, setLoading) => async (dispatch: any) => {
    setLoading(true);

    // const res = await axios.get(
    //   ApiUrl + "/company/routes/" + distribuidoraId
    // );
    // if (res.data.error) alert(res.data.error);
    // else dispatch(addRoutes(res.data))
    // setLoading(false);
    db.transaction((tx) =>
      tx.executeSql(
        "select * from vista_rutas",
        [],
        (_, { rows }) => {
          dispatch(addRoutes(rows["_array"]));
          setLoading(false);
        },
        (_, err) => {
          alert(err);
          return true;
        }
      )
    );
  };
