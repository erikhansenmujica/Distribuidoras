import axios from "axios";
import JWT from "expo-jwt";
import ApiUrl from "../../constants/ApiUrl";
import * as SQLite from "expo-sqlite";
function openDatabase() {
  const db = SQLite.openDatabase("distributor");
  return db;
}
const db = openDatabase();

export const registerClientAction = async (
  client: {
    tipo_cuenta: any;
    nombre: string;
    direccion: string;
    localidad: string;
    provincia: string;
    codigo_postal: string;
    telefono: string;
    email: string;
    datos_entrega: string;
    numero_lista: any;
    cuit: string;
    categoria_de_iva: string;
    cod_ruta: any;
    pos_ruta: any;
    company: any;
  },
  navigation: any,
  setLoading: any
) => {
  let res: any;
  setLoading && setLoading(true);
  try {
    res = await axios.post(ApiUrl + "/company/newclient", client);
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
  navigation && navigation.goBack();
  return;
};

export const getClientHistorical = async (
  { client, company },
  setLoading: any
) => {
  let res: any;
  setLoading && setLoading(true);
  try {
    console.log(ApiUrl + "/client/historical/" + company + "/" + client);
    res = await axios.get(
      ApiUrl + "/client/historical/" + company + "/" + client
    );
  } catch (error) {
    console.log(error);
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
  return res.data;
};

export const getClientsPerRoute = (route, setClients, setLoading) => {
  db.transaction((tx) =>
    tx.executeSql(
      "select * from vista_clientes where ruta = " +
        route +
        " ORDER BY lugar_en_ruta ASC",
      [],
      (_, { rows }) => {
        setClients(rows["_array"]);
        setLoading(false);
      }
    )
  );
};
