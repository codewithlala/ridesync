import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import {
  Col,
  Row,
  DatePicker,
  Card,
  Typography,
  Button,
  Input,
  Divider,
  Tag,
  Rate,
  Select,
  Badge,
  Empty,
  Alert,
  Tooltip,
  Statistic,
  Modal,
  Descriptions,
  Space,
  Avatar,
} from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  CarOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  FilterOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import {
  getCarRating,
  hasCarFeedback,
  getAllCarRatings,
} from "../utils/carRatings";

const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");
  const [carTypeFilter, setCarTypeFilter] = useState("all");
  const [filteredCars, setFilteredCars] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [carRatings, setCarRatings] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
    AOS.init({
      duration: 1000,
    });

    // Load car ratings using the utility function
    setCarRatings(getAllCarRatings());
  }, [dispatch]);

  useEffect(() => {
    if (cars && cars.length > 0) {
      setTotalcars(cars);
      setFilteredCars(cars);
    }
  }, [cars]);

  useEffect(() => {
    if (totalCars.length > 0) {
      filterCars();
    }
  }, [
    totalCars,
    searchQuery,
    priceFilter,
    capacityFilter,
    fuelTypeFilter,
    carTypeFilter,
  ]);

  // Function to open car preview modal
  const showCarPreview = (car) => {
    setSelectedCar(car);
    setPreviewVisible(true);
  };

  // Function to close car preview modal
  const handlePreviewClose = () => {
    setPreviewVisible(false);
    setSelectedCar(null);
  };

  // Function to handle time range selection
  const setFilter = (values) => {
    if (!values) {
      setDateRange(null);
      filterCars();
      return;
    }

    setDateRange(values);
    const selectedFrom = moment(values[0]);
    const selectedTo = moment(values[1]);
    let temp = [];

    for (const car of totalCars) {
      if (car.bookedTimeSlots.length === 0) {
        temp.push(car);
      } else {
        let carAvailable = true;

        for (const booking of car.bookedTimeSlots) {
          const bookingFrom = moment(booking.from);
          const bookingTo = moment(booking.to);

          if (
            selectedFrom.isBetween(bookingFrom, bookingTo, null, "[]") ||
            selectedTo.isBetween(bookingFrom, bookingTo, null, "[]") ||
            bookingFrom.isBetween(selectedFrom, selectedTo, null, "[]") ||
            bookingTo.isBetween(selectedFrom, selectedTo, null, "[]")
          ) {
            carAvailable = false;
            break;
          }
        }

        if (carAvailable) {
          temp.push(car);
        }
      }
    }

    // Apply other filters on the date-filtered cars
    let filteredTemp = [...temp];

    // Apply search query filter
    if (searchQuery) {
      filteredTemp = filteredTemp.filter((car) =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        filteredTemp = filteredTemp.filter((car) => car.rentPerHour <= 50);
      } else if (priceFilter === "medium") {
        filteredTemp = filteredTemp.filter(
          (car) => car.rentPerHour > 50 && car.rentPerHour <= 100
        );
      } else if (priceFilter === "high") {
        filteredTemp = filteredTemp.filter((car) => car.rentPerHour > 100);
      }
    }

    // Apply capacity filter
    if (capacityFilter !== "all") {
      filteredTemp = filteredTemp.filter(
        (car) => car.capacity.toString() === capacityFilter
      );
    }

    // Apply fuel type filter
    if (fuelTypeFilter !== "all") {
      filteredTemp = filteredTemp.filter(
        (car) =>
          car.fuelType &&
          car.fuelType.toLowerCase() === fuelTypeFilter.toLowerCase()
      );
    }

    // Apply car type filter
    if (carTypeFilter !== "all") {
      filteredTemp = filteredTemp.filter(
        (car) =>
          car.carType &&
          car.carType.toLowerCase() === carTypeFilter.toLowerCase()
      );
    }

    setFilteredCars(filteredTemp);
  };

  // Function to handle all filters
  const filterCars = () => {
    let tempCars = [...totalCars];

    // Apply search query filter
    if (searchQuery) {
      tempCars = tempCars.filter((car) =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        tempCars = tempCars.filter((car) => car.rentPerHour <= 50);
      } else if (priceFilter === "medium") {
        tempCars = tempCars.filter(
          (car) => car.rentPerHour > 50 && car.rentPerHour <= 100
        );
      } else if (priceFilter === "high") {
        tempCars = tempCars.filter((car) => car.rentPerHour > 100);
      }
    }

    // Apply capacity filter
    if (capacityFilter !== "all") {
      tempCars = tempCars.filter(
        (car) => car.capacity.toString() === capacityFilter
      );
    }

    // Apply fuel type filter
    if (fuelTypeFilter !== "all") {
      tempCars = tempCars.filter(
        (car) =>
          car.fuelType &&
          car.fuelType.toLowerCase() === fuelTypeFilter.toLowerCase()
      );
    }

    // Apply car type filter
    if (carTypeFilter !== "all") {
      tempCars = tempCars.filter(
        (car) =>
          car.carType &&
          car.carType.toLowerCase() === carTypeFilter.toLowerCase()
      );
    }

    // Update filtered cars
    setFilteredCars(tempCars);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setCapacityFilter("all");
    setFuelTypeFilter("all");
    setCarTypeFilter("all");
    setDateRange(null);
    setFilteredCars(totalCars);
  };

  // Get unique fuel types for filter options
  const getFuelTypes = () => {
    const types = new Set();
    cars.forEach((car) => {
      if (car.fuelType) {
        types.add(car.fuelType.toLowerCase());
      }
    });
    return Array.from(types);
  };

  // Get unique capacities for filter options
  const getCapacities = () => {
    const capacities = new Set();
    cars.forEach((car) => capacities.add(car.capacity));
    return Array.from(capacities).sort((a, b) => a - b);
  };

  // Get unique car types for filter options
  const getCarTypes = () => {
    const types = new Set();
    cars.forEach((car) => {
      if (car.carType) types.add(car.carType);
    });
    return Array.from(types);
  };

  return (
    <DefaultLayout>
      <div
        className="hero-section"
        style={{ padding: "30px 0", background: "#f0f2f5" }}
      >
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} lg={20}>
            <Card
              className="filter-card bs1"
              style={{ borderRadius: "15px", overflow: "hidden" }}
            >
              <Title
                level={3}
                style={{ marginBottom: "20px", textAlign: "center" }}
              >
                <CarOutlined /> Find Your Perfect Ride
              </Title>

              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={8}>
                  <Text strong>Select Date & Time Range:</Text>
                  <RangePicker
                    showTime={{ format: "HH:mm" }}
                    format="MMM DD yyyy HH:mm"
                    // fix the onchange setfilter
                    onChange={setFilter}
                    style={{ width: "100%", marginTop: "8px" }}
                    placeholder={["Start Date & Time", "End Date & Time"]}
                    value={dateRange}
                  />
                </Col>

                <Col xs={24} md={16}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Text strong>Search:</Text>
                      <Input
                        placeholder="Search by car name"
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        style={{ marginTop: "8px" }}
                      />
                    </Col>

                    <Col xs={24} md={16}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-end",
                          height: "100%",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        <Select
                          value={priceFilter}
                          onChange={setPriceFilter}
                          style={{ width: "120px" }}
                          placeholder="Price"
                        >
                          <Option value="all">All Prices</Option>
                          <Option value="low">Low (≤ ₹50)</Option>
                          <Option value="medium">Medium (₹51-₹100)</Option>
                          <Option value="high">High (&gt; ₹100)</Option>
                        </Select>

                        <Select
                          value={capacityFilter}
                          onChange={setCapacityFilter}
                          style={{ width: "120px" }}
                          placeholder="Capacity"
                        >
                          <Option value="all">All Seats</Option>
                          {getCapacities().map((capacity) => (
                            <Option key={capacity} value={capacity.toString()}>
                              {capacity} Seats
                            </Option>
                          ))}
                        </Select>

                        <Select
                          value={fuelTypeFilter}
                          onChange={setFuelTypeFilter}
                          style={{ width: "120px" }}
                          placeholder="Fuel Type"
                        >
                          <Option value="all">All Fuel Types</Option>
                          {getFuelTypes().map((type) => (
                            <Option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Option>
                          ))}
                        </Select>

                        <Button
                          type="primary"
                          icon={<FilterOutlined />}
                          onClick={resetFilters}
                          style={{ marginLeft: "auto" }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {dateRange && (
                <Alert
                  message={
                    <span>
                      <CalendarOutlined /> Showing cars available from{" "}
                      <Text strong>
                        {moment(dateRange[0]).format("MMM DD, YYYY HH:mm")}
                      </Text>{" "}
                      to{" "}
                      <Text strong>
                        {moment(dateRange[1]).format("MMM DD, YYYY HH:mm")}
                      </Text>
                    </span>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: "16px" }}
                />
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {loading && <Spinner />}

      <div className="cars-container" style={{ padding: "40px 0" }}>
        <Row justify="center" gutter={[16, 16]}>
          <Col xs={24} lg={20}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <Title level={4} style={{ margin: 0 }}>
                {filteredCars.length} Cars Available
              </Title>

              <div>
                <Text type="secondary">
                  <FilterOutlined /> Filtered by{" "}
                  {[
                    dateRange && "Date Range",
                    searchQuery && "Search",
                    priceFilter !== "all" && "Price",
                    capacityFilter !== "all" && "Capacity",
                    fuelTypeFilter !== "all" && "Fuel Type",
                    carTypeFilter !== "all" && "Car Type",
                  ]
                    .filter(Boolean)
                    .join(", ") || "None"}
                </Text>
              </div>
            </div>

            {filteredCars.length === 0 ? (
              <Card style={{ textAlign: "center", padding: "30px" }}>
                <Empty
                  description={
                    <span>
                      No cars available matching your criteria. Try adjusting
                      your filters.
                    </span>
                  }
                />
                <Button onClick={resetFilters} style={{ marginTop: "16px" }}>
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <Row gutter={[16, 24]}>
                {filteredCars.map((car, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={car._id}>
                    <Card
                      hoverable
                      className="car-card"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                      cover={
                        <div
                          style={{
                            height: "180px",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <img
                            alt={car.name}
                            src={car.image}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      }
                      actions={[
                        <Statistic
                          value={car.rentPerHour}
                          prefix="₹"
                          suffix="/hr"
                          valueStyle={{ fontSize: "16px", color: "#3f8600" }}
                        />,
                        <Button
                          type="default"
                          size="small"
                          icon={<InfoCircleOutlined />}
                          onClick={() => showCarPreview(car)}
                        >
                          Preview
                        </Button>,
                        <Link to={`/booking/${car._id}`}>
                          <Button
                            type="primary"
                            style={{
                              background: "slateblue",
                              borderColor: "slateblue",
                            }}
                          >
                            Book Now
                          </Button>
                        </Link>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Title level={5} style={{ marginBottom: "8px" }}>
                            {car.name}
                          </Title>
                        }
                        description={
                          <div className="car-meta">
                            <div style={{ marginBottom: "8px" }}>
                              <Rate
                                defaultValue={getCarRating(car._id)}
                                disabled
                                allowHalf
                                style={{ fontSize: "14px" }}
                              />
                              {hasCarFeedback(car._id) && (
                                <Tooltip title="Has customer feedback">
                                  <CommentOutlined
                                    style={{ marginLeft: 8, color: "#1890ff" }}
                                  />
                                </Tooltip>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                              }}
                            >
                              <Tag color="blue" icon={<UserOutlined />}>
                                {car.capacity} Seats
                              </Tag>
                              <Tag
                                color="volcano"
                                icon={<EnvironmentOutlined />}
                              >
                                {car.fuelType}
                              </Tag>
                            </div>

                            <div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                <ClockCircleOutlined /> Available for instant
                                booking
                              </Text>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </div>

      {/* Car Preview Modal */}
      <Modal
        visible={previewVisible}
        title={selectedCar?.name || "Car Details"}
        onCancel={handlePreviewClose}
        footer={[
          <Button key="close" onClick={handlePreviewClose}>
            Close
          </Button>,
          <Link
            key="book"
            to={selectedCar ? `/booking/${selectedCar._id}` : "#"}
          >
            <Button
              type="primary"
              style={{ background: "slateblue", borderColor: "slateblue" }}
            >
              Book Now
            </Button>
          </Link>,
        ]}
        width={800}
      >
        {selectedCar && (
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <img
                src={selectedCar.image}
                alt={selectedCar.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />

              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <StarOutlined style={{ color: "#faad14", marginRight: 8 }} />
                  <Rate
                    value={getCarRating(selectedCar._id)}
                    disabled
                    allowHalf
                    style={{ fontSize: "16px" }}
                  />
                  <Text style={{ marginLeft: 8 }}>
                    {getCarRating(selectedCar._id).toFixed(1)}
                  </Text>
                </div>

                {hasCarFeedback(selectedCar._id) && (
                  <Card size="small" style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Customer Review:
                    </Text>
                    <Paragraph style={{ margin: "8px 0 0" }}>
                      "{carRatings[selectedCar._id]?.comment || "Great car!"}"
                    </Paragraph>
                  </Card>
                )}
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Descriptions title="Car Information" layout="vertical" bordered>
                <Descriptions.Item label="Name" span={3}>
                  <Text strong>{selectedCar.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Fuel Type">
                  <Tag color="volcano">{selectedCar.fuelType}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Capacity">
                  <Tag color="blue">{selectedCar.capacity} Persons</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Car Type">
                  <Tag color="cyan">{selectedCar.carType || "N/A"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Rent per Hour" span={3}>
                  <Statistic
                    value={selectedCar.rentPerHour}
                    prefix="₹"
                    suffix="/hour"
                    valueStyle={{ color: "#3f8600", fontSize: "18px" }}
                  />
                </Descriptions.Item>

                <Descriptions.Item label="Availability" span={3}>
                  {selectedCar.bookedTimeSlots &&
                  selectedCar.bookedTimeSlots.length > 0 ? (
                    <div>
                      <Text type="secondary">Currently booked for:</Text>
                      <div style={{ marginTop: 8 }}>
                        {selectedCar.bookedTimeSlots.map((slot, index) => (
                          <div key={index} style={{ marginBottom: 8 }}>
                            <Tag color="red">
                              <ClockCircleOutlined /> {slot.from} → {slot.to}
                            </Tag>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Tag color="green">Available (No current bookings)</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24 }}>
                <Text strong>Why choose this car?</Text>
                <Paragraph style={{ margin: "8px 0 0" }}>
                  This {selectedCar.name} offers excellent performance and
                  comfort. With {selectedCar.capacity} seats and{" "}
                  {selectedCar.fuelType} engine, it's perfect for{" "}
                  {selectedCar.capacity > 4 ? "family trips" : "city commuting"}
                  .
                </Paragraph>
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    </DefaultLayout>
  );
}

export default Home;
