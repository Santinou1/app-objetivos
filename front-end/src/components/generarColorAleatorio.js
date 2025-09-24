
export const generarColorAleatorio = () => {
    const r = Math.floor(Math.random() * 256); // Valor rojo aleatorio
    const g = Math.floor(Math.random() * 256); // Valor verde aleatorio
    const b = Math.floor(Math.random() * 256); // Valor azul aleatorio
  
    // Para hacer el color pastel, combinamos los valores RGB con blanco
    const factor = 0.7
    const pastelR =  Math.floor((r * factor) + (200 * (1 - factor)));
    const pastelG = Math.floor((g * factor) + (200 * (1 - factor)));
    const pastelB = Math.floor((b * factor) + (200 * (1 - factor)));
  
    return `rgb(${pastelR}, ${pastelG}, ${pastelB})`;
  };
