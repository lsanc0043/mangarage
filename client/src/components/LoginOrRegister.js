import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const LoginOrRegister = ({
  showLR,
  setShowLR,
  login,
  register,
  setRegister,
}) => {
  const [allUsers, setAllUsers] = useState([]); // list of all users
  const emailAvailable = [0]; // is the email available? [0] = false, [1] = true
  const userAvailable = [0]; // is the username available? [0] = false, [1] = true

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

  useEffect(() => {
    getUsers();
  }, []);

  // changes the loginInfo object as the user types in the fields
  const set = (keyProp) => {
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
    }
    // sets input field values to the corresponding loginInfo object property
    return ({ target: { value } }) => {
      setLoginInfo((originalValues) => ({
        ...originalValues,
        [keyProp]: value,
      }));
    };
  };

  const submitInfo = () => {
    console.log(loginInfo);
  };

  return (
    <>
      {/* login/register modal */}
      <Modal
        contentClassName={
          login && !register ? "login-height" : "register-height"
        }
        size={login && !register ? "sm" : "md"}
        show={showLR}
        onHide={() => setShowLR(false)}
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
              type="text"
              id="password"
              required
              minLength={8}
              maxLength={22}
              autoComplete="off"
              value={loginInfo.password}
              onChange={set("password")}
            />
            {/* shows confirm password field if user wants to register */}
            {login && !register ? (
              <></>
            ) : (
              <>
                <br />
                <label htmlFor="confirm-password">Confirm Password:</label>
                <br />
                <input
                  type="text"
                  id="confirm-password"
                  required
                  autoComplete="off"
                  value={loginInfo.confirmPassword}
                  onChange={set("confirmPassword")}
                />
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer className="user-modal">
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
            }}
            style={{
              display: register ? "none" : "block",
            }}
          >
            Register
          </button>
          <button
            variant="secondary"
            className="modal-button"
            onClick={submitInfo}
          >
            Enter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginOrRegister;
