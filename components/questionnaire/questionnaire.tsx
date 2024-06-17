'use client';

import { useEffect, useState } from "react";

interface QuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
}

const Questionnaire = ({ onComplete }: QuestionnaireProps) => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    // Retrieve saved answers from local storage if they exist
    const savedAnswers = localStorage.getItem("questionnaireAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const questions = [
    { question: "What is your name?", key: "name" },
    { question: "What is your favorite color?", key: "color" },
    { question: "What is your age?", key: "age" },
  ];

  useEffect(() => {
    // Check if the questionnaire is already completed
    const savedStep = localStorage.getItem("questionnaireStep");
    if (savedStep) {
      setStep(parseInt(savedStep, 10));
    }
  }, []);

  useEffect(() => {
    // Save answers and current step to local storage
    localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
    localStorage.setItem("questionnaireStep", step.toString());
  }, [answers, step]);

  const handleNext = () => {
    setAnswers((prev) => ({ ...prev, [questions[step].key]: input }));
    setInput(''); // Clear the input field
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      onComplete({ ...answers, [questions[step].key]: input });
      localStorage.removeItem("questionnaireStep"); // Clear step after completion
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">{questions[step].question}</h2>
        <input
          type="text"
          className="border p-2 mt-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNext();
            }
          }}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
