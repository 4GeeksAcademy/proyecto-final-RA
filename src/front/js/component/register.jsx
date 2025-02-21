import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
// import "../../styles/register.css";
import "../../styles/components/_register.css"

const Register = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false); // Cambié el estado a false para que se vea "Iniciar sesión" por defecto
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lógica para login o registro
    const success = isRegister
      ? await actions.register(formData) // Registro
      : await actions.login(formData);   // Login

    if (success) {
      navigate('/private'); // Redirige al usuario después de registrarse o iniciar sesión
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="register-container"> {/* Contenedor principal */}
      <div className="form-container">
        <h2>{isRegister ? 'Registro' : 'Inicio de Sesión'}</h2>
        <form onSubmit={handleSubmit} className="form-control">
          <input
            type="email"
            className="input-field"
            onChange={handleChange}
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            required
          />
          <input
            type="password"
            className="input-field"
            onChange={handleChange}
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            required
          />
          <button type="submit" className="submit-btn-css styled-button">
            {isRegister ? 'Registrar' : 'Iniciar Sesión'}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>} 
        <button onClick={() => setIsRegister(!isRegister)} className="toggle-button">
          {isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
  );
};

export default Register;
