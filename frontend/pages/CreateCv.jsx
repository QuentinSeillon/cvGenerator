import { useContext } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';

function CreateCv() {
  const apiUrl = 'http://localhost:3000/api/cv/create';
  const navigate = useNavigate();
  const { getUserInfos } = useContext(UserContext);

  // Vérifier si l'utilisateur est connecté
  const user = getUserInfos();

  console.log('user Dans CreateCv.jsx => ', user);

  if (!user) {
    // Afficher un message si l'utilisateur n'est pas connecté
    return <h1>Please log in to create a CV</h1>;
  }

  return (
    <Formik
      initialValues={{
        nom: '',
        prenom: '',
        description: '',
        experiencesPeda: [{ titre: '', description: '' }],
        experiencesPro: [{ titre: '', description: '' }],
        isVisible: false
      }}
      onSubmit={async (values) => {
        try {
          const token = localStorage.getItem('token');
          console.log('token => ', token);

          if (!token) {
            console.error('Token is missing'); // Debugging
          }

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(values)
          });

          if (response.ok) {
            navigate('/'); // Rediriger vers la page d'accueil après un ajout réussi
          } else {
            const errorData = await response.json();
            console.log('Error creating CV:', errorData.error);
          }
        } catch (error) {
          console.log(error.message);
        }
      }}
      validationSchema={Yup.object({
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
      })}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <div className="container">
            <h2 className="my-4">Créer un CV</h2>

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

                <div className="form-group d-flex  justify-content-around align-items-baseline mt-3">
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

            <button className="btn btn-primary mt-3" type="submit" disabled={isSubmitting}>
              Soumettre
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateCv;
