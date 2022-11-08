import "./App.css";
import { useState } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";

function App() {
  const [currentView, setCurrentView] = useState("");
  const [showError, setShowError] = useState(false);
  const [validLogin, setValidLogin] = useState(false);

  return (
    <div className="App">
      <LoginOrRegister
        setCurrentView={setCurrentView}
        validLogin={validLogin}
        setValidLogin={setValidLogin}
        showError={showError}
        setShowError={setShowError}
      />
      {/* essentially a nav functionlity using switch */}
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
            return <MangaPoster />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
