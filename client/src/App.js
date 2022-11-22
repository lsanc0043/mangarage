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
  const [userId, setUserId] = useState(0);
  const [admin, setAdmin] = useState(false);
  const [readingList, setReadingList] = useState([]);
  const [allMangas, setAllMangas] = useState([]);

  const getUserId = (childData) => {
    setUserId(childData);
  };

  const getList = async () => {
    const response = await fetch(`/users/reading/${userId}`);
    // const response = await fetch("/users/reading/4");
    console.log(userId);
    const data = await response.json();
    console.log(data);
    setReadingList(data);
  };

  // retrieve all the mangas
  const getMangas = async () => {
    const response = await fetch("/manga");
    const data = await response.json();
    setAllMangas(data);
  };

  useEffect(() => {
    getList();
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
            return (
              <ReadingList
                readingList={readingList}
                getList={getList}
                userId={userId}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}

export default App;
