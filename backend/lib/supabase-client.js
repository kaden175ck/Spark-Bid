const createClient = require("@supabase/supabase-js").createClient;
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase_client = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const supabaseMiddleware = async (req, res, next) => {
  const accessToken = req.headers["x-access-token"];
  const refreshToken = req.headers["x-refresh-token"];

  try {
    const { error } = supabase_client.auth.setSession(
      accessToken,
      refreshToken
    );
    if (error) return res.redirect("/login");
  } catch (err) {
    return res.redirect("/login");
  }

  next();
};

module.exports = {
  supabase_client,
  supabaseMiddleware,
};
