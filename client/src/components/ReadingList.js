import { useState } from "react";
// eslint-disable-next-line
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";

const ReadingList = ({ userId }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState("");
  const [status, setStatus] = useState("");

  const searchManga = async (e) => {
    const search = e;
    if (search[0] !== " " && search !== "") {
      const response = await fetch(`/manga/post/${search}`);
      const data = await response.json();
      setSearchResults(data);
    }
  };

  const obtainMangaInfo = async (e) => {
    const response = await fetch(`/manga/select/${e}`);
    const data = await response.json();
    console.log(data[0]);
    setSelection(data[0]);
  };

  const addToList = async () => {
    const response = await fetch(`/users/reading/${userId}`, {
      method: "POST",
      headers: {
        Accepted: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selection.id,
        status: status,
      }),
    });
    await response.json();
  };

  return (
    <div className="reading-list">
      <form>
        <Combobox
          hideCaret
          hideEmptyPopup
          filter="contains"
          defaultValue=""
          data={searchResults}
          onChange={searchManga}
          onSelect={obtainMangaInfo}
        />
      </form>
      <div
        className="reading-list-selection"
        style={{ display: selection === "" ? "none" : "flex" }}
      >
        <h2>{`${selection.title} (${selection.year})`}</h2>
        <div style={{ display: "flex", width: "1000px", padding: "15px 40px" }}>
          <img
            className="modal-cover"
            src={selection.cover}
            alt={`${selection.title} cover`}
          />
          {/* other manga content: author, status, genres, description */}
          <div className="manga-info">
            <h5>
              <strong>Author: </strong>
              <span>{selection.author}</span>
            </h5>
            <h5>
              <strong>Status: </strong>
              {selection.status
                ? selection.status.slice(0, 1).toUpperCase() +
                  selection.status.slice(1)
                : ""}
            </h5>
            <h5>
              <strong>Genres: </strong>
              {selection.genres ? selection.genres.slice(0, 5).join(", ") : ""}
            </h5>
            {/* scrollable description */}
            <h5 className="manga-description" style={{ width: "700px" }}>
              <strong>Description: </strong>
              {selection.description
                ? selection.description.slice(
                    0,
                    selection.description.indexOf("---")
                  )
                : ""}
            </h5>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "500px",
          }}
        >
          <DropdownList
            placeholder="Status"
            data={["Just Started", "Halfway", "Almost Done"]}
            onSelect={(e) => setStatus(e)}
          />
          <button
            className="modal-button"
            onClick={addToList}
            style={{ width: "1000px" }}
          >
            Add to Currently Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingList;
