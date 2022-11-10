import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga, sendScore }) => {
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

  const [score, setScore] = useState(0);

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
      } else {
        wrongAnswers[category].delete(selectedManga[category]);
      }
    }
    setWrongAnswers((oldValues) => ({
      ...oldValues,
      [category]: Array.from(wrongAnswers[category]),
    }));
  };

  const getAllAnswers = (category) => {
    console.log(getRandom(3));
    if (wrongAnswers[category].length === 3) {
      const placeholder = wrongAnswers[category];
      placeholder.splice(getRandom(3), 0, rightAnswers[category]);
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
      Which of the following is a character of{" "}
      <strong>{selectedManga.title}</strong>?
    </p>
  );
  const questions = [question1, question2, question3];
  const [currentQ, setCurrentQ] = useState(0);

  const prevItem = () => {
    setCurrentQ(currentQ - 1);
  };

  const nextItem = () => {
    if (currentQ < questions.length) {
      setCurrentQ(currentQ + 1);
    }
  };

  const checkAnswer = (answer, category) => {
    if (answer === rightAnswers[category]) {
      setScore(score + 1);
    }
    nextItem();
  };

  useEffect(() => {
    sendScore(score);
  }, [score]);

  return (
    <div>
      {questions[currentQ]}
      {(() => {
        switch (currentQ) {
          case 0:
            return allAnswers.year.map((answer) => {
              return (
                <button
                  key={answer}
                  onClick={() => checkAnswer(answer, "year")}
                >
                  {answer}
                </button>
              );
            });
          case 1:
            return allAnswers.author.map((answer) => {
              return (
                <button
                  key={answer}
                  onClick={() => checkAnswer(answer, "author")}
                >
                  {answer}
                </button>
              );
            });
          case 2:
            return allAnswers.characters.map((answer) => {
              return (
                <button
                  key={answer}
                  onClick={() => checkAnswer(answer, "characters")}
                >
                  {answer}
                </button>
              );
            });
          default:
            return <button>Restart</button>;
        }
      })()}
    </div>
  );
};

export default QuizCard;
