import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

function Register() {
  const apiUrl = 'http://localhost:3000/api/user/register';
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{
        nom: '',
        prenom: '',
        email: '',
        password: ''
      }}
      onSubmit={async (values) => {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            navigate('/login', { replace: true });
          } else {
            const errorData = await response.json();
            console.log('Erreur dans le formulaire =>', errorData.error);
          }
        } catch (error) {
          console.log(error.message);
        }
      }}
      validationSchema={Yup.object({
        nom: Yup.string().required('Required'),
        prenom: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string().required('Required')
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="nom">Nom :</label>
            <Field className="form-control" type="nom" name="nom" />
            <ErrorMessage style={{ color: 'red' }} name="nom" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="prenom">Prenom :</label>
            <Field className="form-control" type="prenom" name="prenom" />
            <ErrorMessage style={{ color: 'red' }} name="prenom" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <Field className="form-control" type="email" name="email" />
            <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password :</label>
            <Field className="form-control" type="password" name="password" />
            <ErrorMessage style={{ color: 'red' }} name="password" component="div" />
          </div>
          <button className="btn btn-primary mt-3" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Register;
