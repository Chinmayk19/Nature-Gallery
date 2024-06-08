import React, { useContext, useState } from "react";
import "./ConfirmationPage.css";
import { ImageContext } from "../../Context/ImageContext";
// import { useNavigate } from "react-router-dom";
const ConfirmationPage = () => {
  const { All_Users } = useContext(ImageContext);
  // const Navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [state, setState] = useState("Signup");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    confirmcode: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const changeUserid = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // The some() method checks if any array elements pass a test (provided as a callback function).
    const userExists = All_Users.some(
      (item) => item.username === e.target.value
    );

    if (userExists) {
      setText("Username already exists.");
    } else {
      setText("");
    }
  };

  const handleEmailVerification = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nature-gallery-z1us.onrender.com/send-verification-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            username: formData.username,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessage(
          "Verification email sent. Check your inbox and enter the code."
        );
        alert(
          "Verification email sent. Check your inbox and enter the code within 60 seconds."
        );
        setLoading(false);
      } else {
        console.error("Error sending verification email:", data.errors);
        setMessage(data.errors || "Error sending verification email.");
        alert(data.errors);
        setLoading(false);
      }
    } catch (error) {
      // console.error('Error sending verification email:', error);
      setMessage("Error sending verification email.");
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch(`https://nature-gallery-z1us.onrender.com/signup`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        window.location.replace("/");
        // Navigate("/");
        // window.location.hash("/");
        localStorage.setItem("auth-token", data.token);
        alert(data.message);
      } else {
        alert(data.message);
        setMessage(data.errors || "Error during signup.");
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error during signup.");
    }
  };

  const handlelogin = async () => {
    try {
      const response = await fetch(`https://nature-gallery-z1us.onrender.com/login`, {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        window.location.replace("/");
        // Navigate("/");
        localStorage.setItem("auth-token", data.token);
        alert("Login Successfully");
      } else {
        alert(data.errors);
      }
    } catch (error) {
      alert(`Error:${error}`);
    }
  };

  return (
    <div id="confirm">
      <h1 style={{ marginTop: "5px" }}>{state}</h1>
      {state === "Signup" ? (
        <>
          <label htmlFor="username" className="label">
            Username:
          </label>
          <input
            type="text"
            className="input-field"
            id="username"
            name="username"
            value={formData.username}
            onChange={changeUserid}
            placeholder="Enter  Userid"
            required
            autoComplete="off"
          />
        </>
      ) : (
        <></>
      )}
      <p style={{ margin: "0px", color: "red" }}>{text}</p>
      {state === "Signup" ? (
        <>
          <label htmlFor="name" className="label">
            Name:
          </label>
          <input
            type="text"
            className="input-field"
            id="name"
            name="name"
            value={formData.name}
            onChange={changeHandler}
            placeholder="Enter Your Name"
            required
            autoComplete="off"
          />
        </>
      ) : (
        <></>
      )}
      <label htmlFor="email" className="label">
        Email:
      </label>
      <input
        type="email"
        className="input-field"
        autoComplete="off"
        id="email"
        value={formData.email}
        onChange={changeHandler}
        name="email"
        placeholder="Enter Your Email"
        required
      />
      {state === "Signup" ? (
        <button className="signup-btn" onClick={handleEmailVerification} disabled={loading}>
          {loading ? "processsing" : "Send Verification Email"}
        </button>
      ) : (
        <></>
      )}
      {state === "Signup" ? (
        <>
          <label className="label">Verification Code:</label>
          <input
            type="text"
            className="input-field"
            value={formData.confirmcode}
            onChange={changeHandler}
            name="confirmcode"
            placeholder="Enter the 6 digit Verification Code"
            required
            autoComplete="off"
          />
        </>
      ) : (
        <></>
      )}

      <label className="label">Password:</label>
      <input
        type="password"
        className="input-field"
        value={formData.password}
        onChange={changeHandler}
        placeholder="Enter Password"
        name="password"
        required
        autoComplete="off"
      />
      <button
        className="signup-btn"
        onClick={() => {
          state === "Signup" ? handleSignup() : handlelogin();
        }}
      >
        {state}
      </button>
      {state === "Signup" ? (
        <p className="loginsignup-login">
          Already have an Acc?{" "}
          <span
            onClick={() => {
              setState("Login");
            }}
            style={{ cursor: "pointer", color: "green", fontWeight: "bold" }}
          >
            Login here
          </span>
        </p>
      ) : (
        <p className="loginsignup-login">
          Create an Acc?{" "}
          <span
            onClick={() => {
              setState("Signup");
            }}
            style={{ cursor: "pointer", color: "green", fontWeight: "bold" }}
          >
            Click here
          </span>
        </p>
      )}
    </div>
  );
};

export default ConfirmationPage;
