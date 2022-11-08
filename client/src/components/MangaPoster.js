import ScratchCard from "react-scratchcard";

import { useState, useEffect } from "react";
import MangaModal from "./MangaModal";

const MangaPoster = ({ userId }) => {
  const [allMangas, setAllMangas] = useState([]);
  const [readMangas, setReadMangas] = useState([]);
  const [selectedManga, setSelectedManga] = useState({});
  const [showModal, setShowModal] = useState(false);

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
  }, []);

  // removing the scratchcard jsx allows me to remount the div
  const renderCard = (manga) => {
    return (
      <div
        className="scratch-card"
        id={`card-${manga.id}`}
        style={{
          display: readMangas.includes(manga.id) ? "none" : "block",
        }}
      >
        <ScratchCard
          width={148}
          height={240}
          image={"https://i.ibb.co/H49kqG7/silver.png"}
          finishPercent={85}
          onComplete={() => console.log("complete")}
          // onComplete={() => sendManga([manga.id, !userRead.includes(manga.id)])}
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
            {/* {!reset ? renderCard(manga) : <></>} */}
            {renderCard(manga)}
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
