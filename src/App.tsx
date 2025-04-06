import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from "./pages/Inicio";  // Componente de inicio
import Registro from "./pages/registro/Registro";  // Componente de registro
import Verificacion from "./pages/verificacion/Verificacion";  // Componente de verificación
import Asistencia from "./pages/asistencia/Asistencia";  // Componente de verificación
import VerificacionFace from "./pages/verificacion/VerificacionFace";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthProvider } from './components/AuthProvider';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          />

          <Route
            path="/verificacion"
            element={
              <PublicRoute>
                <Verificacion />
              </PublicRoute>
            }
          />

          <Route
            path="/verificacion/f"
            element={
              <PublicRoute>
                <VerificacionFace />
              </PublicRoute>
            }
          />

          <Route
            path="/asistencia"
            element={
              <ProtectedRoute>
                <Asistencia />
              </ProtectedRoute>
            }
          />

          {/* <Route path="/asistencia" element={<Asistencia />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;


//! verificar un doble registro (quizas cuando ya este registrado (es decir en la asistencia) colocar un boton para agregar el embedding de la cara)