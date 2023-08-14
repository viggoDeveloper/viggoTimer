     const fetchUserById = async () => {
            try {
                const db = firebase.queryCollection();
                const userRefCollection = db.collection('timeUser');
                const userRef = db.collection('users').doc(id);
                const snapshot =
                    await userRefCollection
                        .where('idUser', '==', userRef)
                        .where('timetype', 'in', ['Hora de Entrada', 'Hora De Salida'])
                        .orderBy('hour', 'desc')
                        .get();
                const userData = snapshot.docs.map((doc) => doc.data());
                setData(userData)

                const userTimerData = snapshot.docs.map((doc) => {
                    const {
                        brand,
                        campus,
                        city,
                        document,
                        email,
                        hour,
                        lastname,
                        name,
                        phone,
                        post,
                        reason,
                        timetype
                    } = doc.data();

                    const timestamp = hour;
                    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
                    const day = date.getDate();
                    const days = date.getDate();
                    const month = date.getMonth() + 1; // Sumamos 1 porque los meses en JavaScript son base 0
                    const year = date.getFullYear();
                    const options = { weekday: 'long' };
                    const formattedDate = date.toLocaleDateString('es-ES', options);

                    const hours = date.getHours();
                    const minutes = date.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
                    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
                    const formattedDateTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

                    return {
                        brand,
                        campus,
                        city,
                        email,
                        lastname,
                        document,
                        name,
                        phone,
                        post,
                        reason,
                        formattedDate,
                        formattedDateTime,
                        timetype: timetype,
                        day: `${day}/${month}/${year}`,
                    };
                });
                //setUserTimerData(userTimerData);
            } catch (error) {
                console.log('Error usuario no encontrado', error);
            }
        }