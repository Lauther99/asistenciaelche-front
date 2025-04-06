import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import RecordRTC from 'recordrtc';
import BlockedCamera from '../../components/BlockedCamera';
import LoadingComponent from '../../components/LoadingComponent';
import RecSVG from '../../assets/rec.svg';
import CheckSVG from '../../assets/check.svg';
import ClearSVG from '../../assets/clear.svg';
import { useAuth } from '../../components/AuthProvider';

const base = import.meta.env.VITE_BASE_BACKEND_URL
const verify_url = base + "/v1/verify"
// const encrypt_token_url = base + "/v1/encrypt-data"


const VerificacionFace: React.FC = () => {
    const webcamRef = useRef<any>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isVideoCaptured, setIsVideoCaptured] = useState(false);
    const [recorder, setRecorder] = useState<RecordRTC | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isCameraAble, setIsCameraAble] = useState("");

    const { login } = useAuth();

    useEffect(() => {
        const checkCameraPermission = async () => {
            try {
                const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
                if (permissions.state === 'granted') {
                    setIsCameraAble("granted")
                } else if (permissions.state === 'prompt') {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                } else if (permissions.state === 'denied') {
                    setIsCameraAble("denied")
                }

                permissions.onchange = () => {
                    if (permissions.state === 'granted') {
                        setIsCameraAble("granted");
                    } else {
                        setIsCameraAble('denied');
                    }
                };
            } catch (error) {
                console.error('⚠️ Error al verificar permiso de cámara:', error);
            }
        };

        checkCameraPermission();
    }, []);

    const captureVideo = () => {
        if (webcamRef.current) {
            setIsRecording(true);
            setIsVideoCaptured(false);

            const stream = webcamRef.current.stream;
            const recorder = new RecordRTC(stream, {
                type: 'video',
                mimeType: 'video/mp4',
            });

            setRecorder(recorder);
            recorder.startRecording();

            setTimeout(() => {
                recorder.stopRecording(() => {
                    const videoBlob = recorder.getBlob();
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setVideoSrc(videoUrl);
                    setIsRecording(false);
                    setIsVideoCaptured(true);
                });
            }, 4000);
        }
    };

    const reset = () => {
        setVideoSrc(null)
        setIsRecording(false)
        setIsVideoCaptured(false)
        setRecorder(null)
    }

    const verify = async () => {
        setIsLoading(true)
        if (!recorder) {
            console.error("No hay video para enviar");
            return;
        }
        const videoBlob = recorder.getBlob();
        const formData = new FormData();
        formData.append("video", videoBlob, "video.mp4");

        try {
            const response = await fetch(verify_url, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                throw new Error(data.message);
            }
            const data = await response.json();
            if (data.status === "success") {
                const nombre = data.message.nombre
                const dni = data.message.id
                await login(nombre, dni);
                window.location.reload();
            } else {
                alert(data.message)
                reset()
            }

        } catch (error) {
            console.error("Error:", error);
            alert(error)
            reset()
        } finally {
            setIsLoading(false)
        }
    };


    const VerificationContainer = () => {
        if (!isVideoCaptured) {
            return (
                <div style={{
                    maxWidth: "300px",
                    margin: "auto",
                    padding: "24px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    justifyContent: "space-evenly",
                }}>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                        style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            aspectRatio: "3 / 4",
                            transform: "scaleX(-1)",
                        }}
                        videoConstraints={{
                            facingMode: 'user',
                            width: 640,
                            height: 480,
                        }}
                    />
                    <button onClick={captureVideo} disabled={isRecording} className="rec-video-btn">
                        <img src={RecSVG} alt="" className={`rec-video-btn ${!isRecording ? "" : "recording"}`} />
                        {isRecording ? 'Grabando ...' : 'Grabar Video'}
                    </button>
                    <p style={{ textAlign: "center" }}>Trata de enfocar tu rostro en el recuadro y <b>NO olvides parpadear.</b></p>
                </div>
            )
        } else {
            if (videoSrc) {
                return (
                    <div style={{
                        maxWidth: "300px",
                        margin: "auto",
                        padding: "24px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        gap: "24px"
                    }}>
                        <div style={{
                            maxWidth: "300px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            alignItems: "center",
                            position: "relative",
                        }}>
                            <video
                                controls
                                style={{
                                    width: "100%",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    aspectRatio: "3 / 4",
                                    transform: "scaleX(-1)"
                                }} >
                                <source src={videoSrc} type="video/mp4" />
                                Tu navegador no soporta el elemento de video.
                            </video>
                            <button onClick={reset} className='retake-photo-btn' />
                        </div>
                        <button type='button' className={`verify-btn ${!isVideoCaptured ? "hidden" : ""}`} onClick={verify}>
                            <img src={CheckSVG} alt=""></img>
                        </button>
                        <button type='button' className={`verify-btn ${!isVideoCaptured ? "hidden" : ""}`} onClick={reset}>
                            <img src={ClearSVG} alt=""></img>
                        </button>
                    </div>
                )
            }
            return <p>No video captured, try again.</p>
        }
    }

    return (
        <div>
            <LoadingComponent flag={isLoading} />
            <BlockedCamera flag={isCameraAble} />
            {VerificationContainer()}
        </div>
    );
};

export default VerificacionFace;