import React, { useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookings } from "../redux/actions/bookingActions";
import {
  Col,
  Row,
  Card,
  Typography,
  Tag,
  Badge,
  Empty,
  Statistic,
  Timeline,
  Divider,
  Button,
  Image,
} from "antd";
import Spinner from "../components/Spinner";
import moment from "moment";
import {
  CarOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  UserOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text } = Typography;

function UserBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllBookings());
    AOS.init({ duration: 1000 });
  }, [dispatch]);

  // Filter bookings for current user
  const userBookings = bookings.filter((booking) => booking.user === user._id);

  // Get payment status based on transaction ID
  const getPaymentStatus = (booking) => {
    if (booking.transactionId) {
      return {
        status: "success",
        text: "Paid",
        color: "green",
      };
    } else {
      return {
        status: "warning",
        text: "Pending",
        color: "orange",
      };
    }
  };

  // Calculate total spending
  const totalSpending = userBookings.reduce(
    (total, booking) => total + booking.totalAmount,
    0
  );

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <div className="bookings-container" style={{ padding: "30px 0" }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} lg={20}>
            <div
              className="page-title"
              style={{ marginBottom: "30px", textAlign: "center" }}
            >
              <Title level={2} data-aos="fade-down">
                <CalendarOutlined /> My Bookings
              </Title>
              <Text type="secondary">
                Manage and view all your car rental bookings
              </Text>
            </div>

            {userBookings.length > 0 ? (
              <>
                <Row gutter={[16, 16]} className="booking-stats">
                  <Col xs={24} sm={8}>
                    <Card data-aos="fade-up">
                      <Statistic
                        title="Total Bookings"
                        value={userBookings.length}
                        prefix={<CalendarOutlined />}
                        valueStyle={{ color: "slateblue" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card data-aos="fade-up" data-aos-delay="100">
                      <Statistic
                        title="Total Hours"
                        value={userBookings.reduce(
                          (total, booking) => total + booking.totalHours,
                          0
                        )}
                        prefix={<ClockCircleOutlined />}
                        suffix="hrs"
                        valueStyle={{ color: "#1890ff" }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card data-aos="fade-up" data-aos-delay="200">
                      <Statistic
                        title="Total Spent"
                        value={totalSpending}
                        prefix="₹"
                        precision={2}
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Divider orientation="center">Booking History</Divider>

                {userBookings.map((booking, index) => (
                  <Card
                    key={booking._id}
                    className="booking-card bs1"
                    style={{
                      marginBottom: "20px",
                      borderRadius: "10px",
                      overflow: "hidden",
                    }}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={24} md={6}>
                        <div
                          className="car-image-container"
                          style={{ textAlign: "center" }}
                        >
                          <Badge.Ribbon
                            text={getPaymentStatus(booking).text}
                            color={getPaymentStatus(booking).color}
                          >
                            <Image
                              src={booking.car.image}
                              alt={booking.car.name}
                              style={{
                                maxHeight: "140px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                width: "100%",
                              }}
                              preview={false}
                            />
                          </Badge.Ribbon>
                          <Title
                            level={5}
                            style={{ marginTop: "10px", marginBottom: "5px" }}
                          >
                            <CarOutlined /> {booking.car.name}
                          </Title>
                        </div>
                      </Col>

                      <Col xs={24} md={10}>
                        <Timeline>
                          <Timeline.Item
                            color="green"
                            dot={
                              <CalendarOutlined style={{ fontSize: "16px" }} />
                            }
                          >
                            <Text strong>Booking Date:</Text>{" "}
                            <Text>
                              {moment(booking.createdAt).format(
                                "MMM DD YYYY, h:mm a"
                              )}
                            </Text>
                          </Timeline.Item>
                          <Timeline.Item
                            color="blue"
                            dot={
                              <ClockCircleOutlined
                                style={{ fontSize: "16px" }}
                              />
                            }
                          >
                            <Text strong>From:</Text>{" "}
                            <Text>
                              {moment(booking.bookedTimeSlots.from).format(
                                "MMM DD YYYY, h:mm a"
                              )}
                            </Text>
                          </Timeline.Item>
                          <Timeline.Item
                            color="red"
                            dot={
                              <ClockCircleOutlined
                                style={{ fontSize: "16px" }}
                              />
                            }
                          >
                            <Text strong>To:</Text>{" "}
                            <Text>
                              {moment(booking.bookedTimeSlots.to).format(
                                "MMM DD YYYY, h:mm a"
                              )}
                            </Text>
                          </Timeline.Item>
                        </Timeline>
                      </Col>

                      <Col xs={24} md={8}>
                        <Card className="booking-details">
                          <div style={{ marginBottom: "10px" }}>
                            <Text strong style={{ fontSize: "16px" }}>
                              Booking Details
                            </Text>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <ClockCircleOutlined
                              style={{ marginRight: "8px" }}
                            />
                            <Text strong>Duration:</Text>{" "}
                            <Tag color="blue">{booking.totalHours} hours</Tag>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <Text strong>Rate:</Text>{" "}
                            <Tag color="purple">
                              ₹{booking.car.rentPerHour}/hr
                            </Tag>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <UserOutlined style={{ marginRight: "8px" }} />
                            <Text strong>Driver:</Text>{" "}
                            <Tag
                              color={
                                booking.driverRequired ? "green" : "orange"
                              }
                            >
                              {booking.driverRequired
                                ? "Included"
                                : "Not Included"}
                            </Tag>
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <CreditCardOutlined
                              style={{ marginRight: "8px" }}
                            />
                            <Text strong>Transaction:</Text>{" "}
                            {booking.transactionId ? (
                              <Tag color="green" title={booking.transactionId}>
                                {booking.transactionId.substring(0, 10)}...
                              </Tag>
                            ) : (
                              <Tag color="red">Not Available</Tag>
                            )}
                          </div>
                          <Divider style={{ margin: "10px 0" }} />
                          <div className="d-flex justify-content-between align-items-center">
                            <Text strong>Total:</Text>
                            <Text
                              style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#3f8600",
                              }}
                            >
                              ₹{booking.totalAmount}
                            </Text>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </>
            ) : (
              <Card
                className="empty-bookings-card"
                style={{ textAlign: "center", padding: "40px" }}
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span>
                      You haven't made any bookings yet. Start exploring our car
                      collection!
                    </span>
                  }
                >
                  <Button
                    type="primary"
                    href="/"
                    style={{
                      background: "slateblue",
                      borderColor: "slateblue",
                    }}
                  >
                    Rent a Car
                  </Button>
                </Empty>
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </DefaultLayout>
  );
}

export default UserBookings;
