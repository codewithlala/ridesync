import {
  Col,
  Row,
  Divider,
  DatePicker,
  Checkbox,
  Modal,
  Card,
  Typography,
  Button,
  Tag,
  Descriptions,
  Badge,
  Statistic,
  Alert,
  Image,
} from "antd";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import { getAllCars } from "../redux/actions/carsActions";
import moment from "moment";
import { bookCar } from "../redux/actions/bookingActions";
import StripeCheckout from "react-stripe-checkout";
import AOS from "aos";
import { useLoaderData } from "react-router-dom";
import {
  CarOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

import "aos/dist/aos.css";

const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;

function BookingCar() {
  const match = useLoaderData();
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [car, setCar] = useState({});
  const dispatch = useDispatch();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [totalHours, setTotalHours] = useState(0);
  const [driver, setDriver] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (cars.length == 0) {
      dispatch(getAllCars());
    } else {
      setCar(cars.find((o) => o._id == match));
    }
  }, [cars]);

  useEffect(() => {
    setTotalAmount(totalHours * car.rentPerHour);
    if (driver) {
      setTotalAmount(totalAmount + 30 * totalHours);
    }
  }, [driver, totalHours]);

  function selectTimeSlots(values) {
    if (values) {
      setFrom(moment(values[0]).format("MMM DD yyyy HH:mm"));
      setTo(moment(values[1]).format("MMM DD yyyy HH:mm"));
      setTotalHours(values[1].diff(values[0], "hours"));
    } else {
      setFrom(null);
      setTo(null);
      setTotalHours(0);
      setTotalAmount(0);
    }
  }

  function onToken(token) {
    const reqObj = {
      token,
      user: JSON.parse(localStorage.getItem("user"))._id,
      car: car._id,
      totalHours,
      totalAmount,
      driverRequired: driver,
      bookedTimeSlots: {
        from,
        to,
      },
    };

    dispatch(bookCar(reqObj));
  }

  return (
    <DefaultLayout>
      {loading && <Spinner />}

      <div className="booking-container" style={{ padding: "30px 0" }}>
        <Row justify="center" gutter={[24, 24]}>
          <Col xs={24} lg={22}>
            <Title
              level={2}
              style={{ textAlign: "center", marginBottom: "30px" }}
            >
              <CarOutlined /> Book Your Ride
            </Title>

            {car._id && (
              <Card
                className="booking-card bs1"
                style={{ borderRadius: "15px", overflow: "hidden" }}
              >
                <Row gutter={[24, 24]}>
                  {/* Car Image Section */}
                  <Col xs={24} md={12}>
                    <div
                      className="car-image-container"
                      data-aos="fade-right"
                      data-aos-duration="1500"
                    >
                      <Image
                        src={car.image}
                        alt={car.name}
                        className="w-100"
                        style={{
                          borderRadius: "10px",
                          maxHeight: "350px",
                          objectFit: "cover",
                        }}
                        preview={false}
                      />

                      <div style={{ marginTop: "20px" }}>
                        <Button
                          onClick={() => setShowModal(true)}
                          icon={<ClockCircleOutlined />}
                          type="default"
                          block
                        >
                          View Booked Time Slots
                        </Button>
                      </div>
                    </div>
                  </Col>

                  {/* Booking Form Section */}
                  <Col xs={24} md={12}>
                    <div
                      className="booking-form"
                      data-aos="fade-left"
                      data-aos-duration="1500"
                    >
                      <Card
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Title level={3} style={{ margin: 0 }}>
                              {car.name}
                            </Title>
                            <Badge status="processing" text="Available" />
                          </div>
                        }
                        className="car-details-card"
                        style={{ marginBottom: "20px" }}
                      >
                        <Descriptions layout="vertical" column={2} bordered>
                          <Descriptions.Item
                            label={
                              <span>
                                <DollarOutlined /> Rent Per Hour
                              </span>
                            }
                            span={1}
                          >
                            <Tag color="green" style={{ fontSize: "16px" }}>
                              ${car.rentPerHour}
                            </Tag>
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <span>
                                <UserOutlined /> Capacity
                              </span>
                            }
                            span={1}
                          >
                            <Tag color="blue">{car.capacity} Persons</Tag>
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <span>
                                <EnvironmentOutlined /> Fuel Type
                              </span>
                            }
                            span={2}
                          >
                            <Tag color="volcano">{car.fuelType}</Tag>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>

                      <Card
                        title="Select Your Time Slot"
                        className="time-selection-card"
                      >
                        <div className="mb-3">
                          <Text type="secondary">
                            Please select your rental period:
                          </Text>
                          <RangePicker
                            showTime={{ format: "HH:mm" }}
                            format="MMM DD yyyy HH:mm"
                            onChange={selectTimeSlots}
                            className="w-100 mt-2"
                            size="large"
                            style={{ width: "100%", marginTop: "8px" }}
                          />
                        </div>

                        {from && to && (
                          <>
                            <Card
                              className="booking-summary"
                              style={{ marginTop: "20px" }}
                            >
                              <Statistic
                                title="Total Hours"
                                value={totalHours}
                                prefix={<ClockCircleOutlined />}
                                suffix="hrs"
                                style={{ marginBottom: "15px" }}
                              />

                              <Checkbox
                                onChange={(e) => {
                                  setDriver(e.target.checked);
                                }}
                                style={{ marginBottom: "15px" }}
                              >
                                <Text strong>Include Driver (+$30/hr)</Text>
                              </Checkbox>

                              <Divider style={{ margin: "15px 0" }} />

                              <div className="d-flex justify-content-between align-items-center">
                                <Title level={4} style={{ margin: 0 }}>
                                  Total Amount:
                                </Title>
                                <Statistic
                                  value={totalAmount}
                                  precision={2}
                                  valueStyle={{ color: "#3f8600" }}
                                  prefix="₹"
                                  style={{ marginBottom: 0 }}
                                />
                              </div>

                              <div
                                className="checkout-button"
                                style={{ marginTop: "20px" }}
                              >
                                <StripeCheckout
                                  shippingAddress
                                  token={onToken}
                                  currency="inr"
                                  amount={totalAmount * 100}
                                  stripeKey="pk_test_51R3D0hDkXFDdQgJnWQNm1KPWmyI9MPI3uKB7dpaO0UQZfxqT8LPooJf7ACMcnEghMJD3TLh783dWbE7Mfr5rJ3PR00AsSKatLg"
                                >
                                  <Button
                                    type="primary"
                                    size="large"
                                    icon={<CreditCardOutlined />}
                                    block
                                    style={{
                                      height: "50px",
                                      fontSize: "16px",
                                      background: "slateblue",
                                      borderColor: "slateblue",
                                    }}
                                  >
                                    Book Now
                                  </Button>
                                </StripeCheckout>
                              </div>
                            </Card>
                          </>
                        )}

                        {!from && !to && (
                          <Alert
                            type="info"
                            message="Booking Information"
                            description="Please select a time slot to see pricing and booking options."
                            showIcon
                            style={{ marginTop: "15px" }}
                          />
                        )}
                      </Card>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      {car.name && (
        <Modal
          visible={showModal}
          onCancel={() => setShowModal(false)}
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CalendarOutlined style={{ marginRight: "10px" }} />
              <span>Currently Booked Time Slots</span>
            </div>
          }
          footer={[
            <Button key="close" onClick={() => setShowModal(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          <div className="booked-slots-container p-3">
            {car.bookedTimeSlots.length === 0 ? (
              <Alert
                message="No bookings found"
                description="This car has no current bookings. You can select any time slot!"
                type="success"
                showIcon
              />
            ) : (
              <>
                <Text type="secondary">
                  The following time slots are already booked for this car.
                  Please select a different time.
                </Text>
                <div className="time-slots-list" style={{ marginTop: "15px" }}>
                  {car.bookedTimeSlots.map((slot, index) => (
                    <Card
                      key={index}
                      className="slot-card"
                      style={{
                        marginBottom: "10px",
                        borderLeft: "4px solid #f5222d",
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <ClockCircleOutlined
                          style={{
                            fontSize: "18px",
                            marginRight: "10px",
                            color: "#f5222d",
                          }}
                        />
                        <div>
                          <Text strong>From: </Text>
                          <Text>{slot.from}</Text>
                        </div>
                      </div>
                      <div className="d-flex align-items-center mt-2">
                        <ClockCircleOutlined
                          style={{
                            fontSize: "18px",
                            marginRight: "10px",
                            color: "#f5222d",
                          }}
                        />
                        <div>
                          <Text strong>To: </Text>
                          <Text>{slot.to}</Text>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </DefaultLayout>
  );
}

export default BookingCar;
