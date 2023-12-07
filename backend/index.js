// console.log("Hello, world!");

// Load environment variables
require("dotenv").config();
const cookieParser = require("cookie-parser");

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const bodyParser = require("body-parser");

const app = express();

// Import itemRoutes
const { supabaseMiddleware } = require("./lib/supabase-client");

const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(supabaseMiddleware);

console.log("Starting server...");

app.post("/api/data", async (req, res) => {
  const {
    storage,
    from,
    delete: del,
    insert,
    update,
    select,
    upsert,
    remove,
    upload,
    eq,
  } = req.body;
  // console.log(storage, from, select, upsert, remove, upload);
  if (storage) {
    if (remove) {
      return res
        .status(200)
        .json(await supabase.storage.from(from).remove(remove));
    }
  } else {
    if (update && eq) {
      return res.status(200).json(
        await supabase
          .from(from)
          .update(update)
          .eq(...eq)
      );
    }
    if (insert) {
      return res.status(200).json(await supabase.from(from).insert(insert));
    }
    if (del) {
      return res.status(200).json(
        await supabase
          .from(from)
          .delete()
          .eq(...eq)
      );
    }
    if (upsert && select) {
      return res
        .status(200)
        .json(await supabase.from(from).upsert(upsert).select());
    }
    if (select) {
      return res.status(200).json(await supabase.from(from).select(select));
    }
  }
  console.log(from, select);
  return res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
