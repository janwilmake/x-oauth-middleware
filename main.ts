// You can either copy the middleware or install it and import from "smootherauth-x"
import { Env, html, middleware } from "./middleware";

export default {
  fetch: async (request: Request, env: Env) => {
    const response = await middleware(request, env);
    if (response) return response;
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie");
    const rows = cookie?.split(";").map((x) => x.trim());

    // Get Twitter access token from cookies
    const xAccessToken = rows
      ?.find((row) => row.startsWith("x_access_token="))
      ?.split("=")[1]
      ?.trim();

    const accessToken = xAccessToken || url.searchParams.get("apiKey");

    if (url.pathname === "/dashboard") {
      try {
        // Fetch user data from Twitter API
        const userResponse = await fetch(
          "https://api.x.com/2/users/me?user.fields=profile_image_url,most_recent_tweet_id&expansions=most_recent_tweet_id",

          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!userResponse.ok) {
          throw new Error(
            `X API error: ${userResponse.status} ${await userResponse.text()}`,
          );
        }

        const userData: any = await userResponse.json();
        const { name, username, profile_image_url } = userData.data;
        return new Response(
          html`
            <!DOCTYPE html>
            <html lang="en" class="bg-slate-900">
              <head>
                <meta charset="utf8" />
                <script src="https://cdn.tailwindcss.com"></script>
                <title>X User Dashboard</title>
                <style>
                  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
                  body {
                    font-family: "Inter", sans-serif;
                  }
                </style>
              </head>
              <body class="text-slate-100">
                <main class="max-w-6xl mx-auto px-4 py-16">
                  <div class="text-center mb-20">
                    <h1
                      class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                      X Dashboard
                    </h1>

                    <div
                      class="max-w-md mx-auto bg-slate-800 rounded-xl p-6 mb-8"
                    >
                      <div class="flex items-center gap-4">
                        <img
                          src="${profile_image_url}"
                          alt="Profile"
                          class="w-16 h-16 rounded-full"
                        />
                        <div class="text-left">
                          <h2 class="text-xl font-semibold">${name}</h2>
                          <p class="text-slate-400">@${username}</p>
                        </div>
                      </div>
                    </div>

                    <div class="flex justify-center gap-4">
                      <a
                        href="/"
                        class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Home
                      </a>
                      <a
                        href="/logout"
                        class="border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-500/10 transition-colors"
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                </main>
              </body>
            </html>
          `,
          { headers: { "content-type": "text/html" } },
        );
      } catch (error) {
        return new Response(
          html`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <title>Dashboard Error</title>
              </head>
              <body>
                <h1>Error Loading Dashboard</h1>
                <p>
                  ${error instanceof Error ? error.message : "Unknown error"}
                </p>
                <a href="/">Return Home</a>
              </body>
            </html>
          `,
          { status: 500, headers: { "content-type": "text/html" } },
        );
      }
    }
    return new Response(
      html`
        <!DOCTYPE html>
        <html lang="en" class="bg-black">
          <head>
            <meta charset="utf8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <script src="https://cdn.tailwindcss.com"></script>
            <title>X Login Demo - X OAuth 2.0 Implementation</title>
            <style>
              @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
              body {
                font-family: "Inter", sans-serif;
              }
              .x-gradient {
                background: linear-gradient(135deg, #000000 0%, #1d1d1d 100%);
              }
              .x-border {
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
            </style>
          </head>

          <body class="text-white">
            <main class="min-h-screen x-gradient">
              <div class="max-w-5xl mx-auto px-4 py-16">
                <!-- Hero Section -->
                <div class="text-center mb-20">
                  <div class="mb-8">
                    <svg
                      viewBox="0 0 24 24"
                      class="w-12 h-12 mx-auto"
                      fill="currentColor"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      />
                    </svg>
                  </div>
                  <h1 class="text-5xl font-bold mb-4">X Login Demo</h1>
                  <p class="text-xl text-gray-400 mb-8">
                    Secure OAuth 2.0 Implementation with PKCE for X/Twitter
                  </p>
                  <div class="flex justify-center gap-4">
                    <a
                      id="login"
                      href="${accessToken ? "/dashboard" : "/login"}"
                      class="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center gap-2"
                    >
                      ${accessToken ? "Go to Dashboard" : "Login with X"}
                    </a>
                    <a
                      href="https://github.com/janwilmake/xlogin"
                      target="_blank"
                      class="x-border hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      View Source
                    </a>
                  </div>
                </div>

                <!-- Features Grid -->
                <div class="grid md:grid-cols-3 gap-8 mb-20">
                  <div
                    class="x-border rounded-xl p-6 hover:bg-white/5 transition-colors"
                  >
                    <div class="text-blue-400 mb-4">
                      <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                        />
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Secure OAuth 2.0</h3>
                    <p class="text-gray-400">
                      PKCE implementation with encrypted cookies and CSRF
                      protection
                    </p>
                  </div>

                  <div
                    class="x-border rounded-xl p-6 hover:bg-white/5 transition-colors"
                  >
                    <div class="text-blue-400 mb-4">
                      <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">User Profile</h3>
                    <p class="text-gray-400">
                      Display X/Twitter profile information with protected
                      endpoints
                    </p>
                  </div>

                  <div
                    class="x-border rounded-xl p-6 hover:bg-white/5 transition-colors"
                  >
                    <div class="text-blue-400 mb-4">
                      <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">Cloudflare Workers</h3>
                    <p class="text-gray-400">
                      Edge-first implementation with zero cold starts
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div
                  class="text-center text-gray-500 border-t border-white/10 pt-12"
                >
                  <p class="text-sm">
                    Built with ❤️ using Cloudflare Workers. Not affiliated with
                    X Corp.
                  </p>
                </div>
              </div>
            </main>
          </body>
        </html>
      `,
      { headers: { "content-type": "text/html" } },
    );
  },
};
