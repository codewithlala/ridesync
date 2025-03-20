import "./App.css";
import { Route, BrowserRouter, Navigate } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingCar from "./pages/BookingCar";
import UserBookings from "./pages/UserBookings";
import AddCar from "./pages/AddCar";
import AdminHome from "./pages/AdminHome";
import EditCar from "./pages/EditCar";
import LandingPage from "./pages/LandingPage";

export const ProtectedRoute = ({ children }) => {
  if (localStorage.getItem("user")) {
    return children;
  }
  return <Navigate to="/login" />;
};

export const AdminRoute = ({ children }) => {
  if (localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.isAdmin) {
      return children;
    }
    return <Navigate to="/" />;
  }
  return <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/booking/:carid",
    element: (
      <ProtectedRoute>
        <BookingCar />
      </ProtectedRoute>
    ),
    loader: ({ params }) => {
      return params.carid;
    },
  },
  {
    path: "userbookings",
    element: (
      <ProtectedRoute>
        <UserBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: "addcar",
    element: (
      <AdminRoute>
        <AddCar />
      </AdminRoute>
    ),
  },
  {
    path: "editcar/:carid",
    element: (
      <AdminRoute>
        <EditCar />
      </AdminRoute>
    ),
    loader: ({ params }) => {
      return params.carid;
    },
  },
  {
    path: "admin",
    element: (
      <AdminRoute>
        <AdminHome />
      </AdminRoute>
    ),
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
