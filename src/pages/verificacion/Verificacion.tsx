import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceSVG from '../../assets/faceid.svg';
import FingerSVG from '../../assets/fingerprint.svg';
import LoadingComponent from '../../components/LoadingComponent';
import { useAuth } from '../../components/AuthProvider';

const base = import.meta.env.VITE_BASE_BACKEND_URL
const verify_url = base + "/v1/verify-bio"



const Verificacion: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [isError, setIsError] = useState(false)
    const { login } = useAuth();
    console.log(errorMessage);
    console.log(isError);

    const fingerPrintVerification = async () => {
        try {
            setIsLoading(true)
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            const publicKey: PublicKeyCredentialRequestOptions = {
                challenge,
                timeout: 60000,
                userVerification: 'required'
            };
            const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
            const idKeypass = assertion.id

            const response = await fetch(verify_url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Indicamos que el contenido es JSON
                },
                body: JSON.stringify({ "idKeypass": idKeypass }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }
            const data = await response.json();
            if (data.status === "success") {
                const dni = data?.content?.dni
                const nombre = data?.content?.nombre
                await login(nombre, dni);
                window.location.reload();
            } else {
                alert(data.message)
            }

        } catch (error) {
            if (error instanceof DOMException && error.name === "NotAllowedError") {
                console.warn("🚫 Autenticación cancelada por el usuario o no permitida.");
                setIsError(true)
                setErrorMessage("🚫 Autenticación cancelada por el usuario o no permitida.")
            }
            if (error instanceof Error && error.name === "Error") {
                console.warn(error);
                alert(error.message)
                setIsError(true)
                setErrorMessage(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className='component-container'>
            <LoadingComponent flag={isLoading} />
            <div className='verificacion'>
                <button onClick={fingerPrintVerification}>
                    <img src={FingerSVG} alt="Fingerprint Icon"></img>
                </button>
                <button onClick={() => navigate('/verificacion/f')}>
                    <img src={FaceSVG} alt="Face ID Icon"></img>
                </button>
            </div>
        </div>
    );
};

export default Verificacion;