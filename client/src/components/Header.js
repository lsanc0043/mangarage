import { useState } from "react";
import LoginOrRegister from "./LoginOrRegister";

const Header = () => {
  const [showLR, setShowLR] = useState(false);
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  // if the user wants to login, show the modal, set modal to login, set register to false, reset error/hint message
  const loginModal = () => {
    setShowLR(true);
    setLogin(true);
    setRegister(false);
  };

  // if the user wants to register, show the modal, set login to false, set modal to register, reset error/hint message
  const registerModal = () => {
    setShowLR(true);
    setLogin(false);
    setRegister(true);
  };

  return (
    <div className="header">
      <LoginOrRegister
        showLR={showLR}
        setShowLR={setShowLR}
        login={login}
        register={register}
        setRegister={setRegister}
      />
      {/* header portion, returns to home page if the title is clicked */}
      <img
        src="https://i.ibb.co/djLYvqf/Site-Title.png"
        alt="Site-Title"
        className="title"
      />
      {/* displays the login and register buttons OR the welcome, user text with a logout button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "300px",
          alignItems: "center",
        }}
      >
        <button onClick={loginModal} className="login-or-register">
          Login
        </button>
        or
        <button onClick={registerModal} className="login-or-register">
          Register
        </button>
      </div>
    </div>
  );
};

export default Header;
