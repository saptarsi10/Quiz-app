import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GrLinkNext } from "react-icons/gr";
import { RxLapTimer } from "react-icons/rx";
import { IoNewspaperOutline } from "react-icons/io5";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

function Quiz() {
  const params = useParams();
  const category = params.category ?? '';
  const difficulty = params.difficulty ?? '';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`)
      .then((res) => setQuestions(res.data.results))
      .catch((err) => console.error(err));
  }, [category, difficulty]);

  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentIndex];
      const answers = [...current.incorrect_answers, current.correct_answer];
      const shuffled = answers.sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    }
  }, [questions, currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          if (!selectedAnswer) {
            alert('❗ Please select an answer!');
            return 30;
          }

          const updatedAnswers = [...userAnswers];
          updatedAnswers[currentIndex] = selectedAnswer;
          setUserAnswers(updatedAnswers);

          if (currentIndex < questions.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setSelectedAnswer('');
          } else {
            navigate('/result', {
              state: {
                questions,
                userAnswers: updatedAnswers,
              },
            });
          }

          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, selectedAnswer, userAnswers, questions, navigate]);

  const handleNext = () => {
    if (!selectedAnswer) return alert('❗ Please select an answer!');

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentIndex] = selectedAnswer;
    setUserAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setTimer(30);
    } else {
      navigate('/result', {
        state: {
          questions,
          userAnswers: updatedAnswers,
        },
      });
    }
  };

  if (questions.length === 0) {
    return <p className="text-center mt-20 text-red-600">🔄 Loading Questions...</p>;
  }

  const current = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ecf0f3] p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-xl bg-[#ecf0f3] p-6 sm:p-8 rounded-2xl shadow-[8px_8px_15px_#d1d9e6,-8px_-8px_15px_#ffffff]">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-red-700 text-center flex items-center justify-center gap-2">
          <IoNewspaperOutline className="text-2xl" />
          Question {currentIndex + 1} of 10
        </h2>


        <p
          className="mb-6 text-base sm:text-lg text-gray-800"
          dangerouslySetInnerHTML={{ __html: current.question }}
        ></p>

        <div className="mb-6 w-full">
          {shuffledAnswers.map((answer, index) => (
            <label
              key={index}
              className={`block p-3 my-2 rounded-xl cursor-pointer transition-all text-sm sm:text-base font-medium text-center
                ${selectedAnswer === answer
                  ? 'bg-red-600 text-white shadow-[inset_5px_5px_10px_#c04040,inset_-5px_-5px_10px_#ff9090]'
                  : 'bg-[#ecf0f3] text-gray-800 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]'}`}
            >
              <input
                type="radio"
                name="answer"
                value={answer}
                className="hidden"
                checked={selectedAnswer === answer}
                onChange={() => setSelectedAnswer(answer)}
              />
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </label>
          ))}
        </div>

        <p className="mb-4 text-center font-semibold text-gray-700 flex justify-center items-center gap-2">
          <RxLapTimer className="text-lg" />
          Time Left: <span className="text-red-600 font-bold">{timer}s</span>
        </p>


        <button
          onClick={handleNext}
          className="mx-auto flex items-center justify-center gap-2 w-32 py-2.5 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-150 ease-in-out active:scale-95 cursor-pointer shadow-[8px_8px_15px_#d1d9e6,-8px_-8px_15px_#ffffff] text-sm sm:text-base"
        >
          {currentIndex === 9 ? 'Submit' : (
            <>
              <span>Next</span> <GrLinkNext className="text-base" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Quiz;
