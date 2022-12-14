import axios from "axios";
import { ORDER_LIST_MY_RESET } from "../constants/orderConstant";
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
} from "../constants/userContants";
import swal from "sweetalert";

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: ORDER_LIST_MY_RESET });
  dispatch({ type: USER_DETAILS_RESET });
  dispatch({ type: USER_LOGOUT });
  window.location.href = "/";
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });
    const config = { headers: { "Contnet-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });
    const config = { headers: { "Contnet-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/users",
      { name, email, password },
      config
    );
    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });
    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_DETAILS_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Contnet-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USER_UPDATE_PROFILE_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.put("api/users/profile", user, config);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getAllUser = () => async (dispatch) => {
  dispatch({ type: "ALL_USERS_REQUEST" });
  try {
    const response = await axios.get("/api/users/getallusers");
    // console.log(response.data);
    dispatch({ type: "ALL_USERS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "ALL_USERS_FAILS", payload: error.stack });
  }
};

export const getBreederById = (id) => async (dispatch) => {
  dispatch({ type: "GET_BREEDER_REQUEST" });
  try {
    const res = await axios.post("/api/users/getbreederbyid", { id });
    // console.log(res);
    dispatch({ type: "GET_BREEDER_SUCCESS", payload: res.data });
  } catch (error) {
    dispatch({ type: "GET_BREEDER_FAILS", payload: error });
  }
};

export const breederRegister = (user) => async (dispatch) => {
  dispatch({ type: "CREATE_BREEDER_REQUEST" });
  try {
    const res = await axios.post("/api/users/createbreeder", { user });
    dispatch({ type: "CREATE_BREEDER_SUCCESS", payload: res.data });
    // console.log(res);
    window.location.href = "/breeder";
    swal("Breeder Application sent successfully");
  } catch (error) {
    dispatch({ type: "CREATE_BREEDER_FAILS", payload: error });
  }
};

export const transportRegister = (user) => async (dispatch) => {
  dispatch({ type: "CREATE_TRANSPORT_REQUEST" });
  try {
    const res = await axios.post("/api/users/createtransport", { user });
    dispatch({ type: "CREATE_TRANSPORT_SUCCESS", payload: res.data });
    // console.log(res);
    window.location.href = "/transport";
    swal("Transporter Application sent successfully");
  } catch (error) {
    dispatch({ type: "CREATE_TRANSPORT_FAILS", payload: error });
  }
};

export const breederList = () => async (dispatch) => {
  dispatch({ type: "GET_BREEDER_LIST_REQUEST" });
  try {
    const res = await axios.get("/api/users/breederlist");
    dispatch({ type: "GET_BREEDER_LIST_SUCCESS", payload: res.data });
    // console.log(res);
  } catch (error) {
    dispatch({ type: "GET_BREEDER_LIST_FAILS", payload: error });
  }
};

export const denyBreeder = (id) => async (dispatch) => {
  try {
    await axios.post("/api/users/denybreeder", { id });
    dispatch({ type: "BREEDER_DENY_SUCCESS" });
    swal("Application deleted", "success");
    window.location.href = "/fci/breederlist";
  } catch (error) {
    swal("Error while deleting application");
  }
};

export const deleteUser = (userid) => async (dispatch) => {
  try {
    await axios.post("/api/users/deleteuser", { userid });
    // console.log(res);
    swal("User deleted Successfully", "success");
    window.location.href = "/admin/userlist";
  } catch (error) {
    swal("Error while deleting user");
  }
};
export const deleteBreeder = (userid) => async (dispatch) => {
  try {
    await axios.post("/api/users/deletebreeder", { userid });
    // console.log(res);
    swal("User removed Successfully", "success");
    window.location.href = "/fci/breeder";
  } catch (error) {
    swal("Error while deleting user");
  }
};
export const deleteTransport = (userid) => async (dispatch) => {
  try {
    await axios.post("/api/users/deletetransport", { userid });
    // console.log(res);
    swal("User removed Successfully", "success");
    window.location.href = "/fci/transport";
  } catch (error) {
    swal("Error while deleting user");
  }
};

export const approveBreeder = (id) => async (dispatch) => {
  try {
    await axios.post("/api/users/approvebreeder", { id });
    // console.log(res);
    swal("Application accepted");
    window.location.href = "/fci/breederlist";
  } catch (error) {
    swal("Error while accepting application");
  }
};

export const transportList = () => async (dispatch) => {
  dispatch({ type: "GET_TRANSPORT_LIST_REQUEST" });
  try {
    const res = await axios.get("/api/users/transportlist");
    dispatch({ type: "GET_TRANSPORT_LIST_SUCCESS", payload: res.data });
    // console.log(res);
  } catch (error) {
    dispatch({ type: "GET_TRANSPORT_LIST_FAILS", payload: error });
  }
};

export const denyTransport = (id) => async (dispatch) => {
  try {
    await axios.post("/api/users/denytransport", { id });
    dispatch({ type: "TRANSPORT_DENY_SUCCESS" });
    swal("Application deleted", "success");
    window.location.href = "/fci/transportlist";
  } catch (error) {
    swal("Error while deleting application");
  }
};

export const approveTransport = (id) => async (dispatch) => {
  try {
    await axios.post("/api/users/approvetransport", { id });
    // console.log(res);
    swal("Application accepted");
    window.location.href = "/fci/transportlist";
  } catch (error) {
    swal("Error while accepting application");
  }
};

export const getAllBreeder = () => async (dispatch) => {
  dispatch({ type: "ALL_USERS_REQUEST" });
  try {
    const response = await axios.get("/api/users/getallbreeders");
    // console.log(response.data);
    dispatch({ type: "ALL_USERS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "ALL_USERS_FAILS", payload: error.stack });
  }
};

export const getAllTransport = () => async (dispatch) => {
  dispatch({ type: "ALL_USERS_REQUEST" });
  try {
    const response = await axios.get("/api/users/getalltransport");
    // console.log(response.data);
    dispatch({ type: "ALL_USERS_SUCCESS", payload: response.data });
  } catch (error) {
    dispatch({ type: "ALL_USERS_FAILS", payload: error.stack });
  }
};
