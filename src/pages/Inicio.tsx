import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inicio: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/registro');
  };

  const handleVerify = () => {
    navigate('/verificacion');
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // Centra verticalmente
          alignItems: "center", // Centra horizontalmente
          margin: "auto",
          width: "100%",
          maxWidth: "400px",
          height: "300px", // Ajusta según necesidad
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Sombra sutil
          color: "white",
          textAlign: "center",
          backgroundColor: "#242424",
          gap: "12px"
        }}
      >
        <h1>Hola</h1>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <button onClick={handleRegister} style={{width: "300px"}}>Registrar</button>
          <button onClick={handleVerify} style={{width: "300px"}}>Validar</button>
        </div>
      </div>
    </>
  );
};

export default Inicio;
