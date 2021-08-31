import axios from "axios";
import * as SQLite from "expo-sqlite";
import ApiUrl from "../../constants/ApiUrl";
import { addUser } from "../../store/actions/user";
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
  async function doselect(tableName) {
    db.transaction((tx) =>
      tx.executeSql(
        tableName === "vista_movimientos_cuenta_corriente"
          ? "SELECT * FROM " +
              tableName +
              " ORDER BY id_movimiento desc LIMIT 1"
          : "SELECT * FROM " + tableName,
        [],
        (_, { rows }) => {
          if (rows.length) {
            setCubes(cubos + 2);
            cubos += 2;
          }
          if (tableName === "vista_movimientos_cuenta_corriente") {
            console.log(rows._array[0]);
            axios
              .post(ApiUrl + "/update/device/" + deviceId, {
                key: "ultimo_movimiento_cta_cte",
                value: rows._array[0].id_movimiento,
              })
              .then((res) => {
                dispatch(addUser({ ...user, device: res.data }));
              });
          } else console.log(rows.length);
        }
      )
    );
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
  function checker(key) {
    let message="Sincronizando:"
    if(key){
    tablesAr.forEach((e) => {
      if(e[key]){
        e[key].finished=true
        if (!e[key].finished) message+=(" "+e[key].message)
      }
      else if (!e[key]) {
        if (!e[Object.keys(e)[0]].finished) {
          message+=(" "+e[Object.keys(e)[0]].message)
        }
      }
    });
    if(message==="Sincronizando:")setModalVisible(false)
  }
  else tablesAr.forEach((e, i) => {
      if (!e[Object.keys(e)[0]].finished) {
        message+=(" "+e[Object.keys(e)[0]].message)
      }
  });
  setMessage(message)
  }
  async function startSync(arr) {
    checker()
    arr.forEach(async (e, i) => {
      let key = Object.keys(e)[0];
      let res;
      try {
        res = await axios.get(ApiUrl + e[key].apiRoute + "/" + companyId);
      } catch (error) {
        alert(error);
      }
      doBigQuery(
        key,
        res.data,
        0,
        9,
        doselect,
        cubos,
        setCubes,
        checker
      );
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
  checker
) {
  let parameters = [];
  let bigqery = "";
  let minData = data.slice(start, limit);
  let values = "(";
  let i = 0;
  if (!minData[0] || start > data.length) {
    console.log("terminado ", tableName);
    checker(tableName);
    doselect(tableName, cubos, setCubes);
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
            checker
          );
        },
        function (_, error) {
          console.log(error);
        }
      );
    }
  });
}
