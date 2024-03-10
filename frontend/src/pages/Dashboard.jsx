import React, { useContext, useState } from "react";
import '../styles/dashboard.css';
import questionsData from "../assets/data/questions.json";
import { toast } from "react-toastify";
import { authContext } from "../context/AuthContext";
import { BASE_URL } from "../config";

/* @author: Jagraj Kaur
   @FileDescription: To render the Dashboard component for logged in users
*/

const Dashboard = () => {
    const { user, token } = useContext(authContext);
    const [testStarted, setTestStarted] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const startTest = async () => {
        setQuestions(questionsData); // Set questions from imported JSON data
        setTestStarted(true);
    }

    const handleAnswerClick = (questionId, answer) => {
        setSelectedAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer,
        }));
    };

    const handleSubmitTest = async () => {
        const unansweredQuestions = questions.filter(question => !selectedAnswers[question.id]);
        
        if (unansweredQuestions.length > 0) {
            toast.error("Please answer all questions before submitting the test");    
        } else {
            const assessmentResponses = questions.map(question => ({
                question: question.question,
                selectedAnswer: selectedAnswers[question.id],
            }));
            
            try {
                const res = await fetch(`${BASE_URL}/assessments`, {
                    method:"post",
                    headers:{
                        "Content-Type":"application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        patient_id: user._id,
                        assessment_response: assessmentResponses,
                    }),
                });
                
                if(!res.ok){
                    throw new Error('Failed to save assessment response');
                }
                
                toast.success(res.message);
            } catch (err) {
                console.log("Error ::", err);
                toast.error(err.message);
            }
        }

        
    }

    return (
        <div id="dashboard_container" className="wrap wide">
            <div className="inner mx-auto bg-[#e3f8f8] rounded-r-3xl rounded-bl-[1.5rem]">
                <h1 className="font-semibold">Take a Mental Health Test</h1>
                <div className="text">
                    {!testStarted ? (
                        <div>
                            <p className="text-lg">
                                Online screening is one of the quickest and easiest ways to determine whether you are experiencing symptoms of a
                                mental health condition.
                            </p>
                            <p className="text-lg">
                                <strong>Mental health conditions, such as depression or anxiety, are real, common and treatable. And recovery is
                                possible.</strong>
                            </p>
                            <button className="btn mt-0 bg-[#ff914d] text-white" onClick={startTest}>TAKE A MENTAL HEALTH TEST</button>
                        </div>
                    ) : (
                        <div>
                            {/* Render questions here */}
                            <div className="flex space-x-8 mb-8">
                                <div className="flex items-center">
                                    <div className="rounded-full bg-[#a4cbb4] w-8 h-8 flex items-center justify-center text-white font-bold">
                                    1
                                    </div>
                                    <span className="ml-2 text-lg">Test Questions</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="rounded-full bg-gray-300 w-8 h-8 flex items-center justify-center text-white font-bold">
                                    2
                                    </div>
                                    <span className="ml-2 text-lg">Your Results</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-lg mb-4">
                                    Over the last 2 weeks, how often have you been bothered by any of the following problems?
                                </p>
                                <p className="text-sm mb-8">Please note, all fields are required.</p>
                                <div className="space-y-6">
                                    <ul className="space-y-4">
                                        {questions.map((question, index) => (
                                            <li key={index}>
                                                <div className="flex flex-col space-y-2">
                                                    <label className="mb-1 font-medium font-semibold">
                                                        {question.id}. {question.question}
                                                    </label>
                                                    <div className="flex justify-between max-w-4xl">
                                                        {question.options.map((option, optionIndex) => (
                                                            <button
                                                                key={optionIndex}
                                                                className={`answer_btn ${selectedAnswers[question.id] === option ? "selected" : ""}`}
                                                                onClick={() => handleAnswerClick(question.id, option)}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>                                
                                </div>
                            </div>
                            <button className="btn mt-4 bg-[#ff914d] text-white" onClick={handleSubmitTest}>Submit Test</button>                
                        </div>
                    )}  
                </div>
            </div>
        </div>
    );
};

export default Dashboard;