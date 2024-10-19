import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assure-toi d'importer Bootstrap

function Cv() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const apiURL = `${url}/cv/my-cvs`; // Assure-toi que cette route est correcte
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCvs = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token => ', token);

        if (!token) {
          console.error('Token is missing'); // Debugging
        }

        const response = await fetch(apiURL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CVs');
        }

        const data = await response.json();
        setCvs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCvs();
  }, [apiURL]);

  const handleEdit = (id) => {
    navigate(`/edit-cv/${id}`);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token is missing'); // Debugging
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      try {
        const response = await fetch(`${url}/cv/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete CV');
        }

        // Met à jour la liste des CV après la suppression
        setCvs((prevCvs) => prevCvs.filter((cv) => cv._id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Affiche un message de chargement
  }

  if (error) {
    return <p>Error: {error}</p>; // Affiche une erreur si la requête échoue
  }

  return (
    <div className="container mt-4">
      <h1 className="my-4">Mes CVs</h1>
      <div className="d-flex justify-content-evenly flex-wrap">
        {cvs.map((cv) => (
          <div key={cv._id} className="col-4 mb-4">
            <div className="card overflow-scroll" style={{ width: '300px', height: '400px', position: 'relative' }}>
              {/* Bandeau rouge avec le nom de l'utilisateur */}
              <div
                className="position-absolute top-0 start-0 bg-danger text-white p-2"
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                {cv.user ? `${cv.user.nom} ${cv.user.prenom}` : 'Utilisateur inconnu'}{' '}
                {/* Affiche le nom de l'utilisateur */}
              </div>
              <div className="card-body d-flex flex-column justify-content-between align-items-center gap-1">
                <h5 className="card-title">
                  {cv.nom} {cv.prenom}
                </h5>
                <p className="card-text">{cv.description}</p>

                <hr className="my-2 w-100" />

                <h6>Expériences Pédagogiques:</h6>
                {cv.experiencesPeda.map((exp, index) => (
                  <div key={index}>
                    <strong>{exp.titre}:</strong> {exp.description}
                  </div>
                ))}

                <hr className="my-4 w-100" />

                <h6>Expériences Professionnelles:</h6>
                {cv.experiencesPro.map((exp, index) => (
                  <div key={index}>
                    <strong>{exp.titre}:</strong> {exp.description}
                  </div>
                ))}

                <button className="btn btn-primary mt-3" onClick={() => handleEdit(cv._id)}>
                  Modifier le CV
                </button>
                <button className="btn btn-danger mt-3" onClick={() => handleDelete(cv._id)}>
                  Supprimer le CV
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cv;
