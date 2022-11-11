import "./App.css";
import { useState } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";

function App() {
  const [currentView, setCurrentView] = useState("");
  const [showError, setShowError] = useState(false);
  const [validLogin, setValidLogin] = useState(false);
  const [userId, setUserId] = useState(0);
  const [admin, setAdmin] = useState(false);

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
        setAdmin={setAdmin}
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
                admin={admin}
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
