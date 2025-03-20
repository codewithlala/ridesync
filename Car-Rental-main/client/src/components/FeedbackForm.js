import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Rate,
  Select,
  Card,
  Typography,
  message,
  Alert,
  notification,
} from "antd";
import {
  SmileOutlined,
  CarOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveCarRating } from "../utils/carRatings";

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const FeedbackForm = ({ booking, onComplete }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    setSubmitting(true);

    try {
      // Save rating using the utility function
      const success = saveCarRating(
        booking.car._id,
        values.rating,
        values.comment,
        booking._id
      );

      if (success) {
        // Show success notification
        notification.success({
          message: "Thank you for your feedback!",
          description: "Your rating and comments have been saved.",
          placement: "topRight",
        });

        setSubmitted(true);

        // If onComplete callback is provided, call it
        if (onComplete) {
          onComplete();
        }
      } else {
        throw new Error("Failed to save rating");
      }
    } catch (error) {
      notification.error({
        message: "Error saving feedback",
        description:
          "There was a problem saving your feedback. Please try again.",
        placement: "topRight",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const viewBookings = () => {
    navigate("/userbookings");
  };

  if (submitted) {
    return (
      <Card className="feedback-success">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <CheckCircleOutlined
            style={{ fontSize: 60, color: "#52c41a", marginBottom: 20 }}
          />
          <Title level={3}>Feedback Submitted Successfully!</Title>
          <Text>Thank you for sharing your experience with us.</Text>
          <div style={{ marginTop: 30 }}>
            <Button type="primary" onClick={viewBookings}>
              View My Bookings
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <StarOutlined style={{ marginRight: 10, color: "#faad14" }} />
          <span>Rate Your Experience</span>
        </div>
      }
      className="feedback-form-card"
    >
      {booking && (
        <div style={{ marginBottom: 20 }}>
          <Alert
            message={`Your feedback for ${booking.car.name}`}
            description={`Booking ID: ${booking._id}`}
            type="info"
            showIcon
          />
        </div>
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          rating: 5,
          comment: "",
        }}
      >
        <Form.Item
          name="rating"
          label="How would you rate your experience?"
          rules={[
            {
              required: true,
              message: "Please rate your experience",
            },
          ]}
        >
          <Rate
            allowHalf
            character={<StarOutlined />}
            style={{ fontSize: 36 }}
          />
        </Form.Item>

        <Form.Item
          name="comment"
          label={
            <div style={{ display: "flex", alignItems: "center" }}>
              <CommentOutlined style={{ marginRight: 8 }} />
              <span>Share your experience (Optional)</span>
            </div>
          }
        >
          <TextArea
            rows={4}
            placeholder="Tell us about your experience with the car..."
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ width: "100%" }}
            size="large"
          >
            Submit Feedback
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FeedbackForm;
