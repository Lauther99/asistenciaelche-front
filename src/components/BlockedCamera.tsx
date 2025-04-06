import React, { useState, useEffect } from 'react';
import CameraSlash from '../assets/camera-slash.svg';

interface BlockedCameraProps {
    flag: string;
}

const BlockedCamera: React.FC<BlockedCameraProps> = ({ flag }) => {
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        if (flag === "denied") {
            setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [flag]);


    return (
        <div className={`${!isBlocked ? "hidden" : "camera-blocked-container"}`}>
            <div>
                <img src={CameraSlash} alt="" />
                <p><span style={{color: "red", fontWeight: "bold"}}>El permiso de la cámara fue denegado.</span><br/><br/>Por favor actívalo manualmente en la configuración del navegador.</p>
            </div>
        </div>
    );
};

export default BlockedCamera;
