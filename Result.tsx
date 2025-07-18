import { useLocation, useNavigate } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineDangerous } from "react-icons/md";
import { FcOk } from "react-icons/fc";
import { VscGraph } from "react-icons/vsc";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [], userAnswers = [] } = location.state || {};

  type Question = {
    correct_answer: string;
  };

  const correctCount = questions.reduce((acc: number, q: Question, i: number) => {
    if (q.correct_answer === userAnswers[i]) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const wrongCount = questions.length - correctCount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ecf0f3] p-4 sm:p-6 md:p-10">
      <div className="max-w-md w-full bg-[#ecf0f3] p-6 sm:p-8 rounded-2xl shadow-[8px_8px_15px_#d1d9e6,-8px_-8px_15px_#ffffff] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-6 flex items-center justify-center gap-2">
          <VscGraph className="text-xl" /> Quiz Result
        </h2>

        <p className="text-lg sm:text-xl font-medium text-gray-800 mb-2 flex items-center justify-center gap-2">
          <FcOk className="text-xl" /> Correct Answers:
          <span className="text-green-600 font-bold">{correctCount}</span>
        </p>

        <p className="text-lg sm:text-xl font-medium text-gray-800 mb-6 flex items-center justify-center gap-2">
          <MdOutlineDangerous className="text-xl text-red-600" /> Wrong Answers:
          <span className="text-red-600 font-bold">{wrongCount}</span>
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 px-6 rounded-xl bg-red-600 text-white font-semibold shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:bg-red-700 transition duration-150 ease-in-out active:scale-95 cursor-pointer text-sm sm:text-base flex items-center justify-center gap-2"
        >
          <IoHomeOutline className="text-lg" /> Go Home
        </button>
      </div>
    </div>
  );
}

export default Result;
