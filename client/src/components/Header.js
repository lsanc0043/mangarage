const Header = () => {
  return (
    <div className="header">
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
        <button className="login-or-register">Login</button>
        or
        <button className="login-or-register">Register</button>
      </div>
    </div>
  );
};

export default Header;
