import { useState, useEffect } from "react";

const QuizCard = ({ selectedManga }) => {
  const [allAnswers, setAllAnswers] = useState([]);
  const [rightAnswer, setRightAnswer] = useState("");

  const getAnswers = async (category) => {
    const response = await fetch("http://localhost:4020/questions");
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    getAnswers();
  }, []);

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
  //   const items = ["hello", "my", "name", "is", "Linda"];
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
