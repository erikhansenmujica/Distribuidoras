//fecha, hora, cliente, usuario,	ruta, importe, fecha_cobro_cheque, detalle
import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";
import * as SQLite from "expo-sqlite";
function openDatabase() {
  const db = SQLite.openDatabase("distributor");
  return db;
}
const db = openDatabase();

export const setNewPayment = async (
  payment:
    | {
        fecha: any;
        hora: string;
        cliente: any;
        usuario: any;
        ruta: any;
        importe: any;
        fecha_cobro_cheque: any;
        detalle: string;
        company: any;
      }
    | any[],
  setLoading: any,
  setCheques:any,
  setEfectivo:any,
) => {
  setLoading(true);
  // let res: any;
  // try {
  //   res = await axios.post(ApiUrl + "/company/newpayment", { payment });
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
  if (Array.isArray(payment)&&payment.length) {
    function recursiveQueries(pay = payment[0], counter = 0) {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM tbl_cobranza ORDER BY id desc LIMIT 1",
          [],
          function (e, r) {
            let c = r.rows["_array"][0]
              ? JSON.stringify(parseFloat(r.rows["_array"][0].id) + 1)
              : 1;
            tx.executeSql(
              "INSERT INTO tbl_cobranza (id, fecha, hora, cliente, usuario,	ruta, importe, fecha_cobro_cheque, detalle) VALUES (" +
                "'" +
                c +
                "'" +
                ", " +
                "'" +
                pay.fecha +
                "'" +
                ", " +
                "'" +
                pay.hora +
                "'" +
                ", " +
                "'" +
                pay.cliente +
                "'" +
                ", " +
                "'" +
                pay.usuario +
                "'" +
                ", " +
                "'" +
                pay.ruta +
                "'" +
                ", " +
                "'" +
                pay.importe +
                "'" +
                ", " +
                "'" +
                pay.fecha_cobro +
                "'" +
                ", " +
                "'" +
                pay.detalle +
                "'" +
                ")",
              [],
              function (error, result) {
                if (counter === payment["length"] - 1) {
                  setLoading(false);
                  alert("Pago añadido!");
                  setCheques([])
                  return;
                }

                counter += 1;
                recursiveQueries(payment[counter], counter);
              }
            );
          }
        );
      });
    }
    recursiveQueries();
  } else if(!Array.isArray(payment))
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT * FROM tbl_cobranza ORDER BY id desc LIMIT 1",
        [],
        function (e, r) {
          let c = r.rows["_array"][0]
            ? JSON.stringify(parseFloat(r.rows["_array"][0].id) + 1)
            : 1;
          tx.executeSql(
            "INSERT INTO tbl_cobranza (id, fecha, hora, cliente, usuario,	ruta, importe, fecha_cobro_cheque, detalle) VALUES (" +
              "'" +
              c +
              "'" +
              ", " +
              "'" +
              payment.fecha +
              "'" +
              ", " +
              "'" +
              payment.hora +
              "'" +
              ", " +
              "'" +
              payment.cliente +
              "'" +
              ", " +
              "'" +
              payment.usuario +
              "'" +
              ", " +
              "'" +
              payment.ruta +
              "'" +
              ", " +
              "'" +
              payment.importe +
              "'" +
              ", " +
              "'" +
              payment.fecha +
              "'" +
              ", " +
              "'" +
              payment.detalle +
              "'" +
              ")",
            [],
            function (error, result) {
              setLoading(false);
              alert("Pago añadido!");
              setEfectivo({importe: "", detalle: ""})
              return;
            }
          );
        }
      )
    );
    else{
      setLoading(false)
      alert("Error añadiendo pago.")
    }
};
