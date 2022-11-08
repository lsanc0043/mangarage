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
    setReadMangas(data);
  };

  useEffect(() => {
    getMangas();
    getReadMangas();
  }, []);

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
            }}
            className="manga-selection"
          >
            <div>
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
