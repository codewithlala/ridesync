import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { deleteCar, getAllCars } from "../redux/actions/carsActions";
import { getAllBookings } from "../redux/actions/bookingActions";
import {
  Col,
  Row,
  Card,
  Statistic,
  Table,
  Tag,
  Button,
  Input,
  Tabs,
  Tooltip,
  Popconfirm,
  Badge,
  Avatar,
} from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import {
  DeleteOutlined,
  EditOutlined,
  CarOutlined,
  DollarCircleOutlined,
  UserOutlined,
  ScheduleOutlined,
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

const { TabPane } = Tabs;
const { Search } = Input;

function AdminHome() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { bookings } = useSelector((state) => state.bookingsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [filteredCars, setFilteredCars] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    dispatch(getAllCars());
    dispatch(getAllBookings());
  }, []);

  useEffect(() => {
    setFilteredCars(cars);
  }, [cars]);

  const searchCars = (value) => {
    const filtered = cars.filter((car) =>
      car.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCars(filtered);
  };

  const getPaymentStatus = (booking) => {
    return booking.transactionId
      ? { text: "Paid", color: "green", icon: <CheckCircleOutlined /> }
      : { text: "Pending", color: "orange", icon: <ClockCircleOutlined /> };
  };

  const bookingsColumns = [
    {
      title: "Car",
      dataIndex: ["car", "name"],
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.car?.image} icon={<CarOutlined />} />
          <span className="ml-2">{record.car?.name || "Unknown"}</span>
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      render: () => (
        <span>
          <UserOutlined className="mr-2" /> User
        </span>
      ),
    },
    {
      title: "Booking Period",
      render: (record) => (
        <div>
          <ScheduleOutlined className="mr-1" />
          {moment(record.bookedTimeSlots?.from).format("MMM DD YYYY HH:mm")} -
          {moment(record.bookedTimeSlots?.to).format("MMM DD YYYY HH:mm")}
        </div>
      ),
    },
    {
      title: "Payment Status",
      render: (record) => {
        const payment = getPaymentStatus(record);
        return (
          <Badge
            status={payment.text}
            text={
              <span style={{ color: payment.color }}>
                {payment.icon} {payment.text}
              </span>
            }
          />
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (amount) => <Tag color="green">${amount}</Tag>,
    },
  ];

  return (
    <DefaultLayout>
      <Row gutter={[16, 16]} className="mb-4">
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Total Cars"
              value={cars.length}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Total Bookings"
              value={bookings.length}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Statistic
              title="Total Revenue"
              value={bookings.reduce((acc, b) => acc + b.totalAmount, 0)}
              prefix={<DollarCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <CarOutlined /> Cars Management
            </span>
          }
          key="1"
        >
          <div className="mb-3 flex justify-between">
            <Search
              placeholder="Search cars"
              onChange={(e) => searchCars(e.target.value)}
              prefix={<SearchOutlined />}
            />
            <Link to="/addcar">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Car
              </Button>
            </Link>
          </div>
          <Row gutter={[16, 16]}>
            {filteredCars.map((car) => (
              <Col span={6} key={car._id}>
                <Card hoverable cover={<img alt={car.name} src={car.image} />}>
                  <h3>{car.name}</h3>
                  <Tag color="blue">${car.rentPerHour}/hr</Tag>
                  <div className="mt-2">
                    <Tooltip title="Edit">
                      <Link to={`/editcar/${car._id}`}>
                        <Button icon={<EditOutlined />} />
                      </Link>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="Delete this car?"
                        onConfirm={() =>
                          dispatch(deleteCar({ carid: car._id }))
                        }
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          className="ml-2"
                        />
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ScheduleOutlined /> Bookings
            </span>
          }
          key="2"
        >
          <Table
            dataSource={bookings}
            columns={bookingsColumns}
            pagination={{ pageSize: 8 }}
          />
        </TabPane>
      </Tabs>
    </DefaultLayout>
  );
}

export default AdminHome;
