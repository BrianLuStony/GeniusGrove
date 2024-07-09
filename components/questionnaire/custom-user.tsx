'use client';
import { useState, useEffect } from "react";
import Questionnaire from "./questionnaire";
import axios from "axios";
import { useSession } from "next-auth/react"

import { addOrUpdateRanking, getSubjectIdByName } from "@/db";

interface CustomUserProps {
    subject: string;
    rank: number | null;
    updateRank: (newRank: number | null) => void;
    userId: number | null;
  }
  
const CustomUser: React.FC<CustomUserProps> = ({ subject, rank, updateRank, userId }) => {
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showAnswers, setShowAnswers] = useState(false);


    const toggleAnswers = () => {
        setShowAnswers(!showAnswers);
        const inputs = document.querySelectorAll('#generated-html-container input');
        inputs.forEach((input) => {
        const correctAnswer = input.getAttribute('data-answer');
        if (showAnswers) {
            (input as HTMLInputElement).value = '';
        } else {
            (input as HTMLInputElement).value = correctAnswer || '';
        }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const prompt = `
            Create an HTML <div> element with the following requirements:
            1. Display the name "${answers.name}".
            2. Set the background color to "${answers.color}".
            3. Display the age "${answers.age}" within the <div>.
            4. Make it pretty, such as using gradient, rounded corner, etc.
            5. Name and the age should be in the center of the block, larger and Roboto font.
            6. Ask the user some questions about "${subject}" based on the age "${answers.age}" and ranking "${rank}".
            7. All the questions should be able to take input and also check the answers.
            8. There should be a submit button in the end and a id results <div> to show the percentage, no need script. 
            Please use inline styles instead of Tailwind CSS classes.
            Ensure that each question has a data-answer attribute with the correct answer and at least 5 questions.
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
        localStorage.setItem("questionnaireComplete", "true");
        localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
    };

    const updateRanking = async (percentage: number) => {
        if (rank === null) return; // If there's no rank, we can't update it

        let newRank = rank;
        if (percentage >= 80) {
        newRank += 1;
        } else if (percentage < 40) {
        newRank = Math.max(0, newRank - 1); // Ensure rank doesn't go below 0
        }

        if (newRank !== rank) {
        try {
            const subjectId = await getSubjectIdByName(subject);
            console.log("Updating the rank subid ", subjectId);
            console.log("for this user ", userId);
            if (userId && subjectId) {
            await addOrUpdateRanking(userId, subjectId, newRank);
            // Update the parent state
            updateRank(newRank);
            }
        } catch (error) {
            console.error('Failed to update ranking', error);
        }
        }
    };

    const handleQuizSubmit = async (e: Event) => {
        e.preventDefault();
        const inputs = document.querySelectorAll('#generated-html-container input');
        let score = 0;
        const resultsDiv = document.getElementById('results');

        inputs.forEach((input) => {
        const correctAnswer = input.getAttribute('data-answer');
        if ((input as HTMLInputElement).value === correctAnswer) {
            score++;
        }
        });
        const percentage = (score / inputs.length) * 100;
        if (resultsDiv) {
        resultsDiv.style.display = 'block';
        resultsDiv.innerHTML = `You got ${score} out of ${inputs.length} correct. Your score is ${percentage.toFixed(2)}%.`;
        }
        console.log(userId);
        if (userId) {
            await updateRanking(percentage);
        }
    };

    useEffect(() => {
        if (messages) {
        const container = document.getElementById("generated-html-container");
        if (container) {
            container.innerHTML = messages;
            const submitButton = container.querySelector('button');
            if (submitButton) {
            submitButton.addEventListener('click', handleQuizSubmit);
            }
        }
        }
    }, [messages]);

    if (!questionnaireComplete) {
        return <Questionnaire onComplete={handleQuestionnaireComplete} />;
    }


    return (
        <div className="flex flex-col gap-6">
            <h2>Subject: {subject}</h2>
            {rank !== null ? <p>Your rank: {rank}</p> : <p>Sign in to see your rank</p>}
            <div className="flex flex-col bg-gray-100 rounded-md mt-6">
                <div className="p-4 font-bold bg-gray-200 rounded-t-md">
                    Questionnaire Answers
                </div>
                <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                    {JSON.stringify(answers, null, 2)}
                </pre>
                <div>
                    <div id="generated-html-container"></div>
                    {/* <div id="results" style={{marginTop: '20px', color: '#000'}}></div> */}
                </div>
            </div>
            <div className="flex gap-4">
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
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={toggleAnswers}
                >
                    {showAnswers ? 'Hide Answers' : 'Show Answers'}
                </button>
            </div>
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

export default CustomUser;


// 'use client';
// import { useState,useEffect } from "react";
// import Questionnaire from "./questionnaire";
// import parse from 'html-react-parser';
// import axios from "axios";

// export default function CustomUser(){
//     const [messages, setMessages] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
//     const [answers, setAnswers] = useState<Record<string, string>>({});

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
    
//         try {
//           // Send the prompt to the server and get the response
          
//             const prompt = `
//             Create an HTML <div> element with the following requirements:
//             1. Display the name "${answers.name}".
//             2. Set the background color to "${answers.color}".
//             3. Display the age "${answers.age}" within the <div>.
//             4. Make it pretty, such as using gradient, rounded corner, etc.
//             5. Name and the age should be in the center of the block, larger and Roboto font.
//             6. Ask the user some questions about mathematics based on the age "${answers.age}".
//             7. All the questions should be able to take input and also check the answers.
//             8. There should be a submit button in the end that checks the percentage of the correct answer. For the script, use DOMContentLoaded and ensure it executes when the HTML is inserted dynamically.
//             Please use inline styles instead of Tailwind CSS classes.
//             `;
//           const response = await axios.post('/api/chat', { prompt: prompt });
    
//           setMessages(response.data.response);
    
//         } catch (error) {
//           console.error('Failed to fetch chat', error);
//         } finally {
//           setLoading(false); // Reset loading state after response or error
//         }
//       };

//     useEffect(() => {
//         // Check if the questionnaire is already completed
//         const isQuestionnaireComplete = localStorage.getItem("questionnaireComplete");
//         if (isQuestionnaireComplete === "true") {
//           const savedAnswers = localStorage.getItem("questionnaireAnswers");
//           setQuestionnaireComplete(true);
//           setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {});
//         }
//     }, []);

//     const handleQuestionnaireComplete = (answers: Record<string, string>) => {
//         setAnswers(answers);
//         setQuestionnaireComplete(true);
//         // Save completion status and answers to local storage
//         localStorage.setItem("questionnaireComplete", "true");
//         localStorage.setItem("questionnaireAnswers", JSON.stringify(answers));
//       };

//       const executeScript = (scriptContent: string) => {
//         const scriptFunction = new Function(scriptContent); // Create a function from script text
//         scriptFunction(); // Execute the function
//       };
    
//       useEffect(() => {
//         if (messages) {
//           const container = document.getElementById("generated-html-container");
//           if (container) {
//             container.innerHTML = messages;
//             const scripts = container.getElementsByTagName("script");
//             for (let i = 0; i < scripts.length; i++) {
//               const scriptContent = scripts[i].innerText;
//               executeScript(scriptContent);
//             }
//           }
//         }
//       }, [messages]);

//     if (!questionnaireComplete) {
//         return <Questionnaire onComplete={handleQuestionnaireComplete} />;
//     }
//     return (
//         <div className="flex flex-col gap-6">
//             <div className="flex flex-col bg-gray-100 rounded-md mt-6">
//                 <div className="p-4 font-bold bg-gray-200 rounded-t-md">
//                 Questionnaire Answers
//                 </div>
//                 <pre className="py-6 px-4 whitespace-pre-wrap break-all">
//                 {JSON.stringify(answers, null, 2)}
//                 </pre>
//                 <div>
//                     <h1>Generated HTML</h1>
//                     <div id="generated-html-container"></div>
//                     {/* <div dangerouslySetInnerHTML={{ __html: messages }} /> */}
//                 </div>
//             </div>
//             <button
//                 className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//                 onClick={() => {
//                 localStorage.removeItem("questionnaireComplete");
//                 localStorage.removeItem("questionnaireAnswers");
//                 setQuestionnaireComplete(false);
//                 }}
//             >
//                 Reset Questionnaire
//             </button>
//             <form onSubmit={handleSubmit}>
//                 <button
//                     className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
//                 >
//                     Ready to send my prompt
//                 </button>
//             </form>
//         </div>
//     );
// };

