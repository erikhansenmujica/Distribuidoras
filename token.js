import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@auth_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e)
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("@auth_token", token);
  } catch (e) {
    console.log(e)
    return null;
  }
};
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("@auth_token");
  } catch (e) {
    return null;
  }
};

export const getDevice = async () => {
  try {
    const value = await AsyncStorage.getItem("@auth_device");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    console.log(e)
    return null;
  }
};

export const setDevice = async (token) => {
  try {
    await AsyncStorage.setItem("@auth_device", token);
  } catch (e) {
    console.log(e)
    return null;
  }
};
export const removeDevice = async () => {
  try {
    await AsyncStorage.removeItem("@auth_device");
  } catch (e) {
    return null;
  }
};