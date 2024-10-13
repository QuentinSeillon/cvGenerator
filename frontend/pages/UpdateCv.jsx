import { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function UpdateCv() {
  const { id } = useParams(); // Récupère l'ID du CV depuis l'URL
  const navigate = useNavigate();
  const apiURL = `http://localhost:3000/api/cv/${id}`; // URL pour récupérer le CV spécifique
  const updateURL = `http://localhost:3000/api/cv/update/${id}`; // URL pour mettre à jour le CV

  const [initialValues, setInitialValues] = useState({
    nom: '',
    prenom: '',
    description: '',
    experiencesPeda: [{ titre: '', description: '' }],
    experiencesPro: [{ titre: '', description: '' }],
    isVisible: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données du CV au chargement
  useEffect(() => {
    const fetchCv = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(apiURL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch CV');
        }

        const data = await response.json();
        setInitialValues(data); // Charger les valeurs initiales pour Formik
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCv();
  }, [apiURL]);

  if (loading) {
    return <p>Loading...</p>; // Affiche un message de chargement
  }

  if (error) {
    return <p>Error: {error}</p>; // Affiche une erreur si la requête échoue
  }

  // Validation Schema pour Formik avec Yup
  const validationSchema = Yup.object({
    nom: Yup.string().required('Required'),
    prenom: Yup.string().required('Required'),
    description: Yup.string().min(15, 'Description must be at least 15 characters').required('Required'),
    experiencesPeda: Yup.array()
      .of(
        Yup.object().shape({
          titre: Yup.string().required('Required'),
          description: Yup.string().min(10, 'Description must be at least 10 characters').required('Required')
        })
      )
      .min(1, 'At least one pedagogical experience is required'),
    experiencesPro: Yup.array()
      .of(
        Yup.object().shape({
          titre: Yup.string().required('Required'),
          description: Yup.string().min(10, 'Description must be at least 10 characters').required('Required')
        })
      )
      .min(1, 'At least one professional experience is required'),
    isVisible: Yup.boolean().required('Visibility is required')
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize={true}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(updateURL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
          });

          if (!response.ok) {
            throw new Error('Failed to update CV');
          }

          navigate('/my-cvs'); // Redirige après la mise à jour
        } catch (error) {
          setError(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="container">
            <h2 className="my-4">Modifier le CV</h2>

            <div className="form-group mb-3">
              <label htmlFor="nom">Nom :</label>
              <Field className="form-control" type="text" name="nom" />
              <ErrorMessage style={{ color: 'red' }} name="nom" component="div" />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="prenom">Prénom :</label>
              <Field className="form-control" type="text" name="prenom" />
              <ErrorMessage style={{ color: 'red' }} name="prenom" component="div" />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description">Description :</label>
              <Field className="form-control" type="text" name="description" />
              <ErrorMessage style={{ color: 'red' }} name="description" component="div" />
            </div>

            <div className="form-group mb-3 form-check">
              <Field type="checkbox" name="isVisible" className="form-check-input" />
              <label className="form-check-label" htmlFor="isVisible">
                Visible
              </label>
            </div>

            <h4 className="mt-4">Expériences Pédagogiques</h4>
            {values.experiencesPeda.map((exp, index) => (
              <div key={index} className="border p-3 mb-3">
                <div className="form-group">
                  <label htmlFor={`experiencesPeda.${index}.titre`}>Titre :</label>
                  <Field
                    className="form-control"
                    type="text"
                    name={`experiencesPeda.${index}.titre`}
                    placeholder="Titre"
                  />
                  <ErrorMessage name={`experiencesPeda.${index}.titre`} component="div" style={{ color: 'red' }} />
                </div>

                <div className="form-group">
                  <label htmlFor={`experiencesPeda.${index}.description`}>Description :</label>
                  <Field
                    className="form-control"
                    type="text"
                    name={`experiencesPeda.${index}.description`}
                    placeholder="Description"
                  />
                  <ErrorMessage
                    name={`experiencesPeda.${index}.description`}
                    component="div"
                    style={{ color: 'red' }}
                  />
                </div>

                <div className="form-group d-flex justify-content-around align-items-baseline mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setFieldValue('experiencesPeda', [...values.experiencesPeda, { titre: '', description: '' }]);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  {values.experiencesPeda.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        const newExperiencesPeda = values.experiencesPeda.filter((_, i) => i !== index);
                        setFieldValue('experiencesPeda', newExperiencesPeda);
                      }}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <h4 className="mt-4">Expériences Professionnelles</h4>
            {values.experiencesPro.map((exp, index) => (
              <div key={index} className="border p-3">
                <div className="form-group">
                  <label htmlFor={`experiencesPro.${index}.titre`}>Titre :</label>
                  <Field
                    className="form-control"
                    type="text"
                    name={`experiencesPro.${index}.titre`}
                    placeholder="Titre"
                  />
                  <ErrorMessage name={`experiencesPro.${index}.titre`} component="div" style={{ color: 'red' }} />
                </div>

                <div className="form-group">
                  <label htmlFor={`experiencesPro.${index}.description`}>Description :</label>
                  <Field
                    className="form-control"
                    type="text"
                    name={`experiencesPro.${index}.description`}
                    placeholder="Description"
                  />
                  <ErrorMessage name={`experiencesPro.${index}.description`} component="div" style={{ color: 'red' }} />
                </div>

                <div className="form-group d-flex justify-content-around align-items-baseline mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setFieldValue('experiencesPro', [...values.experiencesPro, { titre: '', description: '' }]);
                    }}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  {values.experiencesPro.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        const newExperiencesPro = values.experiencesPro.filter((_, i) => i !== index);
                        setFieldValue('experiencesPro', newExperiencesPro);
                      }}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button className="btn btn-primary mt-4" type="submit" disabled={isSubmitting}>
              Mettre à jour le CV
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UpdateCv;
