import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cv() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const apiURL = `${url}/cv`;
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [selectedCv, setSelectedCv] = useState(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]); // Nouvel état pour les recommandations

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userLocalStorage = localStorage.getItem('user');
      const currentUserId = JSON.parse(userLocalStorage)?.id;
      if (token) {
        setIsAuthenticated(true);
        setCurrentUserId(currentUserId);
      }
    };

    const fetchCvs = async () => {
      try {
        const response = await fetch(apiURL);
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

    checkAuth();
    fetchCvs();
  }, [apiURL]);

  const handleAddRecommendation = async () => {
    if (!newRecommendation || !selectedCv) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/cv/update/${selectedCv}/recommendation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newRecommendation })
      });

      if (!response.ok) {
        throw new Error('Failed to add recommendation');
      }

      setNewRecommendation('');
      setSelectedCv(null); // Reset selected CV
      document.getElementById('recommendationModal').classList.remove('show'); // Hide modal
    } catch (error) {
      console.error(error);
    }
  };

  const openRecommendationModal = (recommandations) => {
    console.log('openRecommendationModal => ', recommandations);

    setSelectedRecommendations(recommandations);

    document.getElementById('viewRecommendationsModal').classList.add('show'); // Show modal
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const visibleCvs = cvs.filter(
    (cv) =>
      cv.isVisible &&
      ((cv.user && cv.user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cv.user && cv.user.prenom.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom ou prénom"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-evenly flex-wrap">
        {visibleCvs.map((cv) => (
          <div key={cv._id} className="col-4 mb-4">
            <div className="card overflow-scroll" style={{ width: '300px', height: '400px', position: 'relative' }}>
              <div
                className="position-absolute top-0 start-0 bg-danger text-white p-2"
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                {cv.user ? `${cv.user.nom} ${cv.user.prenom}` : 'Utilisateur inconnu'}
              </div>

              <div
                className="position-absolute top-0 end-0 bg-success text-white p-2"
                style={{ borderRadius: '5px 0 0 5px', cursor: 'pointer' }} // Ajout du curseur pointer
                onClick={() => openRecommendationModal(cv.recommandations)} // Ouvrir la modale
              >
                {cv.recommandations && cv.recommandations.length > 0 ? cv.recommandations.length : 0}
              </div>

              <div className="card-body d-flex flex-column justify-content-between align-items-center gap-1">
                <h5 className="card-title">
                  {cv.nom} {cv.prenom}
                </h5>
                <p className="card-text">{cv.description}</p>

                {isAuthenticated && (
                  <>
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

                    {currentUserId !== cv.user?._id && (
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => {
                          setSelectedCv(cv._id);
                          document.getElementById('recommendationModal').classList.add('show'); // Show modal
                        }}
                      >
                        Ajouter une recommandation
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Boîte modale pour lire les recommandations */}
      <div
        className="modal fade show"
        id="viewRecommendationsModal"
        tabIndex="-1"
        style={{ display: selectedRecommendations.length > 0 ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Recommandations</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedRecommendations([])}></button>
            </div>
            <div className="modal-body">
              {selectedRecommendations.length > 0 ? (
                <ul className="list-group">
                  {selectedRecommendations.map((rec, index) => (
                    <li key={index} className="list-group-item">
                      {rec.contenu} {/* Changez 'text' selon la structure de votre recommandation */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Aucune recommandation disponible.</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedRecommendations([])}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Boîte modale pour ajouter une recommandation */}
      <div
        className="modal fade show"
        id="recommendationModal"
        tabIndex="-1"
        style={{ display: selectedCv ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter une recommandation</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedCv(null)}></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                placeholder="Écrire votre recommandation ici..."
                value={newRecommendation}
                onChange={(e) => setNewRecommendation(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedCv(null)}>
                Annuler
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddRecommendation}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay sombre pour les modales */}
      {(selectedCv || selectedRecommendations.length > 0) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default Cv;
