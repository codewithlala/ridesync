import axios from "axios";
import { message } from "antd";

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    // Use relative URL in development to leverage the proxy setting
    const response = await axios.post("/api/users/login", reqObj);
    localStorage.setItem("user", JSON.stringify(response.data));
    message.success("Login success");
    dispatch({ type: "LOADING", payload: false });

    // Check if user is admin and redirect accordingly
    const user = response.data;

    setTimeout(() => {
      if (user.isAdmin) {
        window.location.href = "/admin"; // Redirect admin to admin dashboard
      } else {
        window.location.href = "/"; // Redirect regular users to home
      }
    }, 500);
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    // Use relative URL in development to leverage the proxy setting
    const response = await axios.post("/api/users/register", reqObj);
    message.success("Registration successfull");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);

    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    message.error("Something went wrong");
    dispatch({ type: "LOADING", payload: false });
  }
};
