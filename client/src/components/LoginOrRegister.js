import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Header from "./Header";
import LoginError from "./LoginError";

// CONTAINS:
// the header with the page title + the login and register buttons
// the login/register functionality in a modal + the error modal

const LoginOrRegister = ({
  setCurrentView,
  validLogin,
  setValidLogin,
  showError,
  setShowError,
  sendUserId,
}) => {
  const [allUsers, setAllUsers] = useState([]); // list of all users
  const [show, setShow] = useState(false); // show login/register modal or not
  const [login, setLogin] = useState(false); // is the modal for login?
  const [register, setRegister] = useState(false); // is the modal for register?
  const [validRegistration, setValidRegistration] = useState(false); // did the user make a valid registration?
  const [error, setError] = useState(""); // error message as a hint to login and register
  const [viewPassword, setViewPassword] = useState(false); // allow the user to view what they're typing in the password field
  const [loggedUser, setLoggedUser] = useState(""); // saves the username of the logged in user
  const emailAvailable = [0]; // is the email available? [0] = false, [1] = true
  const userAvailable = [0]; // is the username available? [0] = false, [1] = true
  const passwordValidity = [0, 0, 0, 0]; // is the password valid, [1, 1, 1, 1] = true, four requirements
  const [loginInfo, setLoginInfo] = useState({
    // saves the user typed info for both login and registration
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // retrieve all the users from the backend
  const getUsers = async () => {
    const response = await fetch("http://localhost:4020/users");
    const data = await response.json();
    setAllUsers(data);
  };

  // re-retrieves the user info if the user makes a valid registration
  useEffect(() => {
    getUsers();
  }, [validRegistration]);

  // if the user wants to login, show the modal, set modal to login, set register to false, reset error/hint message
  const loginModal = () => {
    setShow(true);
    setLogin(true);
    setRegister(false);
    setError("");
  };

  // if the user wants to register, show the modal, set login to false, set modal to register, reset error/hint message
  const registerModal = () => {
    setShow(true);
    setLogin(false);
    setRegister(true);
    setError("");
  };

  // changes the loginInfo object as the user types in the fields
  const set = (keyProp) => {
    // if the user is registering
    if (register) {
      if (
        allUsers.filter((user) => user.email === loginInfo.email).length > 0
      ) {
        emailAvailable[0] = 1; // checks if the email the user wants to use already exists
      }
      if (
        allUsers.filter((user) => user.username === loginInfo.username).length >
        0
      ) {
        userAvailable[0] = 1; // checks if the username the user wants to use already exists
      }
      // PASSWORD VALIDATION
      if (loginInfo.password.length >= 8) {
        // 1. greater than 8 characters
        passwordValidity[0] = 1;
      }
      if (loginInfo.password.search(/[A-Z]/) !== -1) {
        // 2. contains at least 1 capital letter
        passwordValidity[1] = 1;
      }
      if (loginInfo.password.search(/[0-9]/) !== -1) {
        // 3. contains at least 1 number
        passwordValidity[2] = 1;
      }
      if (loginInfo.password === loginInfo.confirmPassword) {
        // 4. both password fields match
        passwordValidity[3] = 1;
      }
    }
    // sets input field values to the corresponding loginInfo object property
    return ({ target: { value } }) => {
      setLoginInfo((originalValues) => ({
        ...originalValues,
        [keyProp]: value,
      }));
    };
  };

  // when enter is clicked
  const submitInfo = async () => {
    // send the user typed info to the backend to validate
    const response = await fetch("http://localhost:4020/users/validate", {
      method: "POST",
      headers: {
        Accepted: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    });
    const data = await response.json();
    // if the user had a valid login
    const loggedIn = data.type === "success";
    setValidLogin(loggedIn);
    // if the user intended to login and NOT register
    if (login && !register) {
      // check if the username/email is correct
      if (
        allUsers.filter(
          (user) =>
            user.username === loginInfo.username ||
            user.email === loginInfo.username
        ).length === 0
      ) {
        setError("Wrong Username or Email");
      } else {
        // valid user login, hide login/register modal, hide error modal, grab the username of the user, send the user id to App.js
        if (loggedIn) {
          setShow(false);
          setShowError(false);
          setLoggedUser(
            allUsers.filter(
              (user) =>
                user.username === loginInfo.username ||
                user.email === loginInfo.username
            )
          );
          sendUserId(
            allUsers.filter(
              (user) =>
                user.username === loginInfo.username ||
                user.email === loginInfo.username
            )[0].id
          );
        } else {
          // invalid user login
          setError("Wrong Password");
        }
      }
    } else {
      // if register and NOT login
      // if EVERY password validation passed, reset error, redirect to login
      if (passwordValidity.every((val) => val === 1)) {
        setValidRegistration(true);
        // redirect to the login modal with the prefilled info from the register page
        loginModal();
        // post the new account to the users table in the backend
        const response = await fetch("http://localhost:4020/users/add", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginInfo.email,
            username: loginInfo.username,
            password: loginInfo.password,
          }),
        });
        await response.json();
        setError("");
      } else {
        // one or more password validation failed
        setError("Please check the requirements!");
      }
    }
  };

  return (
    <div className="header">
      <LoginError
        loginModal={loginModal}
        registerModal={registerModal}
        showError={showError}
        setShowError={setShowError}
      />
      {/* login/register modal */}
      {/* login/register modal */}
      <Modal
        contentClassName={
          login && !register ? "login-height" : "register-height"
        }
        size={login && !register ? "sm" : "md"}
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header className="user-modal">
          <Modal.Title>
            {login && !register ? "Login!" : "Register"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-modal user-modal-body">
          <form>
            {/* shows email field if the user wants to register */}
            {login && !register ? (
              <></>
            ) : (
              <>
                <label htmlFor="email">Email: </label> <br />
                <input
                  type="email"
                  id="email"
                  required
                  autoComplete="off"
                  value={loginInfo.email}
                  onChange={set("email")}
                />
                {/* real-time error to validate email is unique */}
                <p>
                  {emailAvailable[0] === 0
                    ? ""
                    : "This email is already registered to an account."}
                </p>
              </>
            )}
            <label htmlFor="username">
              {login && !register ? "Username/Email: " : "Username: "}
            </label>
            <br />
            <input
              type="text"
              id="username"
              required
              minLength={4}
              maxLength={22}
              autoComplete="off"
              value={loginInfo.username}
              onChange={set("username")}
            />
            {/* real-time error to validate username is unique*/}
            <p>{userAvailable[0] === 0 ? "" : "Username already taken."}</p>
            <label htmlFor="password">Password: </label> <br />
            <input
              type={viewPassword ? "text" : "password"}
              id="password"
              required
              minLength={8}
              maxLength={22}
              autoComplete="off"
              value={loginInfo.password}
              onChange={set("password")}
            />
            {/* allows user to see password as actual characters if hovered over */}
            <i
              className="fa fa-eye"
              aria-hidden="true"
              onMouseOver={() => setViewPassword(true)}
              onMouseLeave={() => setViewPassword(false)}
            ></i>
            {/* shows confirm password field if user wants to register */}
            {login && !register ? (
              <></>
            ) : (
              <>
                <br />
                <label htmlFor="confirm-password">Confirm Password:</label>
                <br />
                <input
                  type={viewPassword ? "text" : "password"}
                  id="confirm-password"
                  required
                  autoComplete="off"
                  value={loginInfo.confirmPassword}
                  onChange={set("confirmPassword")}
                />
                {/* allows user to see password as actual characters if hovered over */}
                <i
                  className="fa fa-eye"
                  aria-hidden="true"
                  onMouseOver={() => setViewPassword(true)}
                  onMouseLeave={() => setViewPassword(false)}
                ></i>
              </>
            )}
          </form>
          {/* displays real-time update of if the user satisfies the password requirements */}
          <div
            style={{ display: login && !register ? "none" : "block" }}
            className="pw-requirements"
          >
            <p>Password Requirements: </p>
            minimum 8 characters
            <svg viewBox="0 0 26 26" width="20px">
              {passwordValidity[0] === 0 ? (
                <>
                  <path className="ex" d="M 18 7 L 7 18"></path>
                  <path className="ex" d="M 7 7 L 18 18"></path>
                </>
              ) : (
                <path
                  className="checks"
                  d="M6.5 13.5L10 17 l8.808621-8.308621"
                />
              )}
            </svg>
            <br />
            at least one uppercase letter
            <svg viewBox="0 0 26 26" width="20px">
              {passwordValidity[1] === 0 ? (
                <>
                  <path className="ex" d="M 18 7 L 7 18"></path>
                  <path className="ex" d="M 7 7 L 18 18"></path>
                </>
              ) : (
                <path
                  className="checks"
                  d="M6.5 13.5L10 17 l8.808621-8.308621"
                />
              )}
            </svg>
            <br />
            at least one number
            <svg viewBox="0 0 26 26" width="20px">
              {passwordValidity[2] === 0 ? (
                <>
                  <path className="ex" d="M 18 7 L 7 18"></path>
                  <path className="ex" d="M 7 7 L 18 18"></path>
                </>
              ) : (
                <path
                  className="checks"
                  d="M6.5 13.5L10 17 l8.808621-8.308621"
                />
              )}
            </svg>
            <br />
            both passwords match
            <svg viewBox="0 0 26 26" width="20px">
              {passwordValidity[3] === 0 ? (
                <>
                  <path className="ex" d="M 18 7 L 7 18"></path>
                  <path className="ex" d="M 7 7 L 18 18"></path>
                </>
              ) : (
                <path
                  className="checks"
                  d="M6.5 13.5L10 17 l8.808621-8.308621"
                />
              )}
            </svg>
          </div>
        </Modal.Body>
        <Modal.Footer className="user-modal">
          {error}
          {/* redirects to register modal, resets loginInfo & error message*/}
          <button
            className="modal-button"
            variant="secondary"
            onClick={() => {
              setLoginInfo({
                username: "",
                password: "",
              });
              setRegister(true);
              setError("");
            }}
            style={{
              display: register ? "none" : "block",
            }}
          >
            Register
          </button>
          {/* submits the info */}
          <button
            variant="secondary"
            className="modal-button"
            onClick={submitInfo}
          >
            Enter
          </button>
        </Modal.Footer>
      </Modal>
      <Header
        loginModal={loginModal}
        registerModal={registerModal}
        loggedUser={loggedUser}
        validLogin={validLogin}
        setValidLogin={setValidLogin}
        setLoginInfo={setLoginInfo}
        setCurrentView={setCurrentView}
      />
    </div>
  );
};

export default LoginOrRegister;
