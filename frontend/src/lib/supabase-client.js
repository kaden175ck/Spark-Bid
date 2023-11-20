import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.REACT_APP_SUPABASE_SECRET_KEY;

export const supabase_client = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
