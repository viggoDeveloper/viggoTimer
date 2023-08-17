// Definir las horas regulares trabajadas por día
const horasRegulares = {
  lunes: 9,
  martes: 9,
  miercoles: 9,
  jueves: 9,
  viernes: 9,
  sabado: 6
};

// Definir las horas extras trabajadas por día
const horasExtras = {
  sabado: 3 // En la primera semana
};

// Calcular horas regulares y extras para la primera semana
let totalHorasRegulares = 0;
let totalHorasExtras = 0;

for (const dia in horasRegulares) {
  totalHorasRegulares += horasRegulares[dia];
  if (horasExtras[dia]) {
    totalHorasExtras += horasExtras[dia];
  }
}

// Calcular horas regulares y extras para la segunda semana
// Modifica las horas extras para el segundo sábado
horasExtras.sabado = 2; // En la segunda semana

for (const dia in horasRegulares) {
  totalHorasRegulares += horasRegulares[dia];
  if (horasExtras[dia]) {
    totalHorasExtras += horasExtras[dia];
  }
}

// Calcular el total de horas de trabajo
const totalHorasTrabajo = totalHorasRegulares + totalHorasExtras;

// Imprimir resultados
console.log(`Total de horas regulares: ${totalHorasRegulares}`);
console.log(`Total de horas extras: ${totalHorasExtras}`);
console.log(`Total de horas de trabajo: ${totalHorasTrabajo}`);
