import axios from "axios";
import { message } from "antd";
export const bookCar = (reqObj) => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.post("/api/bookings/bookcar", reqObj);

    if (response.data.success) {
      dispatch({ type: "LOADING", payload: false });
      message.success("Your car booked successfully");

      // Store payment info in local storage for reference
      const paymentInfo = {
        transactionId: response.data.paymentIntent.id,
        amount: response.data.paymentIntent.amount,
        status: response.data.paymentIntent.status,
        bookingId: response.data.booking._id,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("lastPayment", JSON.stringify(paymentInfo));

      setTimeout(() => {
        window.location.href = "/userbookings";
      }, 500);
    } else {
      dispatch({ type: "LOADING", payload: false });
      message.error(
        response.data.message || "Something went wrong with your booking"
      );
    }
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
    message.error(
      error.response?.data?.message || "Something went wrong, please try later"
    );
  }
};

export const getAllBookings = () => async (dispatch) => {
  dispatch({ type: "LOADING", payload: true });

  try {
    const response = await axios.get("/api/bookings/getallbookings");
    dispatch({ type: "GET_ALL_BOOKINGS", payload: response.data });
    dispatch({ type: "LOADING", payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: "LOADING", payload: false });
    message.error("Failed to fetch bookings. Please try again.");
  }
};
