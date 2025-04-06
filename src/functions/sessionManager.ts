

export function saveSessionData(key: string, value: any) {
    const expirationTime = 10 * 60 * 1000; // 5 minutos en milisegundos
    const data = {
        value: value,
        timestamp: Date.now()
    };
    sessionStorage.setItem(key, JSON.stringify(data));

    // Elimina el dato después de 5 minutos
    setTimeout(() => {
        sessionStorage.removeItem(key);
    }, expirationTime);
}


export function getSessionData(key: string) {
    const data = sessionStorage.getItem(key);

    if (!data) return null; // Si no existe, devolver null

    const parsedData = JSON.parse(data);
    const currentTime = Date.now();
    const expirationTime = 5 * 60 * 1000; // 5 minutos en milisegundos

    // Verifica si ha expirado
    if (currentTime - parsedData.timestamp > expirationTime) {
        sessionStorage.removeItem(key); // Eliminar los datos expirados
        return null; // Los datos han expirado
    }

    return parsedData.value; // Los datos no han expirado
}

export function destroySession(key: string) {
    sessionStorage.removeItem(key);
}

