import "./App.css";
import { useState, useEffect } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";
import ReadingList from "./components/ReadingList";

function App() {
  const [currentView, setCurrentView] = useState("reading-list");
  const [showError, setShowError] = useState(false);
  const [validLogin, setValidLogin] = useState(false);
  const [userId, setUserId] = useState(2);
  const [admin, setAdmin] = useState(false);
  const [allMangas, setAllMangas] = useState([]);

  const getUserId = (childData) => {
    setUserId(childData);
  };

  // retrieve all the mangas
  const getMangas = async () => {
    const response = await fetch("/manga");
    const data = await response.json();
    setAllMangas(data);
  };

  useEffect(() => {
    getMangas();
  }, [userId]);

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
            return (
              <MangaPoster
                allMangas={allMangas}
                getMangas={getMangas}
                userId={userId}
              />
            );
          case "reading-list":
            return <ReadingList userId={userId} />;
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
