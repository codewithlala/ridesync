import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Progress,
  List,
  Avatar,
  Empty,
} from "antd";
import {
  StarOutlined,
  CarOutlined,
  LikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import {
  getAllCarRatings,
  getAverageRating,
  getTotalRatingsCount,
  getTopRatedCarIds,
} from "../utils/carRatings";
import { useSelector } from "react-redux";

const { Title, Text, Paragraph } = Typography;

const RatingsDashboard = () => {
  const [ratings, setRatings] = useState({});
  const [topRatedCarIds, setTopRatedCarIds] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const { cars } = useSelector((state) => state.carsReducer);

  useEffect(() => {
    // Load ratings data
    const loadRatings = () => {
      setRatings(getAllCarRatings());
      setTopRatedCarIds(getTopRatedCarIds(5));
      setAverageRating(getAverageRating());
      setTotalRatings(getTotalRatingsCount());
    };

    loadRatings();

    // Setup event listener for rating changes (from localStorage)
    const handleStorageChange = (e) => {
      if (e.key === "carRatings") {
        loadRatings();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Get car data for a car ID
  const getCarById = (carId) => {
    return cars.find((car) => car._id === carId) || null;
  };

  // Calculate ratings distribution
  const calculateRatingDistribution = () => {
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    Object.values(ratings).forEach((rating) => {
      const r = Math.floor(rating.rating);
      if (r >= 1 && r <= 5) {
        distribution[r]++;
      }
    });

    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();
  const hasRatings = totalRatings > 0;

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <StarOutlined style={{ color: "#faad14", marginRight: 10 }} />
          <span>Customer Ratings & Feedback</span>
        </div>
      }
      className="ratings-dashboard"
    >
      {!hasRatings ? (
        <Empty
          description="No ratings yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <>
          {/* Rating Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Average Rating"
                  value={averageRating}
                  precision={1}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<StarOutlined />}
                  suffix="/5"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Total Ratings"
                  value={totalRatings}
                  prefix={<LikeOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Rated Cars"
                  value={Object.keys(ratings).length}
                  prefix={<CarOutlined />}
                  suffix={`/${cars.length}`}
                />
              </Card>
            </Col>
          </Row>

          {/* Rating Distribution */}
          <Card style={{ marginTop: 16 }}>
            <Title level={5}>Rating Distribution</Title>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((star) => (
                <div
                  key={star}
                  className="rating-bar-item"
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: 80, marginRight: 8 }}>
                    <Text>
                      {star} {star === 1 ? "Star" : "Stars"}
                    </Text>
                  </div>
                  <Progress
                    percent={
                      totalRatings
                        ? Math.round(
                            (ratingDistribution[star] / totalRatings) * 100
                          )
                        : 0
                    }
                    strokeColor="#faad14"
                    style={{ flex: 1 }}
                  />
                  <div style={{ width: 40, textAlign: "right" }}>
                    <Text type="secondary">{ratingDistribution[star]}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Rated Cars */}
          <Card style={{ marginTop: 16 }}>
            <Title level={5}>Top Rated Cars</Title>
            <List
              itemLayout="horizontal"
              dataSource={topRatedCarIds}
              renderItem={(carId) => {
                const car = getCarById(carId);
                const rating = ratings[carId];

                if (!car || !rating) return null;

                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar src={car.image} shape="square" size={64} />
                      }
                      title={car.name}
                      description={
                        <div>
                          <div>
                            <StarOutlined
                              style={{ color: "#faad14", marginRight: 5 }}
                            />
                            <Text strong>{rating.rating.toFixed(1)}/5</Text>
                          </div>
                          {rating.comment && (
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginTop: 5 }}
                            >
                              <CommentOutlined style={{ marginRight: 5 }} />"
                              {rating.comment}"
                            </Paragraph>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </>
      )}
    </Card>
  );
};

export default RatingsDashboard;
