import { Env, middleware } from "./simplerauth-x";

export default {
  fetch: async (request: Request, env: Env) => {
    const response = await middleware(request, env);
    if (response) return response;

    const url = new URL(request.url);
    const token =
      request.headers
        .get("Cookie")
        ?.split(";")
        .find((r) => r.includes("x_access_token"))
        ?.split("=")[1] || url.searchParams.get("apiKey");

    if (url.pathname === "/dashboard") {
      try {
        const res = await fetch(
          "https://api.x.com/2/users/me?user.fields=profile_image_url",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const {
          data: { name, username, profile_image_url },
        } = await res.json();

        return new Response(
          `<title>Dashboard</title><center><h1>X Dashboard</h1><img src="${profile_image_url}" width=64><h2>${name}</h2><p>@${username}</p><a href="/">Home</a> | <a href="/logout">Logout</a></center>`,
          { headers: { "content-type": "text/html" } },
        );
      } catch {
        return new Response(
          `<title>Error</title><h1>Error</h1><a href="/">Home</a>`,
          { status: 500, headers: { "content-type": "text/html" } },
        );
      }
    }

    return new Response(
      `<title>X Login</title><center><h1>X Login Demo</h1><p>OAuth 2.0 for X/Twitter</p><a href="${
        token ? "/dashboard" : "/login"
      }" style="background:#000;color:#fff;padding:10px;text-decoration:none">${
        token ? "Dashboard" : "Login with X"
      }</a><br><br><a href="https://github.com/janwilmake/x-oauth-middleware">GitHub</a></center>`,
      { headers: { "content-type": "text/html" } },
    );
  },
};
