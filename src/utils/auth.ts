export const getUserRole = (): string | null => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
  
    try {
      // JWT terdiri dari 3 bagian: Header, Payload, Signature (dipisah titik)
      // Kita ambil Payload (indeks ke-1), lalu decode Base64 (atob)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null; // Pastikan backend Go Anda menyertakan 'role' di dalam JWT claim
    } catch (error) {
      console.error("Gagal membaca token:", error);
      return null;
    }
  };