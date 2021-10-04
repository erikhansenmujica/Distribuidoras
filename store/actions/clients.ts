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
  body: {
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
  // try {
  //   res = await axios.post(ApiUrl + "/company/newclient", client);
  // } catch (error) {
  //   alert("Error del servidor.");
  //   setLoading && setLoading(false);
  //   return;
  // }
  // if (res.data.error) {
  //   setLoading && setLoading(false);
  //   alert(res.data.error);
  //   return;
  // }
  // setLoading && setLoading(false);
  // navigation && navigation.goBack();
  // return;
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM tbl_clientes_nuevos ORDER BY codigo desc LIMIT 1",
      [],
      function (e, { rows }) {
        let c = rows["_array"][0] ? rows["_array"][0].codigo + 1 : 1;
        tx.executeSql(
          "INSERT INTO tbl_clientes_nuevos (tipo_cuenta, codigo,	nombre,	direccion,	localidad,	provincia,	codigo_postal,	telefono,	email,	datos_entrega,	numero_lista,	cuit,	categoria_de_iva,	ing_brutos,	cod_ruta,	pos_ruta) VALUES (" +
            "'" +
            body.tipo_cuenta +
            "'" +
            ", " +
            "'" +
            c +
            "'" +
            ", " +
            "'" +
            body.nombre +
            "'" +
            ", " +
            "'" +
            body.direccion +
            "'" +
            ", " +
            "'" +
            body.localidad +
            "'" +
            ", " +
            "'" +
            body.provincia +
            "'" +
            ", " +
            "'" +
            body.codigo_postal +
            "'" +
            ", " +
            "'" +
            body.telefono +
            "'" +
            ", " +
            "'" +
            body.email +
            "'" +
            ", " +
            "'" +
            body.datos_entrega +
            "'" +
            ", " +
            "'" +
            body.numero_lista +
            "'" +
            ", " +
            "'" +
            body.cuit +
            "'" +
            ", " +
            "'" +
            body.categoria_de_iva +
            "'" +
            ", " +
            "'" +
            body.cuit +
            "'" +
            ", " +
            "'" +
            body.cod_ruta +
            "'" +
            ", " +
            "'" +
            body.pos_ruta +
            "'" +
            ")",
          [],
          function () {
            setLoading && setLoading(false);
            navigation && navigation.goBack();
            return;
          }
        );
      }
    )
  );
};

export const getClientHistorical = async (
  { client, company },
  setLoading: any,
  setOrders: any
) => {
  let res: any;
  setLoading && setLoading(true);
  // try {
  //   res = await axios.get(
  //     ApiUrl + "/client/historical/" + company + "/" + client
  //   );
  // } catch (error) {
  //   console.log(error);
  //   alert("Error del servidor.");
  //   setLoading && setLoading(false);
  //   return;
  // }
  // if (res.data.error) {
  //   setLoading && setLoading(false);
  //   alert(res.data.error);
  //   return;
  // }

  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM vista_historico_tbl_pedidos_moviles WHERE cliente = " +
        client,
      [],
      function (error, { rows }) {
        function recursiveProductsFetching(
          pedido = rows["_array"][0],
          count = 0
        ) {
          if (!pedido) {
            setOrders(rows["_array"]);
            setLoading && setLoading(false);
            return;
          }
          tx.executeSql(
            "SELECT * FROM vista_historico_tbl_pedidos_moviles_contenido WHERE id_pedido_movil = " +
              pedido.id,
            [],
            function (err, r) {
              pedido.productos = r.rows["_array"];
              if (count === rows["_array"].length - 1) {
                setOrders(rows["_array"]);
                setLoading && setLoading(false);
                return;
              }
              count += 1;
              recursiveProductsFetching(rows["_array"][count], count);
            },
            (_, err) => {
              console.log(err);
              return true;
            }
          );
        }
        recursiveProductsFetching();
      },
      function (_, error) {
        console.log(error);
        return true;
      }
    )
  );
};

export const getClientsPerRoute = (route, setClients, setLoading) => {
  setLoading(true);
  db.transaction((tx) =>
    tx.executeSql(
      "select * from vista_clientes where ruta = " +
        route +
        " ORDER BY lugar_en_ruta ASC",
      [],
      (_, { rows }) => {
        tx.executeSql(
          "select * from tbl_clientes_nuevos where cod_ruta = " + route,
          [],
          (_, r) => {
            setClients([...rows["_array"], ...r.rows["_array"]]);
            setLoading(false);
          }
        );
      },
      function (_, error) {
        alert(error);
        return true;
      }
    )
  );
};

export const getAllClients = (route, setClients, setLoading) => {
  setLoading(true);
  db.transaction((tx) =>
    tx.executeSql("select * from vista_clientes", [], (_, { rows }) => {
      tx.executeSql("select * from tbl_clientes_nuevos", [], (_, r) => {
        setClients([...rows["_array"], ...r.rows["_array"]]);
        setLoading(false);
      });
    })
  );
};
