import { supabase_client } from "./supabase-client";

export const callServerDbHandler = async (options) => {
  return await fetchServer("http://localhost:3001/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  });
};

export const fetchServer = async (input, init) => {
  const { data } = await supabase_client.auth.getSession();
  const session = data.session;

  init.headers = {
    ...init?.headers,
    "X-Access-Token": session?.access_token ?? "",
    "X-Refresh-Token": session?.refresh_token ?? "",
  };

  return await fetch(input, init);
};
