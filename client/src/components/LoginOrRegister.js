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
        show={showLR}
        onHide={() => setShowLR(false)}
        size="sm"
        contentClassName={
          login && !register ? "login-height" : "register-height"
        }
      >
        <Modal.Header className="user-modal">
          <Modal.Title>Login or Register</Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-modal user-modal-body">
          <form>
            <label htmlFor="username">Username:</label>
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
