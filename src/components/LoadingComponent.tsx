import React, { useState, useEffect } from 'react';

interface LoadingProps {
    flag: boolean;
}

const LoadingComponent: React.FC<LoadingProps> = ({ flag }) => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flag) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [flag]);


    return (
        <div className={`${!isLoading ? "hidden" : "loading-container"}`}>
            <div className='loading-dots'></div>
            <div className='loading-dots'></div>
            <div className='loading-dots'></div>
        </div>
    );
};

export default LoadingComponent;
