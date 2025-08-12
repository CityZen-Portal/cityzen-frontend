import React from 'react'
import { useNavigate } from 'react-router-dom';

const RateButton = ({ feedback, status, link }) => {
    const navigate = useNavigate();
    const canGiveFeedback = status.toLowerCase() === 'resolved' && feedback === null;

    const isSubmitted = feedback !== null;

    const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-brand-500 text-white hover:bg-brand-600";
    const disabledClasses = "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed";
    
    const buttonClasses = `${baseClasses} ${canGiveFeedback ? activeClasses : disabledClasses}`;

    const handleRateClick = () => {
        navigate(link);
        window.scrollTo(0, 0);
    };

    return (
        <button
        onClick={handleRateClick}
        disabled={!canGiveFeedback}
        className={buttonClasses}
        >
        {isSubmitted ? "Rated" : "Rate"}
        </button>
    );
}

export default RateButton