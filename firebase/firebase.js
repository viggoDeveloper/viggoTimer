import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(firebaseConfig)
    }
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
  }

  // Registra un usuario
  async registrar(
    nombre,
    email,
    password,
    apellido,
    document,
    selectedCity,
    cargo,
    telefono,
    selectSede,
    selectMarca,
    selectRol,
  ) {
    const date = dateTime();

    const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(email, password);
    const { user } = nuevoUsuario;

    await this.db.collection('users').doc(user.uid).set({
      brand: selectMarca,
      campus: selectSede,
      city: selectedCity,
      created_time: date,
      document: document,
      email: user.email,
      lastname: apellido,
      name: nombre,
      phone: telefono,
      //imageProfile: imageUrl,
      post: cargo,
      uid: user.uid,
      userRol: selectRol,
    });
  }

  // Inicia sesión del usuario
  async login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Cierra la sesión del usuario
  async cerrarSesion() {
    await this.auth.signOut();
  }

  // Consultar collection
  queryCollection() {
    return this.db;
  }
}

const firebase = new Firebase();
export default firebase;


const dateTime = () => {

  const str = '04/07/2023 06:45:12';
  const [dateComponents, timeComponents] = str.split(' ');

  const [month, day, year] = dateComponents.split('/');
  const [hours, minutes, seconds] = timeComponents.split(':');

  const date = new Date(
    +year,
    month - 1,
    +day,
    +hours,
    +minutes,
    +seconds,
  );
  return date;
}
