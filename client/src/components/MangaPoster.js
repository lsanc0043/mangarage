import { useState, useEffect } from "react";

const MangaPoster = () => {
  const [allMangas, setAllMangas] = useState([]);

  // retrieve all the mangas
  const getMangas = async () => {
    const response = await fetch("http://localhost:4020/manga");
    const data = await response.json();
    setAllMangas(data);
  };

  useEffect(() => {
    getMangas();
  }, []);

  return (
    <div className="container">
      {/* map all mangas */}
      {allMangas.map((manga, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              console.log(manga.id);
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
