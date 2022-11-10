import "./App.css";
import { useState } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";

// Set a same-site cookie for first-party contexts
document.cookie = "cookie1=value1; SameSite=Lax";
// Set a cross-site cookie for third-party contexts
document.cookie = "cookie2=value2; SameSite=None; Secure";

function App() {
  const [currentView, setCurrentView] = useState("");
  const [showError, setShowError] = useState(false);
  const [validLogin, setValidLogin] = useState(false);
  const [userId, setUserId] = useState(0);

  const getUserId = (childData) => {
    setUserId(childData);
  };

  return (
    <div className="App">
      <LoginOrRegister
        setCurrentView={setCurrentView}
        validLogin={validLogin}
        setValidLogin={setValidLogin}
        showError={showError}
        setShowError={setShowError}
        sendUserId={getUserId}
      />
      {/* essentially a nav functionality using switch */}
      {(() => {
        switch (currentView) {
          case "":
            return (
              <Home
                validLogin={validLogin}
                setCurrentView={setCurrentView}
                setShowError={setShowError}
              />
            );
          case "poster":
            return <MangaPoster userId={userId} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
