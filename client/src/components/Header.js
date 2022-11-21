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
  isLoading,
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
        {isLoading ? (
          <img
            style={{ width: "75px" }}
            src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/43a14ae7-38bd-4670-a62a-c0b84942569f/d9vbsdw-1c158bd1-e416-4e12-85a6-3658be0874c4.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQzYTE0YWU3LTM4YmQtNDY3MC1hNjJhLWMwYjg0OTQyNTY5ZlwvZDl2YnNkdy0xYzE1OGJkMS1lNDE2LTRlMTItODVhNi0zNjU4YmUwODc0YzQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.R6MCtC0Yy25VSbPQJo19QTkei0XOjq4iSQ8Ss0QCFX8"
            alt="loading"
          />
        ) : validLogin || isAuthenticated ? (
          <>
            <h4 className="welcome">
              Welcome,{" "}
              <span style={{ textDecoration: "underline" }}>
                {isAuthenticated
                  ? loggedUser.slice(0, loggedUser.indexOf("@"))
                  : loggedUser[0].username}
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
