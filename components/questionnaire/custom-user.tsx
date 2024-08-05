'use client';
import { useState, useEffect } from "react";
import Questionnaire from "./questionnaire";
import axios from "axios";
import { useSession } from "next-auth/react"
import CustomVideo from "./custom-video";
import useBackgroundImage from "../ui/useBackgroundImage";
import { addOrUpdateRanking, getSubjectIdByName } from "@/db";
import { Button } from "../ui/button";
import CustomLink from "../custom-link"

interface CustomUserProps {
    subject: string;
    rank: number | null;
    updateRank: (newRank: number | null) => void;
    userId: number | null;
    topics: string[];
  }
  
const CustomUser: React.FC<CustomUserProps> = ({ subject, rank, updateRank, userId, topics}) => {
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(false);
    const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showAnswers, setShowAnswers] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [questionTopic, setQuestionTopic] = useState<string>('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    const { backgroundImage, loading: bgLoading, error: bgError } = useBackgroundImage(subject);


    const toggleTopic = (topic: string) => {
        setSelectedTopics(prev => 
            prev.includes(topic) 
            ? prev.filter(t => t !== topic)
            : [...prev, topic]
        );
    };

    const getRandomTopics = (count: number) => {
        const shuffled = [...topics].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const toggleAnswers = () => {
        const newShowAnswers = !showAnswers;
        setShowAnswers(newShowAnswers);
        const container = document.getElementById('generated-html-container');
        if (container) {
            const visibleInputs = container.querySelectorAll('input:not([type="hidden"])');
            const submitButton = container.querySelector<HTMLElement>('button[type="submit"]') ;
            const explanations = container.querySelectorAll<HTMLElement>('.explanation');
    
            visibleInputs.forEach((input) => {
                const inputId = input.id;
                const hiddenInput = container.querySelector(`#${inputId}-answer`) as HTMLInputElement;
                if (hiddenInput) {
                    const correctAnswer = hiddenInput.getAttribute('data-answer');
                    if (showAnswers) {
                        (input as HTMLInputElement).value = '';
                        (input as HTMLInputElement).disabled = false;
                    } else {
                        (input as HTMLInputElement).value = correctAnswer || '';
                        (input as HTMLInputElement).disabled = true;
                    }
                }
            });
    
            // Toggle submit button visibility
            if (submitButton) {
                submitButton.style.display = newShowAnswers ? 'none' : 'block';
            }
    
            // Toggle explanation visibility
            explanations.forEach((explanation) => {
                explanation.style.display = newShowAnswers ? 'block' : 'none';
            });
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let topicsForPrompt = selectedTopics.length > 0 ? selectedTopics : getRandomTopics(3);

        try {
            const prompt = `
                Create an HTML <div> element with the following requirements:
                1. Display the name "${answers.name}".
                2. Set the background color of the form to "${answers.color}", not only <div> but also <form>.
                3. Display the age "${answers.age}" within the <div>.
                4. This is important make it pretty, such as using gradient, rounded corner, etc.
                5. Name and the age should be in the center of the block, larger and Roboto font.
                6. Ask the user 5 questions about "${subject}" covering the following topics: "${topicsForPrompt.join(', ')}" based on the age "${answers.age}" and ranking "${rank}".
                7. All the questions should be able to take input and also check the answers.
                8. Questions can have numeric or text-based answers. For decimal answers, use text input".
                9. Wrap all questions and the submit button in a <form> element.
                10. Include a submit button with type="submit" at the end of the form.
                11. Include a hidden input for each question with a 'data-answer' attribute containing the correct answer.
                12. Add a <div id="results"></div> after the form to display the quiz results.
                13. For each question, add a hidden explanation <div> with class "explanation" that explains the correct answer.
                14. Include a topic in html about all the questions you provided with an id = 'topic' 
                Please use inline styles instead of Tailwind CSS classes.
                Ensure that each question must be different and  has a unique id and that the corresponding hidden input has a matching id with '-answer' appended.
                `;
        const response = await axios.post('/api/chat', { prompt: prompt });
        setShowAnswers(false);
        setMessages(response.data.response);

        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(response.data.response, 'text/html');
        
        // Extract the topic
        const topicElement = htmlDoc.getElementById('topic');
        const topic = topicElement ? topicElement.textContent?.trim() : subject;
        
        setQuestionTopic(topic ?? '');

        setShowVideo(true);
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
        if (rank === null) return;

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
        const container = document.getElementById('generated-html-container');
        const showA = document.getElementById('showAnswer');
        showA?.classList.remove("hidden");
        if (container) {
            const visibleInputs = container.querySelectorAll('input:not([type="hidden"])');
            let score = 0;
            visibleInputs.forEach((input) => {
                const inputId = input.id;
                const hiddenInput = container.querySelector(`#${inputId}-answer`) as HTMLInputElement;
                if (hiddenInput) {
                    const correctAnswer = hiddenInput.getAttribute('data-answer');
                    if ((input as HTMLInputElement).value.toLowerCase().trim() === correctAnswer?.toLowerCase().trim()) {
                        score++;
                    }
                }
            });
            const totalQuestions = visibleInputs.length;
            const percentage = (score / totalQuestions) * 100;
            
            const resultsDiv = document.getElementById('results');
            if (resultsDiv) {
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = `You got ${score} out of ${totalQuestions} correct. Your score is ${percentage.toFixed(2)}%.`;
            }
            
            if (userId) {
                await updateRanking(percentage);
            }
        }
    };

    useEffect(() => {
        if (messages) {
            const container = document.getElementById("generated-html-container");
            if (container) {
                container.innerHTML = messages;
                const form = container.querySelector('form');
                const submitButton = container.querySelector('button[type="submit"]');
                const explanations = container.querySelectorAll<HTMLElement>('.explanation');
    
                if (form) {
                    const submitHandler = (e: Event) => {
                        e.preventDefault();
                        handleQuizSubmit(e);
                    };
                    form.addEventListener('submit', submitHandler);
                    
                    // Hide explanations initially
                    explanations.forEach((explanation) => {
                        explanation.style.display = 'none';
                    });
    
                    // Clean up the event listener when the component unmounts or messages change
                    return () => {
                        form.removeEventListener('submit', submitHandler);
                    };
                }
            }
        }
    }, [messages]);

    // if (!questionnaireComplete) {
    //     return <Questionnaire onComplete={handleQuestionnaireComplete} />;
    // }


    return (
            <div 
            className="flex flex-col gap-6 p-6 rounded-lg"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            >
            {bgLoading && <p>Loading background...</p>}
            {bgError && <p>Error loading background: {bgError}</p>}
            <div className="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Subject: {subject}</h2>
            {rank !== null ? (
            <p className="text-gray-700 dark:text-gray-300">Your rank: {rank}</p>
            ) : (
            <p className="text-gray-700 dark:text-gray-300">
                <CustomLink href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
                </CustomLink> to see your rank
            </p>
            )}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Select Topics:</h3>
                <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                    <Button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        variant={selectedTopics.includes(topic) ? "default" : "outline"}
                    >
                        {topic}
                    </Button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col bg-gray-100 rounded-md mt-6">
                {/* <div className="p-4 font-bold bg-gray-200 rounded-t-md">
                    Questionnaire Answers
                </div> */}
                {/* <pre className="py-6 px-4 whitespace-pre-wrap break-all">
                    {JSON.stringify(answers, null, 2)}
                </pre> */}
                <div>
                    <div id="generated-html-container"></div>
                    {/* <div id="results" style={{marginTop: '20px', color: '#000'}}></div> */}
                </div>
            </div>
            <div className="flex gap-4">
                {/* <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => {
                        localStorage.removeItem("questionnaireComplete");
                        localStorage.removeItem("questionnaireAnswers");
                        setQuestionnaireComplete(false);
                    }}
                >
                    Reset User info
                </button> */}
                <button
                    id="showAnswer"
                    className="hidden mt-4 px-4 py-2 bg-blue-500 text-white rounded"
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
            {showVideo && (
                <CustomVideo 
                    topic={subject}
                    questions={questionTopic}
                />
            )}
            </div>
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

