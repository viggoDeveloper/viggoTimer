import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleImageUpload = async () => {
    try {
      if (profileImage) {
        // Subir la imagen a Firebase Storage
        const storageRef = firebase.storage().ref();
        const imageRef = storageRef.child(`profile_images/${profileImage.name}`);
        await imageRef.put(profileImage);

        // Obtener la URL de descarga de la imagen almacenada
        const imageUrl = await imageRef.getDownloadURL();

        // Obtener el ID del usuario logueado (puedes usar el mismo método que se mostró antes)
        const userId = 'ID_DEL_USUARIO_LOGUEADO';

        // Actualizar el campo "imageProfile" del usuario en Firestore con la URL de la imagen
        await firebase.firestore().collection('users').doc(userId).update({
          imageProfile: imageUrl,
        });
      }
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
    }
  };

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleImageUpload}>Subir Imagen</button>
    </div>
  );
};

export default ProfilePage;
