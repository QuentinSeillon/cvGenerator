import { useContext } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { UserContext } from '../context/UserContext.jsx';

function Login() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const apiUrl = `${url}/auth/login`;
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  return (
    <Formik
      initialValues={{
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

          if (response.status === 200) {
            const data = await response.json();
            console.log('data dans Login.jsx => ', data);
            login(data);
            navigate('/', { replace: true });
          } else {
            const errorData = await response.json();
            console.log(errorData.error);
          }
        } catch (error) {
          console.log(error.message);
        }
      }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string().required('Required')
      })}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <Field className="form-control" type="email" name="email" />
            <ErrorMessage style={{ color: 'red' }} name="email" component="div" />
          </div>
          <div className="form-group">
            <label htmlFor="login">Password :</label>
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

export default Login;
