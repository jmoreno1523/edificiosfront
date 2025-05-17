import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Auditorios = () => {
  const [edificios, setEdificios] = useState([]);
  const [edificioSeleccionado, setEdificioSeleccionado] = useState('');
  const [auditorios, setAuditorios] = useState([]);
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEdificios([
      'Almendros',
      'Cedro Rosado',
      'Educación Continua',
      'Guaduales',
      'Guayacanes',
      'Lago',
      'Palmas',
      'Samán'
    ]);
  }, []);

  useEffect(() => {
    if (edificioSeleccionado) {
      axios.get(`http://localhost:5000/api/edificios/${edificioSeleccionado}`)
        .then(res => setAuditorios(res.data))
        .catch(err => {
          console.error("❌ Error cargando auditorios:", err);
          setAuditorios([]);
        });
    } else {
      setAuditorios([]);
    }
  }, [edificioSeleccionado]);

  const handleSeleccionAuditorio = (e) => {
    const id = e.target.value;
    navigate(`/auditorio/${encodeURIComponent(edificioSeleccionado)}/${id}`);
  };

  const consultarChatGPT = async () => {
    if (!pregunta.trim()) {
      setRespuesta("Por favor escribe una pregunta.");
      return;
    }
    try {
      const res = await axios.post('https://edificios-back-psi.vercel.app/api/chatgpt', {
        pregunta,
        edificio: edificioSeleccionado || undefined
      });
      setRespuesta(res.data.respuesta);
    } catch (err) {
      console.error("❌ Error al consultar ChatGPT:", err);
      setRespuesta("Error al obtener respuesta de la IA.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Consulta de Auditorios por Edificio</h2>

      <select onChange={e => setEdificioSeleccionado(e.target.value)} defaultValue="" className="select">
        <option value="">Todos los edificios</option>
        {edificios.map(ed => (
          <option key={ed} value={ed}>{ed}</option>
        ))}
      </select>

      {Array.isArray(auditorios) && auditorios.length > 0 && (
        <select onChange={handleSeleccionAuditorio} defaultValue="" className="select">
          <option value="" disabled>Selecciona un auditorio</option>
          {auditorios.map(a => (
            <option key={a._id} value={a._id}>{a.nombre}</option>
          ))}
        </select>
      )}

      <div className="chat-box">
        <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>¿Tienes dudas? Pregúntale a la IA:</h4>

        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ejemplo: ¿Cuál auditorio tiene mayor capacidad?"
          rows={4}
        />

        <button onClick={consultarChatGPT}>Consultar</button>

        {respuesta && (
          <div className="response-box">
            <strong>Respuesta:</strong>
            <p>{respuesta}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auditorios;
