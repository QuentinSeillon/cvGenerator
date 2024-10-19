import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreateCv from '../pages/CreateCv';
import Cv from '../pages/Cv';
import MyCv from '../pages/MyCv';
import UpdateCv from '../pages/UpdateCv';

function App() {  
  return (
    <div className="container-fluid vh-100 vw-100">
      <div className="row">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-cv" element={<CreateCv />} />
        <Route path="/all-cv" element={<Cv />} />
        <Route path="/my-cvs" element={<MyCv />} />
        <Route path="/edit-cv/:id" element={<UpdateCv />} />
      </Routes>
    </div>
  );
}

export default App;
