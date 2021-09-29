//fecha, hora, cliente, usuario,	ruta, importe, fecha_cobro_cheque, detalle



import axios from "axios";
import ApiUrl from "../../constants/ApiUrl";

export const setNewPayment = async (
  payment: {
      fecha: any;
      hora: string;
      cliente: any;
      usuario: any;
      ruta: any;
      importe: any;
      fecha_cobro_cheque: any;
      detalle: string;
      company:any
  }|any[],
  setLoading: any,
) => {
  setLoading(true);
  let res: any;
  try {
    res = await axios.post(ApiUrl + "/company/newpayment", {payment});
  } catch (error) {
    setLoading(false);
    alert("Error de conexión");
    return;
  }
  if (res.data.error) {
    setLoading(false);
    alert(res.data.error);
    return;
  }
  setLoading(false);
  alert("Pago añadido!");
};

