import React, { useContext, useState } from 'react';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import "../../styles/register.css"

const Register = () => {
  const { actions } = useContext(Context);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isRegister, setIsRegister] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isRegister
      ? await actions.register(formData)
      : await actions.login(formData);

    if (success) {
      navigate('/private');
    } else {
      setError('Usuario o contrasena incorrectos');
    }
  };

  return (
    <div className="register-container"> {/* Added class */}
      <div className="form-container">
        <h2>{isRegister ? 'Registro' : 'Inicio de Sesión'}</h2>
        <form onSubmit={handleSubmit} className="form-control">
          <input
            type="text"
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
          <button type="submit" className="submit-btn">
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