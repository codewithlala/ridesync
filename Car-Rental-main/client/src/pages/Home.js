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
  UnorderedListOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [capacityFilter, setCapacityFilter] = useState("all");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");
  const [carTypeFilter, setCarTypeFilter] = useState("all");
  const [filteredCars, setFilteredCars] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [viewType, setViewType] = useState("list");
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
    AOS.init({
      duration: 1000,
    });
  }, [dispatch]);

  useEffect(() => {
    if (cars && cars.length > 0) {
      setTotalCars(cars);
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
                          icon={<FilterOutlined style={{ border: "none" }} />}
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
                                defaultValue={0}
                                disabled
                                allowHalf
                                style={{ fontSize: "14px", display: "none" }}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                              }}
                            >
                              <Tag
                                color="blue"
                                icon={
                                  <UserOutlined style={{ border: "none" }} />
                                }
                              >
                                {car.capacity} Seats
                              </Tag>
                              <Tag
                                color="volcano"
                                icon={
                                  <EnvironmentOutlined
                                    style={{ border: "none" }}
                                  />
                                }
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

      <div className="d-flex justify-content-between">
        <Button onClick={setFilter}>
          <FilterOutlined style={{ border: "none" }} /> Filter
        </Button>
        <Button onClick={() => setShowModal(true)}>
          <UserOutlined style={{ border: "none" }} /> Your Favorites
        </Button>
        <Button
          onClick={() => setViewType(viewType === "map" ? "list" : "map")}
        >
          {viewType === "map" ? (
            <UnorderedListOutlined style={{ border: "none" }} />
          ) : (
            <EnvironmentOutlined style={{ border: "none" }} />
          )}
          {viewType === "map" ? " List View" : " Map View"}
        </Button>
      </div>
    </DefaultLayout>
  );
}

export default Home;
