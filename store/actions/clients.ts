import axios from "axios";
import JWT from "expo-jwt";
import ApiUrl from "../../constants/ApiUrl";
export const registerClientAction = async (
  client: {
    tipo_cuenta: any,
    nombre: string,
    direccion: string,
    localidad: string,
    provincia: string,
    codigo_postal: string,
    telefono: string,
    email:string,
    datos_entrega: string,
    numero_lista: any,
    cuit: string,
    categoria_de_iva: string,
    cod_ruta: any,
    pos_ruta: any,
    company: any,
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
