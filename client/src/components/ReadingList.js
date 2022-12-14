import { useEffect, useState } from "react";
// eslint-disable-next-line
import "react-widgets/styles.css";
import Combobox from "react-widgets/Combobox";
import DropdownList from "react-widgets/DropdownList";
import Draggable from "react-draggable";
const tables = ["Will Read", "Currently Reading", "Completed"];

const ReadingList = ({ userId }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState("");
  const [status, setStatus] = useState("");
  const [readingStatus, setReadingStatus] = useState("");
  const [rating, setRating] = useState("");
  const [editRating, setEditRating] = useState({});
  const [currentPage, setCurrentPage] = useState("");
  const [readingList, setReadingList] = useState([]);
  const [editId, setEditId] = useState(0);
  const [dragInfo, setDragInfo] = useState({
    name: "",
    parent: "",
    newParent: "",
  });
  const [editArray, setEditArray] = useState([]);
  const [moveId, setMoveId] = useState(0);
  const [message, setMessage] = useState("");

  const searchManga = async (e) => {
    if (e[0] !== " " && e !== "") {
      const response = await fetch(`/manga/post/${e}`);
      const data = await response.json();
      setSearchResults(data);
    }
  };

  const getList = async () => {
    const response = await fetch(`/users/reading/${userId}`);
    const data = await response.json();
    setReadingList(data);
  };

  const obtainMangaInfo = async (e) => {
    setMessage("");

    const response = await fetch(`/manga/select/${e}`);
    const data = await response.json();
    setSelection(data[0]);
    const checkExists = readingList.filter(
      (manga) => manga.manga_name === data[0].title
    );
    console.log(
      readingList.filter((manga) => manga.manga_name === data[0].title)[0]
        .status[0]
    );
    if (checkExists.length > 0) {
      setMessage(
        `${checkExists[0].manga_name} is already in your ${checkExists[0].status[0]} list.`
      );
    }
  };

  const addToList = async () => {
    setCurrentPage("");
    setSelection("");
    getList();
    setStatus("");
    setReadingStatus("");
    const response = await fetch(`/users/reading/${userId}`, {
      method: "POST",
      headers: {
        Accepted: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selection.id,
        title: selection.title,
        status: [status, readingStatus],
        rating: rating,
      }),
    });
    await response.json();
  };

  const deleteItem = async (itemId) => {
    getList();
    const response = await fetch(`/users/reading/${userId}/${itemId}`, {
      method: "DELETE",
    });
    await response.json();
  };

  useEffect(() => {
    getList();
  }, [readingList]);

  const handleUp = (e) => {
    getList();

    setDragInfo((oldValues) => ({ ...oldValues, name: e.target.innerText }));
    if (
      readingList.filter((manga) => manga.manga_name === e.target.innerText)
        .length > 0
    ) {
      setDragInfo((oldValues) => ({
        ...oldValues,
        parent: readingList.filter(
          (manga) => manga.manga_name === e.target.innerText
        )[0].status[0],
      }));
    }
  };

  const handleDrag = async (e) => {
    if (
      readingList.filter((manga) => manga.manga_name === e.target.innerText)
        .length > 0
    ) {
      setMoveId(
        readingList.filter(
          (manga) => manga.manga_name === e.target.innerText
        )[0].id
      );
    }
    console.log(e);
    let newParent = "";
    if (e.x < 525) {
      newParent = "Will Read";
    } else if (e.x > 1000) {
      newParent = "Completed";
    } else {
      newParent = "Currently Reading";
    }
    console.log({
      name: dragInfo.name,
      parent: dragInfo.parent,
      newParent: newParent,
    });
    const response = await fetch(
      `/users/reading/${userId}/${e.target.innerText}`,
      {
        method: "PUT",
        headers: {
          Accepted: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: dragInfo.name,
          parent: dragInfo.parent,
          newParent: [newParent, ""],
        }),
      }
    );
    await response.json();
  };

  const handleEdit = (e, manga_id) => {
    editArray.push({ [manga_id]: e });
    console.log(e, manga_id);
  };

  const handleDone = (changedItem) => {
    setEditId(0);
    // console.log(editArray.map((val) => Object.values(val)));
    getList();
    if (changedItem === "status") {
      editArray
        .map((val) => Object.keys(val))
        .map(async (editItem, index) => {
          const response = await fetch(`/users/reading/${userId}/${editItem}`, {
            method: "PUT",
            headers: {
              Accepted: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: editArray.map((val) => Object.values(val)[0])[index],
            }),
          });
          await response.json();
        });
    }
    if (changedItem === "rating") {
      Object.keys(editRating).map(async (editItem, index) => {
        const response = await fetch(`/users/reading/${userId}/${editItem}`, {
          method: "PUT",
          headers: {
            Accepted: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: Object.values(editRating)[index],
          }),
        });
        await response.json();
      });
    }

    setEditArray([]);
    setEditRating([]);
    setMoveId(0);
  };

  const renderReadingList = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100vw",
            marginRight: "40px",
          }}
        >
          <button
            onClick={() => setCurrentPage("add")}
            className="login-or-register"
          >
            Add To List
          </button>
        </div>
        <div className="all-tables">
          {tables.map((tableName, index) => {
            return (
              <div key={index} className="manga-list">
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
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(readingList.filter((manga) => manga.status = tableName))} */}
                    {readingList.map((manga) => {
                      if (manga.status[0] === tableName) {
                        return (
                          <Draggable
                            grid={[460, 50]}
                            onStop={handleDrag}
                            key={manga.id}
                            onMouseDown={handleUp}
                            disabled={moveId === manga.id ? true : false}
                          >
                            <tr
                              className={
                                moveId === manga.id ? "" : "drag-manga"
                              }
                            >
                              <td>{manga.manga_name}</td>
                              {tableName === "Currently Reading" ? (
                                <td>
                                  {editId === manga.id ||
                                  moveId === manga.id ? (
                                    <>
                                      <DropdownList
                                        placeholder={manga.status[1]}
                                        data={[
                                          "Just Started",
                                          "Halfway",
                                          "Almost Done",
                                        ]}
                                        onSelect={(e) => {
                                          handleEdit(e, manga.id);
                                          handleDone("status");
                                        }}
                                      />
                                    </>
                                  ) : (
                                    manga.status[1]
                                  )}
                                  <button
                                    style={{
                                      display:
                                        editId === manga.id ||
                                        moveId === manga.id
                                          ? "none"
                                          : "inline",
                                      border: "none",
                                      background: "none",
                                    }}
                                    onClick={() => setEditId(manga.id)}
                                  >
                                    <i
                                      style={{ color: "#EBEBEB" }}
                                      className="fa fa-pencil"
                                    ></i>
                                  </button>
                                </td>
                              ) : tableName === "Completed" ? (
                                <td>
                                  {editId === manga.id ||
                                  moveId === manga.id ? (
                                    <>
                                      <form>
                                        <span style={{ fontSize: "18px" }}>
                                          <input
                                            type="number"
                                            max="10"
                                            style={{ width: "30px" }}
                                            placeholder={
                                              moveId === manga.id
                                                ? ""
                                                : manga.rating
                                            }
                                            value={
                                              editRating[manga.id]
                                                ? editRating[manga.id]
                                                : ""
                                            }
                                            onChange={(e) => {
                                              setEditRating((oldValues) => ({
                                                ...oldValues,
                                                [manga.id]: e.target.value,
                                              }));
                                            }}
                                          />
                                        </span>
                                        /10
                                        <button
                                          style={{
                                            border: "none",
                                            background: "none",
                                          }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            handleDone("rating");
                                          }}
                                        >
                                          <i
                                            className="fa fa-check"
                                            style={{ color: "#EBEBEB" }}
                                          ></i>
                                        </button>
                                      </form>
                                    </>
                                  ) : (
                                    `${manga.rating}/10`
                                  )}
                                  <button
                                    style={{
                                      display:
                                        editId === manga.id ||
                                        moveId === manga.id
                                          ? "none"
                                          : "inline",
                                      border: "none",
                                      background: "none",
                                    }}
                                    onClick={() => setEditId(manga.id)}
                                  >
                                    <i
                                      style={{ color: "#EBEBEB" }}
                                      className="fa fa-pencil"
                                    ></i>
                                  </button>
                                </td>
                              ) : (
                                <></>
                              )}
                              <td>
                                <button
                                  style={{
                                    border: "none",
                                    background: "none",
                                  }}
                                  onClick={() => deleteItem(manga.id)}
                                >
                                  <i
                                    className="fa fa-trash"
                                    style={{ color: "#EBEBEB" }}
                                  ></i>
                                </button>
                              </td>
                            </tr>
                          </Draggable>
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100vw",
            marginRight: "40px",
          }}
        >
          <button
            onClick={() => setCurrentPage("")}
            className="login-or-register"
          >
          x
          </button>
        </div>
        <div
          style={{
            margin: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form style={{ display: "flex", alignItems: "center" }}>
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
          {message}
          <div
            className="reading-list-selection"
            style={{ display: selection === "" ? "none" : "flex" }}
          >
            <div>
              <h2>{`${selection.title} (${selection.year})`}</h2>
              <div
                style={{
                  display: "flex",
                  width: "1000px",
                  padding: "15px 40px",
                }}
              >
                <img
                  id={`cover-image-${selection.id}`}
                  className="modal-cover"
                  src={`/manga/${selection.id}/${selection.cover}`}
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
            </div>
            <div
              style={{
                display: message !== "" ? "none" : "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "800px",
              }}
            >
              <DropdownList
                style={{ padding: "10px" }}
                placeholder="Status"
                data={["Will Read", "Currently Reading", "Completed"]}
                onSelect={(e) => setStatus(e)}
              />
              {status === "Currently Reading" ? (
                <DropdownList
                  placeholder="Status"
                  data={["Just Started", "Halfway", "Almost Done"]}
                  onSelect={(e) => setReadingStatus(e)}
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
                style={{ width: "400px", fontSize: "16px" }}
              >
                {`Add to ${status}`}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="reading-list">
      {currentPage === "" ? renderReadingList() : renderForm()}
    </div>
  );
};

export default ReadingList;
