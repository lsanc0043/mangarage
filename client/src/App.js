import "./App.css";
import { useState } from "react";
import LoginOrRegister from "./components/LoginOrRegister";
import Home from "./components/Home";
import MangaPoster from "./components/MangaPoster";

function App() {
  const [currentView, setcurrentView] = useState("");

  return (
    <div className="App">
      <LoginOrRegister setcurrentView={setcurrentView} />
      {/* essentially a nav functionlity using switch */}
      {(() => {
        switch (currentView) {
          case "":
            return <Home />;
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
