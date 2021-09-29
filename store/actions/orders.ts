import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import { ADD_ORDERS } from "../constants";
import * as SQLite from "expo-sqlite";
function openDatabase() {
  const db = SQLite.openDatabase("distributor");
  return db;
}
const db = openDatabase();

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
  // let res: any;
  // try {
  //   res = await axios.post(ApiUrl + "/company/neworder", order);
  // } catch (error) {
  //   setLoading(false);
  //   alert("Error de conexión");
  //   return;
  // }
  // if (res.data.error) {
  //   setLoading(false);
  //   alert(res.data.error);
  //   return;
  // }
  // setLoading(false);
  // alert("Pedido agregado exitosamente!");
  // navigation.goBack();
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM tbl_pedidos_moviles_para_facturar ORDER BY id desc LIMIT 1",
      [],
      function (e, { rows }) {
        let c = rows["_array"][0] ? parseInt(rows["_array"][0].id) + 1 : 1;
        tx.executeSql(
          "INSERT INTO tbl_pedidos_moviles_para_facturar (id,	fecha,	hora,	cliente,	usuario,	ruta,	tilde,	fecha_entrega,	hora_inicio,	id_reparto) VALUES (" +
            "'" +
            c +
            "'" +
            ", " +
            "'" +
            order.order.fecha +
            "'" +
            ", " +
            "'" +
            order.order.hora +
            "'" +
            ", " +
            "'" +
            order.order.cliente +
            "'" +
            ", " +
            "'" +
            order.order.usuario +
            "'" +
            ", " +
            "'" +
            order.order.ruta +
            "'" +
            ", " +
            "'" +
            order.order.tilde +
            "'" +
            ", " +
            "'" +
            order.order.fecha_entrega +
            "'" +
            ", " +
            "'" +
            order.order.hora_inicio +
            "'" +
            ", " +
            "'" +
            "0" +
            "'" +
            ")",
          [],
          function (_, resultSet) {
            let id1 = c;
            const insertProducts = (
              i = 0,
              body = { order, products: order.products },
              id = id1
            ) => {
              let p = body.products[i];
              console.log(p, i);
              if (p)
                tx.executeSql(
                  "SELECT * FROM tbl_pedidos_moviles_para_facturar_contenido ORDER BY id_contenido_pedido desc LIMIT 1",
                  [],
                  function (_, rs) {
                    let cod = rs.rows["_array"][0]
                      ? parseInt(rs.rows["_array"][0].id_contenido_pedido) + 1
                      : 1;
                    tx.executeSql(
                      "INSERT INTO tbl_pedidos_moviles_para_facturar_contenido (id_pedido_movil,	id_contenido_pedido,	producto,	cantidad,	precio,	cliente,	Producto_nombre,	ruta,	id_reparto) VALUES (" +
                        "'" +
                        id +
                        "'" +
                        ", " +
                        "'" +
                        cod +
                        "'" +
                        ", " +
                        "'" +
                        p.codigo +
                        "'" +
                        ", " +
                        "'" +
                        p.quantity +
                        "'" +
                        ", " +
                        "'" +
                        p.precio_venta +
                        "'" +
                        ", " +
                        "'" +
                        body.order.order.cliente +
                        "'" +
                        ", " +
                        "'" +
                        p.descripcion +
                        "'" +
                        ", " +
                        "'" +
                        body.order.order.ruta +
                        "'" +
                        ", " +
                        "'" +
                        "0" +
                        "'" +
                        ")",
                      [],
                      function (_, result) {
                        insertProducts((i += 1), body, c);
                      }
                    );
                  }
                );
              else {
                setLoading(false);
                alert("Pedido agregado exitosamente!");
                navigation.goBack();
              }
            };

            insertProducts();
          }
        );
      }
    )
  );
};

export const getOrders =
  (company: any, route: any, setLoading: any) => async (dispatch: any) => {
    setLoading(true);
    // let res: any;
    // try {
    //   res = await axios.get(ApiUrl + "/route/orders/" + company + "/" + route);
    // } catch (error) {
    //   setLoading(false);
    //   console.log(error);
    //   alert("Error de conexión");
    //   return;
    // }
    // if (res.data.error) {
    //   setLoading(false);
    //   alert(res.data.error);
    //   return;
    // }
    // dispatch(addOrders(res.data));
    // setLoading(false);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM tbl_pedidos_moviles_para_facturar WHERE tbl_pedidos_moviles_para_facturar.ruta = " +
          route,
        [],
        function (_, { rows }) {

          function recursiveProductsFetching(
            pedido = rows["_array"][0],
            count = 0
          ) {
            if (!pedido) {
              console.log(rows["_array"], "@@@@@@@@@@@");
              dispatch(addOrders(rows["_array"]));
              setLoading(false);
              return;
            }
            tx.executeSql(
              "SELECT * FROM tbl_pedidos_moviles_para_facturar_contenido WHERE id_pedido_movil = " +
                pedido.id,[],
              function (err, resultSet) {
                pedido.productos = resultSet.rows["_array"];
                if (count === rows["_array"].length - 1) {
                  console.log(rows["_array"], "@@@@@@@@@@@");
                  dispatch(addOrders(rows["_array"]));
                  setLoading(false);
                  return;
                }
                count += 1;
                recursiveProductsFetching(rows["_array"][count], count);
              }
            );
          }
          recursiveProductsFetching();
        }
      );
    });
  };
export const updateOrder =
  (company: any, body: any, setLoading: any, setModalVisible: any) =>
  async (dispatch: any) => {
    setLoading(true);
    let res: any;
    try {
      res = await axios.post(ApiUrl + "/route/update/order/" + company, body);
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Error de conexión");
      return;
    }
    console.log(res.data);
    if (res.data.error) {
      setLoading(false);
      alert(res.data.error);
      return;
    }
    alert("Ruta actualizada para el pedido del cliente.");
    setLoading(false);
    setModalVisible(false);
    dispatch(addOrders([]));
  };
