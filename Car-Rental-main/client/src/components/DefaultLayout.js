import React, { useState, useEffect } from "react";
import {
  Menu,
  Dropdown,
  Button,
  Row,
  Col,
  Layout,
  Avatar,
  Badge,
  Typography,
  Divider,
  Switch,
  ConfigProvider,
  theme,
  Tooltip,
} from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  CarOutlined,
  HomeOutlined,
  LogoutOutlined,
  CalendarOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  GithubOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { defaultAlgorithm, darkAlgorithm } = theme;

function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check if user prefers dark mode at OS level
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const adminMenuItems = [
    {
      key: "home",
      label: (
        <Link to="/admin" className="menu-item">
          <HomeOutlined className="menu-icon" /> Dashboard
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <div
          style={{ color: "#ff4d4f" }}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="menu-item"
        >
          <LogoutOutlined className="menu-icon" /> Logout
        </div>
      ),
    },
  ];

  const userMenuItems = [
    {
      key: "home",
      label: (
        <Link to="/home" className="menu-item">
          <HomeOutlined className="menu-icon" /> Home
        </Link>
      ),
    },
    {
      key: "bookings",
      label: (
        <Link to="/userbookings" className="menu-item">
          <CalendarOutlined className="menu-icon" /> My Bookings
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <div
          style={{ color: "#ff4d4f" }}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="menu-item"
        >
          <LogoutOutlined className="menu-icon" /> Logout
        </div>
      ),
    },
  ];

  const menuItems = user.isAdmin ? adminMenuItems : userMenuItems;
  const menu = <Menu items={menuItems} style={{ padding: "8px 0" }} />;

  // Theme-aware styles
  const headerStyle = {
    background: isDarkMode ? "#141414" : "white",
    padding: "0 20px",
    boxShadow: isDarkMode
      ? "0 2px 8px rgba(0, 0, 0, 0.3)"
      : "0 2px 8px rgba(0, 0, 0, 0.15)",
  };

  const logoStyle = {
    color: isDarkMode ? "#8573e5" : "slateblue",
    margin: "0",
    display: "flex",
    alignItems: "center",
  };

  const footerStyle = {
    background: isDarkMode ? "#1f1f1f" : "#f5f5f5",
    padding: "30px 0",
  };

  const footerTitleStyle = {
    color: isDarkMode ? "#8573e5" : "slateblue",
  };

  const copyrightStyle = {
    color: isDarkMode ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#8573e5",
        },
      }}
    >
      <Layout className="layout-wrapper">
        <Header className="app-header bs1" style={headerStyle}>
          <Row justify="space-between" align="middle">
            <Col xs={18} sm={14} md={10} lg={6}>
              <Link
                to={user.isAdmin ? "/admin" : "/"}
                className="logo-container"
              >
                <Title level={3} style={logoStyle}>
                  <CarOutlined
                    style={{ marginRight: "10px", fontSize: "28px" }}
                  />
                  RideSync Services
                </Title>
              </Link>
            </Col>

            <Col
              xs={6}
              sm={10}
              md={14}
              lg={18}
              style={{
                textAlign: "right",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div className="right">
                <Button
                  onClick={toggleTheme}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    marginRight: 10,
                  }}
                >
                  {isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                </Button>
                <Dropdown overlay={menu} placement="bottomRight">
                  <Button style={{ border: "none", boxShadow: "none" }}>
                    <UserOutlined /> {user.username}
                  </Button>
                </Dropdown>
              </div>
            </Col>
          </Row>
        </Header>

        <Content className="content-container">
          <div className="site-content">{props.children}</div>
        </Content>

        <Footer style={footerStyle}>
          <Row justify="center" gutter={[24, 24]}>
            <Col xs={24} md={8} className="text-center">
              <Title level={4} style={footerTitleStyle}>
                <CarOutlined /> RideSync Service
              </Title>
              <Text>
                Your trusted partner for car rentals. We provide high-quality
                vehicles at affordable prices for all your transportation needs.
              </Text>
            </Col>

            <Col xs={24} md={8} className="text-center">
              <Title level={4} style={footerTitleStyle}>
                Quick Links
              </Title>
              <div className="footer-links">
                <Link to="/home">Home</Link>
                <Divider type="vertical" />
                <Link to="/userbookings">My Bookings</Link>
                <Divider type="vertical" />
                <Link to="/login">Login</Link>
                <Divider type="vertical" />
                <Link to="/register">Register</Link>
              </div>
            </Col>

            <Col xs={24} md={8} className="text-center">
              <Title level={4} style={footerTitleStyle}>
                Connect With Us
              </Title>
              <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FacebookOutlined
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: "#3b5998",
                    }}
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <TwitterOutlined
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: "#1da1f2",
                    }}
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <InstagramOutlined
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: "#e1306c",
                    }}
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <LinkedinOutlined
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: "#0077b5",
                    }}
                  />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <GithubOutlined
                    style={{
                      fontSize: "24px",
                      margin: "0 10px",
                      color: isDarkMode ? "#ffffff" : "#333",
                    }}
                  />
                </a>
              </div>
              <div className="contact-info" style={{ marginTop: "15px" }}>
                <p>
                  <MailOutlined /> support@carrental.com
                </p>
                <p>
                  <PhoneOutlined /> +1 (555) 123-4567
                </p>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "20px 0" }} />

          <Row justify="center">
            <Col span={24} className="text-center">
              <Text style={copyrightStyle}>
                &copy; {new Date().getFullYear()} Car Rental. All rights
                reserved.
              </Text>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}

export default DefaultLayout;
