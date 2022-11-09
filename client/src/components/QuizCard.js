import { useState } from "react";

const QuizCard = () => {
  const question1 = (
    <p>
      What year was <strong>Insert Title</strong> first serialized?
    </p>
  );
  const question2 = (
    <p>
      Who is the author of <strong>Insert Title</strong>?
    </p>
  );
  const question3 = (
    <p>
      Which of the following is not a character of <strong>Insert Title</strong>
      ?
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
