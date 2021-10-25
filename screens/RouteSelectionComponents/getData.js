import axios from "axios";
import * as SQLite from "expo-sqlite";
import ApiUrl from "../../constants/ApiUrl";
import { addUser } from "../../store/actions/user";
import { setDevice } from "../../token";

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("distributor");
  return db;
}

const db = openDatabase();

export default async function (
  companyId,
  setCubes,
  setMessage,
  setModalVisible,
  deviceId,
  dispatch,
  user
) {
  let cubos = 0;
  db.transaction((tx) => {
    tx.executeSql("drop table if exists vista_clientes");
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists vista_movimientos_cuenta_corriente");
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists vista_productos");
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists vista_rutas");
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists tbl_pedidos_moviles_para_facturar");
  });
  db.transaction((tx) => {
    tx.executeSql(
      "drop table if exists tbl_pedidos_moviles_para_facturar_contenido"
    );
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists vista_historico_tbl_pedidos_moviles");
  });
  db.transaction((tx) => {
    tx.executeSql(
      "drop table if exists vista_historico_tbl_pedidos_moviles_contenido"
    );
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists tbl_clientes_nuevos");
  });
  db.transaction((tx) => {
    tx.executeSql("drop table if exists tbl_cobranza");
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_clientes (codigo int primary key not null, ruta int, nombre text, direccion text, lista_precio text, inscripcion_iva text, lugar_en_ruta int, saldo int);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_movimientos_cuenta_corriente (id_movimiento int primary key not null, codigo text, tipo_comprobante text, numero_comprobante text, fecha_vencimiento text, detalle text, importe int)"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_productos (codigo int primary key not null, codigo_barras text, descripcion text, stock int, stock_minimo text, alicuota_iva text, precio_venta int);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_rutas (codigo_ruta text not null, nombre text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists tbl_pedidos_moviles_para_facturar (id text, fecha	text,hora text, cliente int, usuario text, ruta text, tilde int, fecha_entrega text, hora_inicio text, id_reparto text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists tbl_pedidos_moviles_para_facturar_contenido (id_pedido_movil text,id_contenido_pedido text,producto int,cantidad int,precio text,cliente int,Producto_nombre text,ruta text,id_reparto text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists tbl_clientes_nuevos (tipo_cuenta text,codigo int,nombre text,direccion text,localidad text,provincia text,codigo_postal text,telefono text,email text,datos_entrega text,numero_lista text,cuit text,categoria_de_iva text,ing_brutos text,cod_ruta int,pos_ruta int);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists tbl_cobranza (id text,fecha text,hora text,cliente int,usuario text,ruta text,importe text,fecha_cobro_cheque text,detalle text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_historico_tbl_pedidos_moviles (id text,fecha text,hora text,cliente int,usuario text,ruta text,tilde int,fecha_entrega text,hora_inicio text,id_reparto text);"
    );
  });
  db.transaction((tx) => {
    tx.executeSql(
      "create table if not exists vista_historico_tbl_pedidos_moviles_contenido (id_pedido_movil text,id_contenido_pedido text,producto int,cantidad int,precio text,cliente int,Producto_nombre text,ruta text,id_reparto text);"
    );
  });

  async function doselect(tableName, finished) {
    if (tableName === "vista_movimientos_cuenta_corriente" && finished) {
      db.transaction((tx) =>
        tx.executeSql(
          tableName === "vista_movimientos_cuenta_corriente"
            ? "SELECT * FROM " +
                tableName +
                " ORDER BY id_movimiento desc LIMIT 1"
            : "SELECT * FROM " + tableName,
          [],
          (_, { rows }) => {
            axios
              .post(ApiUrl + "/update/device/" + deviceId, {
                key: "ultimo_movimiento_cta_cte",
                value: rows._array[0].id_movimiento,
              })
              .then(async (res) => {
                dispatch(addUser({ ...user, device: res.data }));
                await setDevice(JSON.stringify(res.data))
                setModalVisible(false);
              });
          }
        )
      );
    } else if (!finished) {
      setCubes(cubos + 1);
      cubos += 1;
    }
  }
  const tablesAr = [
    {
      vista_productos: {
        apiRoute: "/company/products",
        message: "(productos)",
        finished: false,
        started: false,
      },
    },
    {
      tbl_clientes_nuevos: {
        apiRoute: "/company/newclients",
        message: "(clientes nuevos)",
        finished: false,
        started: false,
      },
    },
    {
      vista_historico_tbl_pedidos_moviles: {
        apiRoute: "/company/historicorders",
        message: "(pedidos historicos)",
        finished: false,
        started: false,
      },
    },
    {
      vista_historico_tbl_pedidos_moviles_contenido: {
        apiRoute: "/company/historicorderscontent",
        message: "(contenido pedidos historicos)",
        finished: false,
        started: false,
      },
    },

    {
      vista_clientes: {
        apiRoute: "/company/clients",
        message: "(clientes)",
        finished: false,
        started: false,
      },
    },
    {
      vista_rutas: {
        apiRoute: "/company/routes",
        message: "(rutas)",
        finished: false,
        started: false,
      },
    },
    {
      vista_movimientos_cuenta_corriente: {
        apiRoute: "/company/accountmovements",
        message: "(movimientos de cuenta corriente)",
        finished: false,
        started: false,
      },
    },
  ];
  function checker(key, doselect) {
    let message = "Sincronizando:";
    if (key) {
      tablesAr.forEach((e) => {
        if (e[key]) {
          e[key].finished = true;
          if (!e[key].finished) message += " " + e[key].message;
        } else if (!e[key]) {
          if (!e[Object.keys(e)[0]].finished) {
            message += " " + e[Object.keys(e)[0]].message;
          }
        }
      });
      if (message === "Sincronizando:") {
        doselect("vista_movimientos_cuenta_corriente", true, setModalVisible);
      }
    } else
      tablesAr.forEach((e, i) => {
        if (!e[Object.keys(e)[0]].finished) {
          message += " " + e[Object.keys(e)[0]].message;
        }
      });
    setMessage(message);
  }
  async function startSync(arr) {
    checker();
    arr.forEach(async (e, i) => {
      async function recursiveFetching(from, quantity) {
        let key = Object.keys(e)[0];
        let res;
        try {
          res = await axios.get(
            ApiUrl +
              e[key].apiRoute +
              "/" +
              companyId +
              "/" +
              from +
              "/" +
              quantity
          );
        } catch (error) {
          alert(error);
          console.error(error, e.stack);

          return;
        }
        if (res.data.error) {
          alert(res.data.error);
          return;
        }
        doBigQuery(
          key,
          res.data,
          0,
          9,
          doselect,
          cubos,
          setCubes,
          checker,
          recursiveFetching,
          from,
          quantity
        );
      }
      recursiveFetching(0, 100);
    });
  }
  startSync(tablesAr);
}

function doBigQuery(
  tableName,
  data,
  start = 0,
  limit = 9,
  doselect,
  cubos,
  setCubes,
  checker,
  recursiveFetching,
  from,
  quantity
) {
  let parameters = [];
  let bigqery = "";
  let minData = data.slice(start, limit);
  let values = "(";
  let i = 0;
  if (!minData[0] || start > data.length) {
    if (data.length < quantity) {
      checker(tableName, doselect, cubos, setCubes);
      doselect(tableName);
      console.log("terminado", tableName)
    } else {
      console.log(from, quantity, tableName);
      recursiveFetching(from + quantity, quantity);
    }
    return;
  }
  for (const key in minData[0]) {
    if (Object.hasOwnProperty.call(minData[0], key)) {
      let prop = key;
      if (i === Object.keys(minData[0]).length - 1) {
        values += prop += ")";
      } else values += prop += ", ";
    }
    i++;
  }
  db.transaction((tx) => {
    minData.forEach((d, index) => {
      let string = "(";
      let i = 0;

      for (const key in d) {
        if (Object.hasOwnProperty.call(d, key)) {
          if (index === minData.length - 1 && i === Object.keys(d).length - 1) {
            string += "?) ";
          } else if (i === Object.keys(d).length - 1) {
            string += "?), ";
          } else {
            string += "?, ";
          }

          parameters.push(d[key]);
        }
        i++;
      }
      bigqery += string;
    });
    if (bigqery != "") {
      tx.executeSql(
        "INSERT INTO " +
          tableName +
          " " +
          values +
          " VALUES " +
          bigqery.slice(0, -1) +
          ";",
        parameters,
        function () {
          doBigQuery(
            tableName,
            data,
            (start = limit),
            (limit += 9),
            doselect,
            cubos,
            setCubes,
            checker,
            recursiveFetching,
            from,
            quantity
          );
        },
        function (_, error) {
          doBigQuery(
            tableName,
            data,
            (start = limit),
            (limit += 9),
            doselect,
            cubos,
            setCubes,
            checker,
            recursiveFetching,
            from,
            quantity
          );
        }
      );
    }
  });
}
