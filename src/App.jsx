import clicksound from "./assets/mouse-click.mp3";
import rightsound from "./assets/correct.mp3";
import { useState, useEffect } from "react";
import wrongsound from "./assets/wrong.mp3";
import bgImage from "./assets/5924401.jpg";
import "./App.css";
function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(900);
  const [score, setScore] = useState(0);
  useEffect(() => {
    async function getdata() {
      try {
        const response = await fetch(
          "https://thingproxy.freeboard.io/fetch/https://api.jsonserve.com/Uw5CrX"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const shuffledQuestions = data.questions.sort(
          () => Math.random() - 0.5
        );
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    }
    if (startQuiz) getdata();
  }, [startQuiz]);
  useEffect(() => {
    if (startQuiz) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startQuiz]);
  useEffect(() => {
    if (!timerStarted && questions.length > 0) {
      setTimerStarted(true);
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 60 ? prev - 1 : 60));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [questions]);
  const handleAnswerClick = (index) => {
    if (selectedOption === null) {
      setSelectedOption(index);
      const correctAnswer =
        questions[currentQuestionIndex].options[index].is_correct;
      const sound = new Audio(correctAnswer ? rightsound : wrongsound);
      sound.play();
      if (correctAnswer) setScore(score + 4);
      else setScore(score - 1);
    }
  };
  const nextQuestion = () => {
    if (selectedOption !== null) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else setShowScore(true);
    }
  };
  return (
    <div
      className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 min-h-screen flex items-center justify-center min-w-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-1 sm:p-6 border-4 border-emerald-500 w-full sm:w-96 sm:mx-0 mx-6 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] text-center">
        <div className="text-right sm:mb-2 mb-1 text-xl font-bold text-green-500">
          {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
        </div>
        {!startQuiz ? (
          <div>
            <div className="sm:text-5xl text-xl font-bold text-black">
              Welcome to the Quiz!
            </div>
            <p className="text-lg text-gray-600 mt-1 sm:mt-6">
              Are you ready to test your knowledge?
            </p>
            <button
              onClick={() => {
                let sound = new Audio(clicksound);
                sound.playbackRate = 2;
                sound.play();
                setStartQuiz(true);
              }}
              className=" bg-black text-white py-2 px-6 rounded-lg text-lg hover:bg-gray-800 my-1 sm:my-6 transition"
            >
              Start Quiz
            </button>
          </div>
        ) : countdown > 0 ? (
          <div className="text-4xl font-bold text-gray-800">{countdown}</div>
        ) : showScore ? (
          <div>
            <div className="sm:text-4xl text-xl font-bold text-black">
              Quiz Completed!
            </div>
            <div className="sm:text-2xl text-xl text-gray-700 mt-3">
              Your Final Score:{" "}
              <span className="font-bold text-green-500">{score}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-2 bg-black text-white font-black text-2xl my-2"
            >
              Reset
            </button>
          </div>
        ) : error ? (
          <div className="text-xl font-bold text-red-600">
            Server Error! Please try again later.
          </div>
        ) : questions.length > 0 ? (
          <div>
            <p className=" text-sm sm:text-lg text-black font-semibold mb-4">
              {questions[currentQuestionIndex].description}
            </p>
            <div className="space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  className={`border p-1 mx-2 sm:p-3 rounded-lg flex items-center cursor-pointer transition border-gray-300 ${
                    selectedOption !== null &&
                    (option.is_correct
                      ? "bg-green-500 text-white"
                      : index === selectedOption
                      ? "bg-red-500 text-white"
                      : "")
                  }`}
                  onClick={() => handleAnswerClick(index)}
                >
                  <span className="ml-3 text-black">{option.description}</span>
                </div>
              ))}
            </div>
            <button
              onClick={nextQuestion}
              className="w-[95%] mt-2 mb-1 text-white sm:py-2 rounded-lg"
            >
              Next →
            </button>
          </div>
        ) : (
          <div className="text-xl font-bold text-gray-600">
            Loading questions...
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
