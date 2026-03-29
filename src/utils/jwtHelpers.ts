export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Safely mapping atob for both Browser and Node testing environments
    const decodedB64 = typeof window !== "undefined" ? window.atob(base64) : atob(base64);

    const jsonPayload = decodeURIComponent(
      decodedB64
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};
