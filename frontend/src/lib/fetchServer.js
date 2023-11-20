import { supabase_client } from "./supabase-client";

export const fetchServer = async (input, init) => {
  const { data } = await supabase_client.auth.getSession();
  const session = data.session;

  init.headers = {
    ...init?.headers,
    "X-Access-Token": session?.access_token ?? "",
    "X-Refresh-Token": session?.refresh_token ?? "",
  };

  console.log(input);
  console.log(init);

  return await fetch(input, init);
};
