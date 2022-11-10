const Header = ({
  loginModal,
  registerModal,
  loggedUser,
  validLogin,
  setValidLogin,
  setLoginInfo,
  setCurrentView,
  logout,
  isAuthenticated,
}) => {
  return (
    <>
      {/* header portion, returns to home page if the title is clicked */}
      <img
        src="https://i.ibb.co/djLYvqf/Site-Title.png"
        alt="Site-Title"
        className="title"
        onClick={() => setCurrentView("")}
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
        {validLogin || isAuthenticated ? (
          <>
            <h4 className="welcome">
              Welcome,{" "}
              <span style={{ textDecoration: "underline" }}>
                {isAuthenticated ? loggedUser : loggedUser[0].username}
              </span>
            </h4>
            <button
              className="login-or-register"
              onClick={() => {
                logout();
                setValidLogin(false);
                setCurrentView("");
                setLoginInfo({
                  email: "",
                  username: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
            >
              <i className="fa fa-sign-out"></i>
            </button>
          </>
        ) : (
          <>
            <button onClick={loginModal} className="login-or-register">
              Login
            </button>
            or
            <button onClick={registerModal} className="login-or-register">
              Register
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
