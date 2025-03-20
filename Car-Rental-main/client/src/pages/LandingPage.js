import React from "react";
import { Row, Col, Card, Typography, Button, Statistic, Divider } from "antd";
import { Link } from "react-router-dom";
import {
  CarOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text, Paragraph } = Typography;

function LandingPage() {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          background:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1584936684506-c3a7086e8212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1694&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Row justify="center" style={{ width: "100%" }}>
          <Col xs={24} lg={16}>
            <Title
              level={1}
              style={{ color: "white", marginBottom: "20px" }}
              data-aos="fade-down"
            >
              Welcome to RideSync Services
            </Title>
            <Paragraph
              style={{ color: "white", fontSize: "18px", marginBottom: "30px" }}
              data-aos="fade-up"
            >
              Your trusted partner for premium car rentals. Experience the
              freedom of the road with our extensive collection of vehicles.
            </Paragraph>
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  background: "slateblue",
                  borderColor: "slateblue",
                  height: "50px",
                  padding: "0 30px",
                }}
                data-aos="fade-up"
              >
                Get Started
              </Button>
            </Link>
          </Col>
        </Row>
      </div>

      {/* Features Section */}
      <div style={{ padding: "80px 0", background: "#f0f2f5" }}>
        <Row justify="center" gutter={[24, 24]}>
          <Col xs={24} lg={20}>
            <Title
              level={2}
              style={{ textAlign: "center", marginBottom: "50px" }}
            >
              Why Choose Us?
            </Title>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="feature-card"
                  data-aos="fade-up"
                  style={{ height: "100%" }}
                >
                  <CarOutlined
                    style={{ fontSize: "40px", color: "slateblue" }}
                  />
                  <Title level={4}>Wide Range of Vehicles</Title>
                  <Paragraph>
                    Choose from our diverse fleet of vehicles, from compact cars
                    to luxury SUVs, all maintained to the highest standards.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="feature-card"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  style={{ height: "100%" }}
                >
                  <ClockCircleOutlined
                    style={{ fontSize: "40px", color: "slateblue" }}
                  />
                  <Title level={4}>24/7 Availability</Title>
                  <Paragraph>
                    Book your vehicle anytime, anywhere. Our platform is
                    available 24/7 for your convenience.
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="feature-card"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  style={{ height: "100%" }}
                >
                  <SafetyCertificateOutlined
                    style={{ fontSize: "40px", color: "slateblue" }}
                  />
                  <Title level={4}>Safe & Secure</Title>
                  <Paragraph>
                    All our vehicles are insured and regularly maintained for
                    your safety and peace of mind.
                  </Paragraph>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Stats Section */}
      <div style={{ padding: "80px 0" }}>
        <Row justify="center" gutter={[24, 24]}>
          <Col xs={24} lg={20}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Card data-aos="fade-up">
                  <Statistic
                    title="Total Cars"
                    value={50}
                    prefix={<CarOutlined />}
                    valueStyle={{ color: "slateblue" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card data-aos="fade-up" data-aos-delay="100">
                  <Statistic
                    title="Happy Customers"
                    value={1000}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card data-aos="fade-up" data-aos-delay="200">
                  <Statistic
                    title="Cities Covered"
                    value={10}
                    prefix={<EnvironmentOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div
        style={{ padding: "80px 0", background: "slateblue", color: "white" }}
      >
        <Row justify="center" gutter={[24, 24]}>
          <Col xs={24} lg={20} style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "white", marginBottom: "20px" }}>
              Ready to Start Your Journey?
            </Title>
            <Paragraph
              style={{ color: "white", fontSize: "18px", marginBottom: "30px" }}
            >
              Join thousands of satisfied customers who trust us for their car
              rental needs.
            </Paragraph>
            <Link to="/register">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                style={{
                  background: "white",
                  borderColor: "white",
                  color: "slateblue",
                  height: "50px",
                  padding: "0 30px",
                }}
              >
                Sign Up Now
              </Button>
            </Link>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default LandingPage;
