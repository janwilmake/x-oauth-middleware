/*
======X LOGIN SCRIPT========
This is the most simple version of x oauth.

To use it, ensure to create a x oauth client, then set .dev.vars and wrangler.toml alike with the Env variables required

And navigate to /login from the homepage, with optional parameters ?scope=a,b,c

In localhost this won't work due to your hardcoded redirect url; It's better to simply set your localstorage manually.
*/

export interface Env {
  X_CLIENT_ID: string;
  X_CLIENT_SECRET: string;
  X_REDIRECT_URI: string;
  CALLBACK_REDIRECT_URI: string;
}

export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  return strings.reduce(
    (result, str, i) => result + str + (values[i] || ""),
    "",
  );
};

async function generateRandomString(length: number): Promise<string> {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  //@ts-ignore
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const middleware = async (request: Request, env: Env) => {
  const url = new URL(request.url);
  const isLocalhost = url.hostname === "localhost";
  const securePart = isLocalhost ? "" : "Secure; ";
  if (
    !env.X_CLIENT_ID ||
    !env.X_CLIENT_SECRET ||
    !env.X_REDIRECT_URI ||
    !env.CALLBACK_REDIRECT_URI
  ) {
    return new Response(
      `Please ensure you have all environment variables set up: 
      
      
X_CLIENT_ID=YOUR_ID
X_CLIENT_SECRET=YOUR_SECRET
X_REDIRECT_URI = "https://yoursite.com/callback"
CALLBACK_REDIRECT_URI = "/dashboard"`,
      { status: 500 },
    );
  }
  if (url.pathname === "/logout") {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirect_to") || "/";
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectTo,
        "Set-Cookie": `x_access_token=; HttpOnly; ${securePart}SameSite=Lax; Max-Age=0; Path=/`,
      },
    });
  }
  // Login page route
  if (url.pathname === "/login") {
    const scope = url.searchParams.get("scope");
    const state = await generateRandomString(16);
    const codeVerifier = await generateRandomString(43);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const headers = new Headers({
      Location: `https://x.com/i/oauth2/authorize?response_type=code&client_id=${
        env.X_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        env.X_REDIRECT_URI,
      )}&scope=${encodeURIComponent(
        scope || "users.read follows.read tweet.read offline.access",
      )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`,
    });

    headers.append(
      "Set-Cookie",
      `x_oauth_state=${state}; HttpOnly; Path=/; ${securePart}SameSite=Lax; Max-Age=600`,
    );
    headers.append(
      "Set-Cookie",
      `x_code_verifier=${codeVerifier}; HttpOnly; Path=/; ${securePart}SameSite=Lax; Max-Age=600`,
    );

    return new Response("Redirecting", { status: 307, headers });
  }

  // Twitter OAuth callback route
  if (url.pathname === "/callback") {
    const urlState = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const cookie = request.headers.get("Cookie") || "";
    const cookies = cookie.split(";").map((c) => c.trim());

    const stateCookie = cookies
      .find((c) => c.startsWith("x_oauth_state="))
      ?.split("=")[1];
    const codeVerifier = cookies
      .find((c) => c.startsWith("x_code_verifier="))
      ?.split("=")[1];

    // Validate state and code verifier
    if (
      !urlState ||
      !stateCookie ||
      urlState !== stateCookie ||
      !codeVerifier
    ) {
      return new Response(
        `Invalid state or missing code verifier ${JSON.stringify({
          urlState,
          stateCookie,
          codeVerifier,
        })}`,
        {
          status: 400,
        },
      );
    }
    console.log({ stateCookie, urlState, codeVerifier });
    try {
      // Exchange code for access token
      const tokenResponse = await fetch(`https://api.x.com/2/oauth2/token`, {
        method: "POST",
        headers: {
          // Host: "api.x.com",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`,
          )}`,
        },
        body: new URLSearchParams({
          code: code || "",
          client_id: env.X_CLIENT_ID,
          grant_type: "authorization_code",
          redirect_uri: env.X_REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });
      const responseText = await tokenResponse.text();

      if (!tokenResponse.ok) {
        console.log("Response status:", tokenResponse.status);
        console.log(
          "Response headers:",
          Object.fromEntries(tokenResponse.headers.entries()),
        );
        console.log("Response body:", responseText);

        throw new Error(
          `Twitter API responded with ${tokenResponse.status} - ${responseText}`,
        );
      }

      const data: any = JSON.parse(responseText);
      const headers = new Headers({
        Location: url.origin + (env.CALLBACK_REDIRECT_URI || "/"),
      });

      const { access_token, refresh_token } = data;

      // NB: Here you can optionally retrieve the user or do other queries one-time. Beware of ratelimits on the free plan of X as they are very low.
      // For `/users/me` it's 25 per 24h per user so you shouldn't request this too often!
      // Another thing you can do here is set a KV to ensure we can verify the access_token. This way, you won't need to do it again.

      // try {
      //   const res = await fetch(
      //     "https://api.x.com/2/users/me?user.fields=profile_image_url",
      //     {
      //       headers: { Authorization: `Bearer ${access_token}` },
      //     },
      //   );
      //   const {
      //     data,
      //   }: {
      //     data: { name: string; username: string; profile_image_url: string };
      //   } = await res.json();

      // } catch {
      //   console.log("Could not get the data");
      // }

      // Set access token cookie and clear temporary cookies
      headers.append(
        "Set-Cookie",
        `x_access_token=${encodeURIComponent(
          access_token,
        )}; HttpOnly; Path=/; ${securePart}SameSite=Lax; Max-Age=34560000`,
      );
      if (refresh_token) {
        headers.append(
          "Set-Cookie",
          `x_refresh_token=${encodeURIComponent(
            refresh_token,
          )}; HttpOnly; Path=/; ${securePart}SameSite=Lax; Max-Age=34560000`,
        );
      }
      headers.append("Set-Cookie", `x_oauth_state=; Max-Age=0`);
      headers.append("Set-Cookie", `x_code_verifier=; Max-Age=0`);

      return new Response("Redirecting", { status: 307, headers });
    } catch (error) {
      return new Response(
        html`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <title>Login Failed</title>
            </head>
            <body>
              <h1>Twitter Login Failed</h1>
              <p>${error instanceof Error ? error.message : "Unknown error"}</p>
            </body>
          </html>
        `,
        {
          status: 500,
          headers: {
            "Content-Type": "text/html",
            "Set-Cookie": `x_oauth_state=; Max-Age=0, x_code_verifier=; Max-Age=0`,
          },
        },
      );
    }
  }
};
