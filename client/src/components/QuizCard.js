import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga }) => {
  const test = 0;
  const [allAnswers, setAllAnswers] = useState({
    years: [],
    authors: [],
    characters: [],
  });
  const [rightAnswers, setRightAnswers] = useState({
    year: "",
    author: "",
    character: "",
  });
  const [randomNum, setRandomNum] = useState(0);
  const [max, setMax] = useState(0);

  const getRandom = (max) => {
    const random = Math.floor(Math.random() * max);
    setRandomNum(random);
    return random;
  };

  const getAllAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
    setAllAnswers((otherAnswers) => ({
      ...otherAnswers,
      [category]: Array.from(new Set(data.map((manga) => manga[category]))),
    }));
  };

  const getRightAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
    getRandom(
      data.filter((manga) => manga.id === selectedManga.id)[0]["characters"]
        .length
    );
    setMax(
      data.filter((manga) => manga.id === selectedManga.id)[0]["characters"]
        .length
    );
    setRightAnswers((otherAnswers) => ({
      ...otherAnswers,
      [category]: data.filter((manga) => manga.id === selectedManga.id)[0][
        category
      ],
    }));
    setRightAnswers((otherAnswers) => ({
      ...otherAnswers,
      ["character"]: data.filter((manga) => manga.id === selectedManga.id)[0][
        "characters"
      ][
        getRandom(
          data.filter((manga) => manga.id === selectedManga.id)[0]["characters"]
            .length
        )
      ],
    }));
  };

  useEffect(() => {
    getAllAnswers("years");
    getAllAnswers("authors");
    getAllAnswers("characters");
    getRightAnswers("year");
    getRightAnswers("author");
    // getRightAnswers("character");
  }, [test]);

  const question1 = (
    <p>
      What year was <strong>{selectedManga.title}</strong> first serialized?
    </p>
  );
  const question2 = (
    <p>
      Who is the author of <strong>{selectedManga.title}</strong>?
    </p>
  );
  const question3 = (
    <p>
      Which of the following is not a character of{" "}
      <strong>{selectedManga.title}</strong>?
    </p>
  );
  const questions = [question1, question2, question3];
  const [currentQ, setCurrentQ] = useState(0);

  const prevItem = () => {
    setCurrentQ(currentQ - 1);
  };

  const nextItem = () => {
    setCurrentQ(currentQ + 1);
  };

  return (
    <div className="carousel">
      {questions[currentQ]}
      <button onClick={prevItem}>{"<"}</button>
      <button onClick={nextItem}>{">"}</button>
    </div>
  );
};

export default QuizCard;
