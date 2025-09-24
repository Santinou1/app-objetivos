export function getApiUrl(){
    
    const hostname = window.location.hostname;

    console.log('HOSTNAME:', hostname);
    if (hostname === 'localhost') {
      // Estás en el entorno de desarrollo local
      let url = import.meta.env.VITE_API_URL || 'http://localhost:9000';
      console.log('LA URL DE LA API ES: ', url);
      console.log('VARIABLE DE ENTORNO: ',import.meta.env.VITE_API_URL) 
      return url;
    } else if (hostname === 'objetivos.americagroupsrl.com' ) {
      // Estás en la máquina virtual
      return 'http://objetivos.americagroupsrl.com:9000' || import.meta.env.VITE_API_URL;
    } else {
      return import.meta.env.VITE_API_URL || 'http://objetivos.americagroupsrl.com:9000';    
    }
}