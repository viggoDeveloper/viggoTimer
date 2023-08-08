import React, { useState, useEffect, useContext } from "react";
import { css } from "@emotion/react";
import Router, { useRouter } from 'next/router';
import Layout from "@/components/Layout/Layout";
import { FirebaseContext } from "@/firebase";
import { Select } from "@/components/ui/Select";

import {
	FormularioCreate,
	Campo,
	InputSubmitCreate,
	Error
} from "@/components/ui/Formulario";

// validaciones
import useValidacion from "@/hooks/useValidacion";
import validarCrearCuenta from "@/validacion/validarCrearCuenta";

const STATE_INICIAL = {
	nombre: '',
	email: '',
	password: '',
	apellido: '',
	document: '',
	telefono: '',
	cargo: ''
}

const crearCuenta = () => {

	const router = useRouter();
	const { usuario, firebase } = useContext(FirebaseContext);

	const [selectedCity, setSelectedCity] = useState('');
	const [selectSede, setSelectedSede] = useState('');
	const [selectMarca, setSelectedMarca] = useState('');
	const [selectRol, setSelectedRol] = useState('');

	const handleCityChange = (event) => {
		setSelectedCity(event.target.value);
	};

	const handleSedeChange = (event) => {
		setSelectedSede(event.target.value);
	};
	const handleMarcaChange = (event) => {
		setSelectedMarca(event.target.value);
	};
	const handleRolChange = (event) => {
		setSelectedRol(event.target.value);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		console.log('file', file)
		setProfileImage(file);
	};

	const [error, guardarError] = useState(false);

	const {
		valores,
		errores,
		handleSubmit,
		handleChange,
		handleBlur
	} = useValidacion(
		STATE_INICIAL,
		validarCrearCuenta,
		crearCuenta
	);

	const { nombre, email, password, apellido, document, telefono, cargo } = valores;

	async function crearCuenta() {
		try {
			if (!usuario) {
				router.push('/')
			}

			await firebase.registrar(nombre, email, password, apellido, document, selectedCity, cargo, telefono, selectSede, selectMarca, selectRol);

			alert('Usuario Creado...')
	
		} catch (error) {
			console.error('Hubo un error al crear el usuario ', error.message);
			guardarError(error.message);
		}
	}

	return (
		<div>
			<Layout>
				<>
					<h1
						css={css`
                         text-align: center;
                         margin-top: 5rem;
                    `}
					>Crear Cuenta</h1>
					<FormularioCreate
						onSubmit={handleSubmit}
						noValidate
					>
						<Campo>
							<label htmlFor="email" >Email</label>
							<input
								type="email"
								id="email"
								placeholder="Correo"
								name="email"
								value={email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>
						{/* {errores.email && <Error>{errores.email}</Error>} */}
						<Campo>
							<label htmlFor="password" >Password</label>
							<input
								type="password"
								id="password"
								placeholder="Contraseña"
								name="password"
								value={password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>
						{/* {errores.password && <Error>{errores.password}</Error>} */}

						<Campo>
							<label htmlFor="nombre" >Nombre</label>
							<input
								type="text"
								id="nombre"
								placeholder="Nombre"
								name="nombre"
								value={nombre}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{/* {errores.nombre && <Error>{errores.nombre}</Error>} */}

						<Campo>
							<label htmlFor="apellido" >Apellido</label>
							<input
								type="text"
								id="apellido"
								placeholder="Apellido"
								name="apellido"
								value={apellido}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{/* {errores.apellido && <Error>{errores.apellido}</Error>} */}

						<Campo>
							<label htmlFor="document" >Documento</label>
							<input
								type="number"
								id="document"
								placeholder="Documento de identidad"
								name="document"
								value={document}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{/* {errores.document && <Error>{errores.document}</Error>} */}

						<Campo>
							<label htmlFor="ciudad" >Ciudad</label>
							<Select id="ciudad" name="ciudad" value={selectedCity} onChange={handleCityChange} >
								<option value="">--Selecciona una ciudad--</option>
								<option value="Cali">Cali</option>
								<option value="Bogota">Bogota</option>
								<option value="Barranquilla">Barranquilla</option>
								<option value="Cucuta">Cucuta</option>
								<option value="Cartagena">Cartagena</option>
								<option value="Bucaramanga">Bucaramanga</option>
								<option value="Ipiales">Ipiales</option>
							</Select>
						</Campo>

						{/* errores select ciudad */}


						<Campo>
							<label htmlFor="cargo" >Cargo</label>
							<input
								type="text"
								id="cargo"
								placeholder="Cargo"
								name="cargo"
								value={cargo}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{/* mostrar errores del cargo */}


						<Campo>
							<label htmlFor="telefono" >Telefono</label>
							<input
								type="text"
								id="telefono"
								placeholder="Telefono"
								name="telefono"
								value={telefono}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{/* mostrar errores del telefono */}

						<Campo>
							<label htmlFor="sede" >Sede</label>
							<Select id="sede" name="sede" value={selectSede} onChange={handleSedeChange}>
								<option value="">--Selecciona una sede--</option>
								<option value="C.C Gran San">C.C Gran San</option>
								<option value="C.C Visto">C.C Visto</option>
								<option value="C.C Lo Nuestro">C.C Lo Nuestro</option>
								<option value="C.C Shanghai">C.C Shanghai</option>
								<option value="C.C Zamoraco">C.C Zamoraco</option>
								<option value="C.C El Tesoro">C.C El Tesoro</option>
								<option value="C.C Colombia">C.C Colombia</option>
								<option value="Barrio Amberes">Barrio Amberes</option>
								<option value="C.C Alejandria">C.C Alejandria</option>
								<option value="C.C Khalifa">C.C Khalifa</option>
								<option value="C.C Zafiro">C.C Zafiro</option>
								<option value="C.C Mall Plaza Buenavista">C.C Mall Plaza Buenavista</option>
								<option value="C.C Caribe Plaza">C.C Caribe Plaza</option>
								<option value="C.C Mall Plaza NQS">C.C Mall Plaza NQS</option>
								<option value="Ofic. Viggo Group">Ofic. Viggo Group</option>
							</Select>
						</Campo>

						{/* errores select Sede */}

						<Campo>
							<label htmlFor="marca" >Marca</label>
							<Select id="marca" name="marca" value={selectMarca} onChange={handleMarcaChange}>
								<option value="">--Selecciona una Marca--</option>
								<option value="Tenfit">Tenfit</option>
								<option value="Tenfit Express">Tenfit Express</option>
								<option value="Atzi">Atzi</option>
								<option value="Coolvery">Coolvery</option>
								<option value="Viggo Group">Viggo Group</option>
							</Select>
						</Campo>

						{/* errores select Marca */}


						<Campo>
							<label htmlFor="marca" >Rol del usuario</label>
							<Select id="rol" name="rol" value={selectRol} onChange={handleRolChange}>
								<option value="">--Selecciona un Rol--</option>
								<option value="SuperAdmin">SuperAdmin</option>
								<option value="employee">employee</option>
							</Select>
						</Campo>

						{/* errores select Marca */}

						{/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}

						{error && <Error>{error} </Error>}

						<InputSubmitCreate
							type="submit"
							value="Crear Usuario"
						/>
					</FormularioCreate>
				</>
			</Layout>
		</div >
	)
}

export default crearCuenta;
