import Modal from "react-bootstrap/Modal";

const LoginError = ({ loginModal, registerModal, showError, setShowError }) => {
  return (
    <>
      {/* error modal - can't access content if user is not logged in */}
      <Modal
        show={showError}
        onHide={() => setShowError(false)}
        size="sm"
        contentClassName="error-height"
      >
        <Modal.Header className="user-modal">
          <Modal.Title>Please login or register to continue!</Modal.Title>
        </Modal.Header>
        <Modal.Footer className="user-modal">
          {/* redirects to login or register modal */}
          <button onClick={loginModal} className="login-or-register">
            Login
          </button>
          <button onClick={registerModal} className="login-or-register">
            Register
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LoginError;
