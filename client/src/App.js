import "./App.css";
import { useState } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";

function App() {
  const [currentView, setcurrentView] = useState("");
  const [showError, setShowError] = useState(false);
  const [validLogin, setValidLogin] = useState(false);

  return (
    <div className="App">
      <LoginOrRegister
        setcurrentView={setcurrentView}
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
                setCurrentView={setcurrentView}
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
