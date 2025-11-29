const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://jfmbaorvlwffnzylxoli.supabase.co",
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = supabase;
