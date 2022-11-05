import { useState } from "react";
import Modal from "react-bootstrap/Modal";

const LoginOrRegister = ({ showLR, setShowLR, login, register }) => {
  const [loginInfo, setLoginInfo] = useState({
    // saves the user typed info for both login and registration
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // changes the loginInfo object as the user types in the fields
  const set = (keyProp) => {
    // sets input field values to the corresponding loginInfo object property
    return ({ target: { value } }) => {
      setLoginInfo((originalValues) => ({
        ...originalValues,
        [keyProp]: value,
      }));
    };
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
            }}
          >
            Register
          </button>
          {/* submits the info */}
          <button variant="secondary" className="modal-button">
            Enter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginOrRegister;
