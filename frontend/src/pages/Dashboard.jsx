import React, { useContext, useEffect, useState } from "react";
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
    const [previousAnswers, setPreviousAnswers] = useState(null);  //State to store the previous answers
    const [totalScore, setTotalScore] = useState(null);    // state to store the total score
    const [depressionType, setDepressionType] = useState(null);  // state to store the depresstion type
    const [activeTab, setActiveTab] = useState("questions");    // State to manage the active tab

    // to check if the user has completed the assessment previously
    const fetchPreviousAssessment = async () => {
        try {
            const res = await fetch(`${BASE_URL}/assessments/${user._id}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok) {
                throw new Error('Failed to fetch the previous answers');
            }

            const responseData = await res.json();
            if(responseData && responseData.data && responseData.data.length > 0){
                // If already completed the test, set the answers and disable test start
                setPreviousAnswers(responseData.data[0].assessment_response);
                setTotalScore(responseData.data[0].total_score);
                setDepressionType(responseData.data[0].depression_type);

                setQuestions(questionsData); // Set questions from imported JSON data
                setTestStarted(true);
                setActiveTab('reports'); // If test is completed, set the active tab to 'reports'
            } else {
                // If test is not completed, enable test start
                setTestStarted(false);
            }
        } catch (err) {
            console.error('Error fetching the previous answers:', err.message);
        }
    };

    useEffect(() => {
        fetchPreviousAssessment();
    }, [user._id, token]);

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

    /* To calculate the score based on the selected answer */
    const calculateScore = (selectedAnswer) => {
        //Define the scoring system based on the selected answer
        const scoringSystem = {
            "NOT AT ALL": 0,
            "SEVERAL DAYS": 1,
            "MORE THAN HALF THE DAYS": 2,
            "NEARLY EVERY DAY": 3
        }

        //return the score based on the selected answer
        return scoringSystem[selectedAnswer] || 0;
    }

    const handleSubmitTest = async () => {
        const unansweredQuestions = questions.filter(question => !selectedAnswers[question.id]);
        
        if (unansweredQuestions.length > 0) {
            toast.error("Please answer all questions before submitting the test");    
        } else {
            const assessmentResponses = questions.map(question => ({
                question: question.question,
                selectedAnswer: selectedAnswers[question.id],
                score: calculateScore(selectedAnswers[question.id]) //calculate score for the selected answer
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
                const result = await res.json();
                toast.success(result.message);

                fetchPreviousAssessment();
            } catch (err) {
                console.log("Error ::", err);
                toast.error(err.message);
            }
        }
    }

    /* to return the HTML code for the Tab buttons (Test Questions, Your Reports) */
    const TabButton = ({ active, onClick, label, number }) => {
        return (
            <div className="flex items">
                <div className={`rounded-full ${active ? 'bg-[#a4cbb4]' : 'bg-gray-300'} w-8 h-8 flex items-center justify-center text-white font-bold`}>
                    {number}
                </div>
                <span className={`ml-2 text-lg ${active ? 'font-semibold' : ''}`} onClick={onClick}>{label}</span>
            </div>
        );
    };

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
                                <TabButton
                                    active={activeTab === 'questions'}
                                    onClick={() => setActiveTab('questions')}
                                    label={previousAnswers ? "Your Answers" : "Test Questions"}
                                    number="1"
                                />
                                <TabButton
                                    active={activeTab === 'reports'}
                                    onClick={() => setActiveTab('reports')}
                                    label="Your Results"
                                    number="2"
                                />
                            </div>
                            {activeTab === 'questions' && (
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
                                                                    className={`answer_btn ${previousAnswers && 
                                                                        previousAnswers.find(ans => ans.question === question.question)?.selectedAnswer === option
                                                                        ? "selected" : selectedAnswers[question.id] === option ? "selected" : ""}`}
                                                                    onClick={() => handleAnswerClick(question.id, option)}
                                                                    disabled={previousAnswers !== null}  //disable clicking if the test is already completed
                                                                >
                                                                    {option}
                                                                </button>
                                                            ))}
                                                            {/* Show score if the test is already completed */}
                                                            {previousAnswers && (
                                                                <span className="rounded-full ml-2 bg-[#a4cbb4] w-8 h-8 flex items-center justify-center text-white font-bold">
                                                                    {previousAnswers.find(ans => ans.question === question.question)?.score}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>                                
                                    </div>
                                    {/* Check if there are unanswered questions */}
                                    {!previousAnswers && (
                                        <button className="btn mt-4 bg-[#ff914d] text-white" onClick={handleSubmitTest}>Submit Test</button>                
                                    )}
                                </div>
                            )}
                            {activeTab === 'reports' && (
                                <div>
                                    {/* Render reports here */}
                                    <h2 className="text-3xl font-bold text-[#237591] ">Your Results - Depression Test:</h2>
                                    <span className="mt-2 text-xl font-semibold text-[#059669]">
                                        {depressionType ? depressionType : " "} Depression
                                    </span>
                                    
                                    <div className="mt-2 mb-4 flex space-x-5">
                                        <button className="rounded-full p-4 bg-[#d1fae5] text-[#065f46]">
                                            About your score: {totalScore ? totalScore : 0}/27
                                        </button>
                                        <button className="rounded-full p-4 bg-gray-300">
                                            Email results
                                        </button>
                                    </div>

                                    <section className="mt-8 p-8 bg-white rounded-lg">
                                        <h2 className="text-2xl font-bold">About your score</h2>
                                        <p className="mt-4 text-gray-700">
                                            Each of your answers has a score of 0-3. Click "Your Answers" above to see your score for each question.
                                            Adding these up provides your Total score.
                                        </p>
                                        <p className="mt-4 text-gray-700">
                                            Not at all = 0; Several days = 1; More than half the days = 2; Nearly every day = 3
                                        </p>
                                        <h3 className="mt-8 text-xl font-semibold">Interpreting your Total Score</h3>
                                        <ul className="mt-4 list-disc pl-5">
                                            <li>
                                                <span className="font-semibold">1-4:</span> Minimal depression
                                            </li>
                                            <li>
                                                <span className="font-semibold">5-9:</span> Mild depression
                                            </li>
                                            <li>
                                                <span className="font-semibold">10-14:</span> Moderate depression
                                            </li>
                                            <li>
                                                <span className="font-semibold">15-19:</span> Moderately severe depression
                                            </li>
                                            <li>
                                                <span className="font-semibold">20-27:</span> Severe depression
                                            </li>
                                        </ul>
                                    </section>
                                </div>
                            )}
                        </div>
                    )}  
                </div>
            </div>
        </div>
    );
};

export default Dashboard;