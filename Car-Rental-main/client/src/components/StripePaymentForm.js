import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Alert, Spin } from "antd";
import { CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const StripePaymentForm = ({ amount, onSuccess, buttonText = "Pay Now" }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);
    setError(null);

    // Get a reference to a mounted CardElement
    const cardElement = elements.getElement(CardElement);

    // Use stripe.js to create a payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
      return;
    }

    setSucceeded(true);
    setProcessing(false);

    // Call the onSuccess callback with the payment method ID
    onSuccess({
      id: paymentMethod.id,
      email: "customer@example.com", // This would typically come from a form field
      brand: paymentMethod.card.brand,
      last4: paymentMethod.card.last4,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          message="Payment Error"
          description={error}
          type="error"
          style={{ marginBottom: 16 }}
          showIcon
        />
      )}

      {succeeded ? (
        <Alert
          message="Payment Successful"
          description="Your payment was processed successfully!"
          type="success"
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      ) : (
        <>
          <div
            style={{
              padding: "10px",
              border: "1px solid #e8e8e8",
              borderRadius: "4px",
              marginBottom: 16,
            }}
          >
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            disabled={!stripe || processing}
            loading={processing}
            icon={<CreditCardOutlined />}
            size="large"
            block
            style={{
              height: "50px",
              fontSize: "16px",
              background: "slateblue",
              borderColor: "slateblue",
            }}
          >
            {processing ? <Spin size="small" /> : buttonText}{" "}
            {!processing && `₹${amount}`}
          </Button>
        </>
      )}
    </form>
  );
};

export default StripePaymentForm;
