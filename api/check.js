export default async function handler(req, res) {

  const { license, account } = req.query;

  const SUPABASE_URL = "TU_SUPABASE_URL";
  const SUPABASE_KEY = "TU_CLAVE_PUBLICABLE";

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/licenses?license_key=eq.${license}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await response.json();

  if (!data.length) {
    return res.status(200).json({
      valid: false,
      message: "Licencia no encontrada"
    });
  }

  const user = data[0];

  if (!user.active) {
    return res.status(200).json({
      valid: false,
      message: "Licencia desactivada"
    });
  }

  if (user.account_number !== account) {
    return res.status(200).json({
      valid: false,
      message: "Cuenta no autorizada"
    });
  }

  const today = new Date();
  const expiration = new Date(user.expires_at);

  if (today > expiration) {
    return res.status(200).json({
      valid: false,
      message: "Licencia expirada"
    });
  }

  return res.status(200).json({
    valid: true,
    message: "Licencia válida"
  });

}
