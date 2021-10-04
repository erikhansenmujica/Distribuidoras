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
export default (
  companyId,
  setCubes,
  setMessage,
  setModalVisible,
  deviceId,
  dispatch,

  user
) => {
  let cubos = 0;

  async function doselect(tableName, finished) {
    if (tableName === "vista_movimientos_cuenta_corriente" && finished) {
      db.transaction((tx) =>
        tx.executeSql(
          "SELECT * FROM " + tableName + " ORDER BY id_movimiento desc LIMIT 1",
          [],
          (_, { rows }) => {
            axios
              .post(ApiUrl + "/update/device/" + deviceId, {
                key: "ultimo_movimiento_cta_cte",
                value: rows._array[0].id_movimiento,
              })
              .then((res) => {
                dispatch(addUser({ ...user, device: res.data }));
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
        message: "(productos)",
        finished: false,
        started: false,
      },
    },
    {
      tbl_clientes_nuevos: {
        message: "(clientes nuevos)",
        finished: false,
        started: false,
      },
    },
    {
      vista_historico_tbl_pedidos_moviles: {
        message: "(pedidos historicos)",
        finished: false,
        started: false,
      },
    },
    {
      vista_historico_tbl_pedidos_moviles_contenido: {
        message: "(contenido pedidos historicos)",
        finished: false,
        started: false,
      },
    },

    {
      vista_clientes: {
        message: "(clientes)",
        finished: false,
        started: false,
      },
    },
    {
      vista_rutas: {
        message: "(rutas)",
        finished: false,
        started: false,
      },
    },
    {
      vista_movimientos_cuenta_corriente: {
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
      let pk = "";

      let key = Object.keys(e)[0];
      let res;
      if (key === "tbl_clientes_nuevos") {
        pk = "codigo";
      }
      if (key === "vista_clientes") {
        pk = "codigo";
      }
      if (key === "vista_historico_tbl_pedidos_moviles") {
        pk = "id";
      }
      if (key === "vista_historico_tbl_pedidos_moviles_contenido") {
        pk = "id_contenido_pedido";
      }
      if (key === "vista_movimientos_cuenta_corriente") {
        pk = "id_movimiento";
      }
      if (key === "vista_productos") {
        pk = "codigo";
      }
      if (key === "vista_rutas") {
        pk = "codigo_ruta";
      }
      db.transaction((tx) =>
        tx.executeSql(
          "SELECT * FROM " +
            key +
            " ORDER BY cast(" +
            pk +
            " as unsigned) desc LIMIT 1",
          [],
          async (_, { rows }) => {
            try {
              if (rows["_array"][0])
                res = await axios.get(
                  ApiUrl +
                    "/sync/table/" +
                    key +
                    "/" +
                    companyId +
                    "/" +
                    rows["_array"][0][pk]
                );
              else
                res = await axios.get(
                  ApiUrl + "/sync/table/" + key + "/" + companyId + "/" + 0
                );
            } catch (error) {
              console.log(error);
              alert(error);
            }
            doBigQuery(key, res.data, 0, 9, doselect, cubos, setCubes, checker);
          }
        )
      );
    });
  }
  startSync(tablesAr);
};

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
    checker(tableName, doselect, cubos, setCubes);
    doselect(tableName);
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
