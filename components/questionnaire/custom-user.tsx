'use client';
import { useState,useEffect } from "react";
import Questionnaire from "./questionnaire";
import axios from "axios";

export default function CustomUser(){
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    
        try {
          // Send the prompt to the server and get the response
          
            const prompt = `
            Create an HTML <div> element with the following requirements:
            1. Display the name "${answers.name}".
            2. Set the background color to "${answers.color}".
            3. Display the age "${answers.age}" within the <div>.
            Please use tailwinds to make it pretty
            `;
          const response = await axios.post('/api/chat', { prompt: prompt });
    
          setMessages(response.data.response);
    
        } catch (error) {
          console.error('Failed to fetch chat', error);
        } finally {
          setLoading(false); // Reset loading state after response or error
        }
      };

    useEffect(() => {
        // Check if the questionnaire is already completed
        const isQuestionnaireComplete = localStorage.getItem("questionnaireComplete");
        if (isQuestionnaireComplete === "true") {
          const savedAnswers = localStorage.getItem("questionnaireAnswers");
          setQuestionnaireComplete(true);
          setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
        }
    }, []);

    const handleQuestionnaireComplete = (answers: Record<string, string>) => {
        setAnswers(answers);
        setQuestionnaireComplete(true);
        // Save completion status and answers to local storage
        localStorage.setItem("questionnaireComplete", "true");
        localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
      };

    if (!questionnaireComplete) {
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
    }
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col bg-gray-100 rounded-md mt-6">
                <div className="p-4 font-bold bg-gray-200 rounded-t-md">
                Questionnaire Answers
                </div>
                <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                {JSON.stringify(answers, null, 2)}
                </pre>
                <div>
                    <h1>Generated HTML</h1>
                    <div dangerouslySetInnerHTML={{ __html: messages }} />
                </div>
            </div>
            <button
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => {
                localStorage.removeItem("questionnaireComplete");
                localStorage.removeItem("questionnaireAnswers");
                setQuestionnaireComplete(false);
                }}
            >
                Reset Questionnaire
            </button>
            <form onSubmit={handleSubmit}>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Ready to send my prompt
                </button>
            </form>
        </div>
    );
};

