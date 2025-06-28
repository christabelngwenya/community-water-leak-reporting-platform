import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWater,
  faCheckCircle,
  faExclamationCircle,
  faPhone,
  faEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import ReactCountryFlag from "react-country-flag";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 25px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-in-out;
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Title = styled.h2`
  color: rgb(33, 50, 78);
  margin-bottom: 20px;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
`;

const FlagIcon = styled(ReactCountryFlag)`
  position: absolute;
  left: 10px;
  width: 2em;
  height: 2em;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: rgb(33, 50, 78);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: rgb(33, 50, 78);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: rgb(26, 39, 61);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: -15px;
  margin-bottom: 15px;
  text-align: left;
`;

const ContactInfo = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
  text-align: left;

  & > div {
    margin: 8px 0;
    display: flex;
    align-items: center;

    svg {
      margin-right: 8px;
    }
  }
`;

const StatusMessage = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: ${(props) =>
    props.status === "pending"
      ? "#fff3e0"
      : props.status === "fixed"
      ? "#e0f7e9"
      : "#f8f9fa"};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${(props) =>
    props.status === "pending"
      ? "#e65100"
      : props.status === "fixed"
      ? "#007b55"
      : "#333"};
  border: 1px solid ${(props) =>
    props.status === "pending"
      ? "#e65100"
      : props.status === "fixed"
      ? "#007b55"
      : "#ccc"};
  text-align: left;
`;

const ReportLeakForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "+263",
    location: "",
    issue: "",
  });

  const [status, setStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusContact, setStatusContact] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setStatusContact(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let contact = formData.contact.trim();

    // Auto-prepend +263 if missing
    if (!contact.startsWith("+263")) {
      contact = "+263" + contact.replace(/^\+?/, "");
    }

    // Validate format
    const phoneRegex = /^\+2637[1|3|7|8][0-9]{7}$/;

    if (!phoneRegex.test(contact)) {
      setErrorMessage(
        "Please enter a valid Zimbabwean mobile number starting with +263 followed by 9 digits (e.g., +2637123456789)."
      );
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/reports", {
        ...formData,
        contact,
      });
      setSuccessMessage(
        "Thank you for reporting. We will work on the report as fast as possible. For emergencies, please contact us using the details below."
      );
      setFormData({ name: "", contact: "+263", location: "", issue: "" });
      setErrorMessage("");
    } catch (error) {
      console.error("Error submitting report", error);
      setErrorMessage("Failed to submit report. Please try again later.");
    }
  };

  const checkStatus = async () => {
    if (!statusContact) {
      setErrorMessage("Please enter a phone number to check status");
      return;
    }

    if (!statusContact.startsWith("+263")) {
      setErrorMessage("Please enter a valid Zimbabwean phone number starting with +263");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5001/api/reports/status/${statusContact}`);
      setStatus(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Error checking status", error);
      setStatus(null);
      setErrorMessage(error.response?.data?.error || "Failed to check status. Please try again later.");
    }
  };

  return (
    <Container>
      <Title>
        <FontAwesomeIcon icon={faWater} /> Report a Water Leak
      </Title>
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <FlagIcon countryCode="ZW" svg style={{ width: "2em", height: "2em" }} />
          <Input
            type="text"
            name="contact"
            placeholder="+2637123456789"
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <InputWrapper>
          <Input
            type="text"
            name="location"
            placeholder="Specific Address (e.g., 123 Main St, near Central Park)"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            name="issue"
            placeholder="Clear Description of the Issue (e.g., Burst pipe in front of house)"
            value={formData.issue}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        <Button type="submit">
          <FontAwesomeIcon icon={faCheckCircle} /> Submit Report
        </Button>
      </form>
      {successMessage && <StatusMessage status="success">{successMessage}</StatusMessage>}
      <h3>
        <FontAwesomeIcon icon={faExclamationCircle} /> Check Report Status
      </h3>
      <InputWrapper>
        <Input
          type="text"
          name="statusContact"
          placeholder="Enter Contact Number (e.g., +263712345678)"
          value={statusContact}
          onChange={handleStatusChange}
        />
      </InputWrapper>
      <Button onClick={checkStatus}>
        <FontAwesomeIcon icon={faExclamationCircle} /> Check Status
      </Button>
      {status && (
        <StatusMessage status={status.status?.toLowerCase()}>
          <div>
            <strong>Status:</strong> {status.status}
          </div>
          {status.created_at && (
            <div>
              <strong>Report Date:</strong> {new Date(status.created_at).toLocaleString()}
            </div>
          )}
          {status.message && <div>{status.message}</div>}
        </StatusMessage>
      )}
      <ContactInfo>
        <div>
          <FontAwesomeIcon icon={faPhone} /> Emergency Contact: +263715108592
        </div>
        <div>
          <FontAwesomeIcon icon={faEnvelope} /> Email: christabelchrissy01@gmail.com
        </div>
        <div>
          <FontAwesomeIcon icon={faGlobe} /> Website: www.watermanagement.com
        </div>
      </ContactInfo>
    </Container>
  );
};

export default ReportLeakForm;