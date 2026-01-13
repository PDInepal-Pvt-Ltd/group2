import React from 'react';

const ProgressBar = ({ progress, className = '', color = 'bg-green-500' }) => {
    // progress can be 0-1 or 0-100. Normalize to 0-100
    let percentage = progress;
    if (progress <= 1) {
        percentage = progress * 100;
    }
    
    // Clamp between 0 and 100
    percentage = Math.min(100, Math.max(0, percentage));

    return (
        <div className={`w-full bg-[#333] rounded-full h-2.5 ${className}`}>
            <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${color}`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
