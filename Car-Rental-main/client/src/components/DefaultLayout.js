import React from "react";
import { Menu, Dropdown, Button, Space, Row, Col } from "antd";
import { Link } from "react-router-dom";

function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("user"));

  const adminMenuItems = [
    {
      key: "home",
      label: <a href="/">Home</a>,
    },
    {
      key: "bookings",
      label: <a href="/userbookings">Bookings</a>,
    },
    {
      key: "admin",
      label: <a href="/admin">Admin</a>,
    },
    {
      key: "logout",
      label: (
        <li
          style={{ color: "slateblue" }}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </li>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: "home",
      label: <a href="/">Home</a>,
    },
    {
      key: "bookings",
      label: <a href="/userbookings">Bookings</a>,
    },
    {
      key: "logout",
      label: (
        <li
          style={{ color: "slateblue" }}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </li>
      ),
    },
  ];

  // Choose menu items based on user admin status
  const menuItems = user.isAdmin ? adminMenuItems : userMenuItems;

  const menu = <Menu items={menuItems} />;

  return (
    <div>
      <div className="header bs1">
        <Row gutter={16} justify="center">
          <Col lg={20} sm={24} xs={24}>
            <div className="d-flex justify-content-between">
              <h1>
                <b>
                  <Link to="/" style={{ color: "slateblue" }}>
                    Car Rental
                  </Link>
                </b>
              </h1>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Button>{user.username}</Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>
      <div className="content">{props.children}</div>
      <div className="footer text-center">
        <hr />
        <p>All rights reserved &copy; Car Rental</p>
      </div>
    </div>
  );
}

export default DefaultLayout;
