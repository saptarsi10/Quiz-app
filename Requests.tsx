import axios from 'axios';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export const getQuestions = (category: string, difficulty: string) =>
  axios.get<{ results: Question[] }>(
    `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
  ).then(res => res.data.results);
