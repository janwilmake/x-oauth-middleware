======X LOGIN SCRIPT========
This is the most simple version of x oauth.

To use it, ensure to create a x oauth client, then set .dev.vars and wrangler.toml alike with the Env variables required

And navigate to /login from the homepage, with optional parameters ?scope=a,b,c

In localhost this won't work due to your hardcoded redirect url; It's better to simply set your localstorage manually.
