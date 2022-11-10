import ScratchCard from "react-scratchcard";

import { useState, useEffect } from "react";
import MangaModal from "./MangaModal";

const MangaPoster = ({ userId }) => {
  const [allMangas, setAllMangas] = useState([]);
  const [readMangas, setReadMangas] = useState([]);
  const [selectedManga, setSelectedManga] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reset, setReset] = useState(false);
  const [complete, setComplete] = useState(0);

  const getComplete = (childData) => {
    setComplete(childData);
  };

  const onClickReset = () => {
    setReset(true);
    setComplete(0);
  };

  // dismounts the scratchcard and remounts it after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setReset(false), 1);
    return () => clearTimeout(timer);
  }, [reset]);

  // retrieve all the mangas
  const getMangas = async () => {
    const response = await fetch("http://localhost:4020/manga");
    const data = await response.json();
    setAllMangas(data);
  };

  // retrieve the read mangas
  const getReadMangas = async () => {
    const response = await fetch(`http://localhost:4020/users/read/${userId}`);
    const data = await response.json();
    setReadMangas(data.map((value) => value.manga_id));
  };

  useEffect(() => {
    getMangas();
    getReadMangas();
    // eslint-disable-next-line
  }, []);

  const markReadOrUnread = async (selectedId, doneReading) => {
    const read = { user: userId, manga: selectedId, rating: 10 }; // object that saves the user id, manga id, and the rating
    // if the user is done reading the manga, post it to the backend
    if (doneReading) {
      const response = await fetch("http://localhost:4020/users/read", {
        method: "POST",
        headers: {
          Accepted: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(read),
      });
      const data = await response.json();
      // if the post is valid (meaning the user is not trying to read a manga that's already marked as read)
      if (data.type === "success") {
        // refresh MangaPoster to load the data in real time
        getMangas();
        getReadMangas();
      }
    } else {
      // delete the manga from the junction table if the user wants to mark it as unread
      const response = await fetch(
        `http://localhost:4020/users/read/${userId}/${selectedId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      // if the delete is valid
      if (data.type === "success") {
        // refresh MangaPoster to load the data in real time
        getMangas();
        getReadMangas();
        onClickReset(); // reset the scratch card so user can "mark as read" again
      }
    }
  };

  // removing the scratchcard jsx allows me to remount the div
  const renderCard = (manga) => {
    return (
      <div
        className={complete === manga.id ? "scratch-card" : ""}
        id={`card-${manga.id}`}
        style={{
          display: readMangas.includes(manga.id) ? "none" : "block",
          pointerEvents: complete === manga.id ? "" : "none",
        }}
      >
        <ScratchCard
          width={148}
          height={240}
          image={"https://i.ibb.co/H49kqG7/silver.png"}
          finishPercent={85}
          onComplete={() =>
            markReadOrUnread(manga.id, !readMangas.includes(manga.id))
          }
        >
          <img
            className="covers"
            src={manga.cover}
            alt={`${manga.title} cover`}
          />
        </ScratchCard>
      </div>
    );
  };

  return (
    <div className="container">
      <MangaModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedManga={selectedManga}
        readMangas={readMangas}
        markReadOrUnread={markReadOrUnread}
        complete={complete}
        getComplete={getComplete}
      />
      {/* map all mangas */}
      {allMangas.map((manga, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              setSelectedManga(manga);
              setShowModal(true);
              console.log(manga.id);
            }}
            className="manga-selection"
          >
            {/* unmount and remount if the user marks it as unread so content can be scratched again */}
            {!reset ? renderCard(manga) : <></>}
            {/* {renderCard(manga)} */}
            {/* underlies the scratchcard, revealed when scratchcard is completed */}
            <div
              style={{
                display: readMangas.includes(manga.id) ? "block" : "none",
              }}
            >
              <img
                className="covers"
                src={manga.cover}
                alt={`${manga.title} cover`}
              />
            </div>
            <p className="titles">
              <strong>{manga.title}</strong>
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default MangaPoster;
