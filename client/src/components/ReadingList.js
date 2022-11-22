import { useEffect, useState } from "react";
// eslint-disable-next-line
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";
const tables = ["Will Read", "Currently Reading", "Completed"];

const ReadingList = ({ userId, readingList }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState("");
  const [imageURL, setImageURL] = useState("");

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
    setSelection(data[0]);
    setImageURL(
      `${process.env.REACT_APP_HOST_DOMAIN}${data[0].cover.slice(20)}`
    );
  };

  const addToList = async () => {
    setCurrentPage("");
    setSelection("");
    const response = await fetch(`/users/reading/${userId}`, {
      method: "POST",
      headers: {
        Accepted: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selection.id,
        title: selection.title,
        status: status,
      }),
    });
    await response.json();
  };

  const renderReadingList = () => {
    return (
      <>
        <button
          onClick={() => setCurrentPage("add")}
          className="login-or-register"
        >
          Add To List
        </button>
        <div className="all-tables">
          {tables.map((tableName, index) => {
            return (
              <div key={index}>
                <h3>{tableName}</h3>
                <table
                  className={`table ${tableName
                    .toLowerCase()
                    .split(" ")
                    .join("-")}`}
                >
                  <thead>
                    <tr>
                      <th>Title</th>
                      {tableName === "Currently Reading" ? (
                        <th>Status</th>
                      ) : tableName === "Completed" ? (
                        <th>Rating</th>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(readingList.filter((manga) => manga.status = tableName))} */}
                    {readingList.map((manga) => {
                      if (manga.status === tableName) {
                        return (
                          <tr key={manga.id}>
                            <td>{manga.manga_name}</td>
                            {tableName === "Currently Reading" ? (
                              <td>{manga.status}</td>
                            ) : tableName === "Completed" ? (
                              <td>Rating</td>
                            ) : (
                              <></>
                            )}
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderForm = () => {
    return (
      <>
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
        <img id="test-cover" />
        <div
          className="reading-list-selection"
          style={{ display: selection === "" ? "none" : "flex" }}
        >
          <h2>{`${selection.title} (${selection.year})`}</h2>
          <div
            style={{ display: "flex", width: "1000px", padding: "15px 40px" }}
          >
            <img
              className="modal-cover"
              // src={selection.cover}
              src={imageURL}
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
                {selection.genres
                  ? selection.genres.slice(0, 5).join(", ")
                  : ""}
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
              data={["Will Read", "Currently Reading", "Completed"]}
              onSelect={(e) => setStatus(e)}
            />
            {status === "Currently Reading" ? (
              <DropdownList
                placeholder="Status"
                data={["Just Started", "Halfway", "Almost Done"]}
                onSelect={(e) => setStatus(e)}
              />
            ) : status === "Completed" ? (
              <form>
                <span style={{ fontSize: "18px" }}>
                  <strong>Rating: </strong>
                  <input
                    type="number"
                    max="10"
                    style={{ width: "30px" }}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                  <strong>/10</strong>
                </span>
              </form>
            ) : (
              <></>
            )}
            <button
              className="modal-button"
              onClick={addToList}
              style={{ width: "1000px" }}
            >
              {`Add to ${status}`}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="reading-list">
      {/* <h1>Your Reading List</h1> */}
      {currentPage === "" ? renderReadingList() : renderForm()}
    </div>
  );
};

export default ReadingList;
