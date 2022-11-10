import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga, completeQuiz }) => {
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
  const [resetCount, setResetCount] = useState(0);

  function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

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
        [category]: decodeHtml(
          selectedManga[category][getRandom(selectedManga[category].length)]
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        ),
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
          decodeHtml(
            allAnswers[getRandom(allAnswers.length)]
              .toLowerCase()
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          )
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
  }, [resetCount]);

  useEffect(() => {
    getAllAnswers("year");
    getAllAnswers("author");
    getAllAnswers("characters");
    // eslint-disable-next-line
  }, [wrongAnswers, resetCount]);

  const restart = () => {
    setWrongAnswers({
      year: new Set(),
      author: new Set(),
      characters: new Set(),
    });
    setAllAnswers({
      year: [],
      author: [],
      characters: [],
    });
    setScore(0);
    setResetCount(resetCount + 1);
  };

  const intro = (
    <>
      So you've read <strong>{selectedManga.title}</strong>, huh?
    </>
  );
  const question1 = (
    <>
      What year was <strong>{selectedManga.title}</strong> first serialized?
    </>
  );
  const question2 = (
    <>
      Who is the author of <strong>{selectedManga.title}</strong>?
    </>
  );
  const question3 = (
    <>
      Which of the following is a character of{" "}
      <strong>{selectedManga.title}</strong>?
    </>
  );
  const ending = (
    <>
      {score === 3 ? (
        "Congratulations!"
      ) : (
        <>
          I guess you didn't know <strong>{selectedManga.title}</strong> as well
          as you thought.
        </>
      )}
    </>
  );
  const questions = [intro, question1, question2, question3, ending];
  const [currentQ, setCurrentQ] = useState(0);

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

  return (
    <div className="quiz">
      <h2>{questions[currentQ]}</h2>
      <h5
        style={{ display: currentQ >= 1 && currentQ <= 3 ? "block" : "none" }}
      >
        Question {currentQ}/3
      </h5>

      <div className="questions">
        {(() => {
          switch (currentQ) {
            case 0:
              return (
                <>
                  <br /> <br /> <br />
                  <h4>Surely you can answer this quick quiz then!</h4> <br />
                  <button className="modal-button" onClick={nextItem}>
                    <strong>Start</strong>
                  </button>
                  <br /> <br />
                  <h6>Note: you must get all of them correct!</h6>
                </>
              );
            case 1:
              return allAnswers.year.map((answer) => {
                return (
                  <button
                    key={answer}
                    className="answer-button"
                    onClick={() => checkAnswer(answer, "year")}
                  >
                    {answer}
                  </button>
                );
              });
            case 2:
              return allAnswers.author.map((answer) => {
                return (
                  <button
                    className="answer-button"
                    key={answer}
                    onClick={() => checkAnswer(answer, "author")}
                  >
                    {answer}
                  </button>
                );
              });
            case 3:
              return allAnswers.characters.map((answer) => {
                return (
                  <button
                    className="answer-button"
                    key={answer}
                    onClick={() => checkAnswer(answer, "characters")}
                  >
                    {answer}
                  </button>
                );
              });
            default:
              return score === 3 ? (
                completeQuiz(selectedManga.id)
              ) : (
                <>
                  <br /> <br /> <br />
                  <button
                    className="modal-button"
                    onClick={() => {
                      setCurrentQ(1);
                      restart();
                    }}
                  >
                    <strong>Restart</strong>
                  </button>
                  <br /> <br />
                </>
              );
          }
        })()}
      </div>
    </div>
  );
};

export default QuizCard;
