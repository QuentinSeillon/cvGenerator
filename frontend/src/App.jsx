import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../pages/Home';
import Login from '../pages/Login';

function App() {
  return (
    <div className="container-fluid vh-100">
      <div className="row">
        <Header />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
