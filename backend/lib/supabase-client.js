const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

const supabaseMiddleware = async (req, res, next) => {
    const accessToken = req.headers["x-access-token"];

    if (!accessToken) {
        return res.status(401).json({ error: "Access token is required" });
    }

    try {
        const { user, error } = await supabase.auth.api.getUser(accessToken);
        
        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired access token" });
        }

        // Add user information to the request object
        req.user = user;

        next();
    } catch (err) {
        console.error("Error in supabaseMiddleware:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    supabase,
    supabaseMiddleware,
};