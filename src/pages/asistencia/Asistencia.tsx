import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TZDate } from "@date-fns/tz";
import { format, addSeconds } from "date-fns";
import { es } from "date-fns/locale";
import LoadingComponent from '../../components/LoadingComponent';
import { destroySession } from '../../functions/sessionManager';


const base = import.meta.env.VITE_BASE_BACKEND_URL
const update_assistance_url = base + "/v1/update-assistance"
const decrypt_token_url = base + "/v1/decrypt-data"

const Asistencia: React.FC = () => {
    const date = new Date();
    const now = new TZDate(date, "America/Lima");
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const [payload, setPayload] = useState<any>(null);
    const [nombre, setNombre] = useState("");
    const [dni, setDni] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentDate, setCurrentDate] = useState(now);

    const [isVisible, setIsVisible] = useState(true);


    const midnight = new Date(currentDate);
    midnight.setHours(0, 0, 0, 0);

    useEffect(() => {
        const verifyToken = async (jwt: string) => {
            try {
                setIsLoading(true);
                const response = await fetch(decrypt_token_url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "token": jwt
                    }),
                });
                const responseData = await response.json();

                if (!response.ok) {
                    const error_message = responseData.content.message ?? ""
                    console.log("Respuesta del servidor:", error_message);
                    sessionStorage.removeItem("authToken")
                    alert(error_message)
                    navigate(`/`)
                    return
                }

                setPayload({
                    "nombre": responseData.content.nombre,
                    "dni": responseData.content.dni,
                })

            } catch (error) {
                console.error("Error al verificar el token", error);
                navigate(`/`);
            } finally {
                setIsLoading(false);
            }
        }

        const jwt = params.get('token');
        if (jwt) {
            verifyToken(jwt)
        } else {
            navigate(`/`);
        }
    }, [])

    useEffect(() => {
        if (payload) {
            setNombre(payload.nombre);
            setDni(payload.dni);
        }
    }, [payload]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate((prev) => {
                return addSeconds(prev, 1);
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const midnight = new Date(currentDate);
        midnight.setHours(0, 0, 0, 0);

        const threeAM = new Date(currentDate);
        threeAM.setHours(3, 0, 0, 0);

        if (currentDate > midnight && currentDate < threeAM) {
            let adjustedDate = new TZDate(currentDate, "America/Lima");
            adjustedDate.setDate(new TZDate(currentDate, "America/Lima").getDate() - 1);
            setIsVisible(false)
        }
    }, [currentDate]);

    const updateAssistance = async (evento: string) => {
        setIsLoading(true)
        const hora = format(currentDate, 'p', { locale: es })
        const midnight = new Date(currentDate);
        midnight.setHours(0, 0, 0, 0);

        const threeAM = new Date(currentDate);
        threeAM.setHours(3, 0, 0, 0);

        let fecha = format(currentDate, 'P', { locale: es });

        if (evento === "salida" && currentDate > midnight && currentDate < threeAM) {
            let adjustedDate = new TZDate(currentDate, "America/Lima");
            adjustedDate.setDate(new TZDate(currentDate, "America/Lima").getDate() - 1);
            fecha = format(adjustedDate, 'P', { locale: es });
        }

        const data = {
            "dni": dni.toString(),
            "nombre": nombre,
            "evento": evento,
            "fecha": fecha,
            "hora": hora
        }

        try {
            const response = await fetch(update_assistance_url, {
                method: 'POST',  // Método POST
                headers: {
                    'Content-Type': 'application/json', // Indicamos que el contenido es JSON
                },
                body: JSON.stringify(data), // Convertimos los datos a formato JSON
            });
            if (!response.ok) {
                const responseData = await response.json();
                console.log("Respuesta del servidor:", responseData);
                throw new Error(responseData.message);
            }

        } catch (error) {
            console.error(error);
            alert(error);
        } finally {
            setIsLoading(false)
        }
    };




    return (
        <div style={{
            margin: "auto",
            maxWidth: "300px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            alignItems: "center",
        }}>
            <LoadingComponent flag={isLoading} />
            <div style={{
                margin: "auto",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px"
            }}>
                <h1 style={{
                    fontSize: "32px",
                    textAlign: "center",
                    margin: "0",
                    lineHeight: "1.5"
                }}>
                    {nombre}
                </h1>
                <h2 style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    margin: "0",
                    fontWeight: "400"
                }}>
                    {format(currentDate, 'pp', { locale: es })}
                </h2>
                <h4 style={{
                    fontSize: "1.5rem",
                    textAlign: "center",
                    margin: "0",
                    fontWeight: "400"
                }}>
                    {format(currentDate, 'PPPP', { locale: es })}
                </h4>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                    width: "100%",
                    margin: "auto",
                }}
            >
                <button
                    className="check-assistance-btn"
                    style={{ display: isVisible ? 'block' : 'none' }}
                    onClick={() => updateAssistance("entrada")}>
                    Entrada
                </button>
                <button
                    className="check-assistance-btn"
                    // style={{ display: isVisible ? 'block' : 'none' }}
                    onClick={() => updateAssistance("salida")}>
                    Salida
                </button>
                <button
                    className="check-assistance-btn"
                    style={{ display: isVisible ? 'block' : 'none' }}
                    onClick={() => updateAssistance("descanso_inicio")}>
                    Inicio Descanso
                </button>
                <button
                    className="check-assistance-btn"
                    style={{ display: isVisible ? 'block' : 'none' }}
                    onClick={() => updateAssistance("descanso_fin")}>
                    Fin Descanso
                </button>
                <button className="check-assistance-btn red" onClick={() => {
                    destroySession("authToken")
                    navigate(`/`)
                }}>Salir</button>
            </div>
        </div>
    );
};

export default Asistencia;