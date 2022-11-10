import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga }) => {
  const [rightAnswers, setRightAnswers] = useState({
    year: "",
    author: "",
    characters: "",
  });

  const [wrongAnswers, setWrongAnswers] = useState({
    year: new Set(),
    author: new Set(),
    characters: new Set(),
  });

  const [allAnswers, setAllAnswers] = useState({
    year: [],
    author: [],
    characters: [],
  });

  const getRandom = (max) => {
    const random = Math.floor(Math.random() * max);
    return random;
  };

  const getRightAnswers = async (category) => {
    setRightAnswers((oldValues) => ({
      ...oldValues,
      [category]: selectedManga[category],
    }));
    if (category === "characters") {
      setRightAnswers((oldValues) => ({
        ...oldValues,
        [category]: selectedManga[category][
          getRandom(selectedManga[category].length)
        ]
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }));
    }
  };

  const getWrongAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
    const allAnswers = Array.from(
      new Set(
        data
          .filter((manga) => manga.id !== selectedManga.id)
          .map((manga) => manga[category])
          .flat()
      )
    );
    while (wrongAnswers[category].size < 3) {
      if (!wrongAnswers[category].has(selectedManga[category])) {
        wrongAnswers[category].add(
          allAnswers[getRandom(allAnswers.length)]
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );
      }
    }
    setWrongAnswers((oldValues) => ({
      ...oldValues,
      [category]: Array.from(wrongAnswers[category]),
    }));
  };

  const getAllAnswers = (category) => {
    if (wrongAnswers[category].length === 3) {
      const placeholder = wrongAnswers[category];
      placeholder.splice(1, 0, rightAnswers[category]);
      setAllAnswers((oldValues) => ({
        ...oldValues,
        [category]: placeholder,
      }));
    }
  };

  useEffect(() => {
    getRightAnswers("year");
    getRightAnswers("author");
    getRightAnswers("characters");
    getWrongAnswers("year");
    getWrongAnswers("author");
    getWrongAnswers("characters");
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getAllAnswers("year");
    getAllAnswers("author");
    getAllAnswers("characters");
    // eslint-disable-next-line
  }, [wrongAnswers]);

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
      {console.log(allAnswers)}
      <button onClick={prevItem}>{"<"}</button>
      <button onClick={nextItem}>{">"}</button>
    </div>
  );
};

export default QuizCard;
