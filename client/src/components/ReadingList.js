import { useState } from "react";
// eslint-disable-next-line
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";
// import DropdownList from "react-widgets/DropdownList";

const ReadingList = ({ userId }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState("");
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
        {/* <DropdownList
          placeholder="Status"
          data={["Just Started", "Halfway", "Almost Done"]}
        /> */}
      </form>
      <div
        className="reading-list-selection"
        style={{ display: selection === "" ? "none" : "block" }}
      >
        <h2>{`${selection.title} (${selection.year})`}</h2>
        <div style={{display: "flex", width: "1000px", padding: "0px 40px"}}>
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
            <div className="manga-description">
              <h5>
                <strong>Description: </strong>
                {selection.description}
              </h5>
            </div>
          </div>
        </div>
        <button className="modal-button">Add to Currently Reading</button>
      </div>
    </div>
  );
};

export default ReadingList;
