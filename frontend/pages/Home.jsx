import { useContext } from 'react';
import { UserContext } from '../context/UserContext.jsx'; // Assurez-vous que le chemin d'importation est correct

function Home() {
  const { getUserInfos } = useContext(UserContext); // Utilisez useContext pour accéder à UserContext
  const user = getUserInfos(); // Récupérez les infos de l'utilisateur

  return (
    <div>
      {user ? (
        <h1>Bienvenue, {user.nom}!</h1> // Affiche le nom de l'utilisateur connecté
      ) : (
        <h1>Bienvenue Inconnue.</h1> // Message si l'utilisateur n'est pas connecté
      )}
    </div>
  );
}

export default Home;
