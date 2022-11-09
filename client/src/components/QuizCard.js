import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga }) => {
  const test = 0;
  const [otherAnswers, setOtherAnswers] = useState({
    year: [],
    author: [],
    characters: [],
  });
  const [rightAnswers, setRightAnswers] = useState({
    year: "",
    author: "",
    character: "",
  });

  const getRandom = (max) => {
    const random = Math.floor(Math.random() * max);
    return random;
  };

  const getAllOtherAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
    setOtherAnswers((otherAnswers) => ({
      ...otherAnswers,
      [category]: Array.from(
        new Set(
          data
            .filter((manga) => manga.id !== selectedManga.id)
            .map((manga) => manga[category])
            .flat()
        )
      ),
    }));
  };

  const getRightAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
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
    getAllOtherAnswers("year");
    getAllOtherAnswers("author");
    getAllOtherAnswers("characters");
    getRightAnswers("year");
    getRightAnswers("author");
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
      {console.log(otherAnswers)}
      {console.log(rightAnswers)}
      <button onClick={prevItem}>{"<"}</button>
      <button onClick={nextItem}>{">"}</button>
    </div>
  );
};

export default QuizCard;
