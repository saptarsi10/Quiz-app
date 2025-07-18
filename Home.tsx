import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlurText from './BlurText';

type Topic = {
  id: number;
  name: string;
};

function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then((response) => {
        setTopics(response.data.trivia_categories);
      })
      .catch((error) => {
        console.error('Error fetching topics:', error);
      });
  }, []);

  const handleStart = () => {
    if (selectedTopic && difficulty) {
      navigate(`/quiz/${selectedTopic}/${difficulty}`);
    } else {
      alert('Please select both topic and difficulty');
    }
  };

  return (
    <div className="min-h-screen bg-[#ecf0f3] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md bg-[#ecf0f3] p-6 sm:p-8 rounded-2xl shadow-[8px_8px_15px_#d1d9e6,-8px_-8px_15px_#ffffff]">

        {/* Centered Blur Text */}
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <BlurText
            text="🧠 Brain Challenge"
            delay={100}
            animateBy="words"
            direction="top"
            className="text-2xl sm:text-3xl font-bold text-red-700 mb-2"
          />
          <BlurText
            text="Test your knowledge across various topics"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-sm sm:text-base text-gray-600"
          />
        </div>

        {/* Topic Select */}
        <label htmlFor="topicSelect" className="block text-sm font-medium mb-1 text-gray-700">
          Select Topic
        </label>
        <select
          id="topicSelect"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full p-3 mb-6 rounded-xl bg-[#ecf0f3] text-gray-700 shadow-inner outline-none"
        >
          <option value="" disabled>
            Choose a topic
          </option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        {/* Difficulty Radio Buttons */}
        <div className="flex flex-col gap-3 mb-6 sm:gap-4">
          {['easy', 'medium', 'hard'].map((level) => (
            <label
              key={level}
              className={`w-full text-center px-4 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 text-sm sm:text-base
                ${difficulty === level
                  ? 'bg-[#ecf0f3] text-red-600 shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]'
                  : 'bg-[#ecf0f3] text-gray-700 shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff]'
                }
              `}
            >
              <input
                type="radio"
                name="difficulty"
                value={level}
                className="hidden"
                onChange={(e) => setDifficulty(e.target.value)}
              />
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </label>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className={`w-full py-3 rounded-xl font-semibold text-red-700 bg-[#dfe3e8] 
              shadow-[5px_5px_10px_#d1d9e6,-5px_-5px_10px_#ffffff] 
              hover:shadow-[inset_5px_5px_10px_#d1d9e6,inset_-5px_-5px_10px_#ffffff] 
              transition-all duration-200 text-sm sm:text-base cursor-pointer`}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Home;
