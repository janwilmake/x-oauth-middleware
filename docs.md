OAuth 2.0
OAuth 2.0 Authorization Code Flow with PKCE
​
OAuth 2.0 Authorization Code Flow with PKCE

​
Introduction

OAuth 2.0 is an industry-standard authorization protocol that allows for greater control over an application’s scope, and authorization flows across multiple devices. OAuth 2.0 allows you to pick specific fine-grained scopes which give you specific permissions on behalf of a user.

To enable OAuth 2.0 in your App, you must enable it in your’s App’s authentication settings found in the App settings section of the developer portal.

​
How long will my credentials stay valid?

By default, the access token you create through the Authorization Code Flow with PKCE will only stay valid for two hours unless you’ve used the offline.access scope.

​
Refresh tokens

Refresh tokens allow an application to obtain a new access token without prompting the user via the refresh token flow.

If the scope offline.access is applied an OAuth 2.0 refresh token will be issued. With this refresh token, you obtain an access token. If this scope is not passed, we will not generate a refresh token.

An example of the request you would make to use a refresh token to obtain a new access token is as follows:

Copy

Ask AI
POST 'https://api.x.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'refresh_token=bWRWa3gzdnk3WHRGU1o0bmRRcTJ5VUxWX1lZTDdJSUtmaWcxbTVxdEFXcW5tOjE2MjIxNDc3NDM5MTQ6MToxOnJ0OjE' \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'client_id=rG9n6402A3dbUJKzXTNX4oWHJ
​
App settings

You can select your App’s authentication settings to be OAuth 1.0a or OAuth 2.0. You can also enable an App to access both OAuth 1.0a and OAuth 2.0.

OAuth 2.0 can be used with the X API v2 only. If you have selected OAuth 2.0 you will be able to see a Client ID in your App’s Keys and Tokens section.

​
Confidential Clients

Confidential clients can hold credentials in a secure way without exposing them to unauthorized parties and securely authenticate with the authorization server they keep your client secret safe. Public clients as they’re usually running in a browser or on a mobile device and are unable to use your client secrets. If you select a type of App that is a confidential client, you will be provided with a client secret.

If you selected a type of client that is a confidential client in the developer portal, you will also be able to see a Client Secret. Your options are Native App, Single page App, Web App, Automated App, or bot. Native App and Single page Apps are public clients and Web App and Automated App or bots are confidential clients.

You don’t need client id for confidential clients with a valid Authorization Header. You still are required to include Client Id in the body for the requests with a public client.

​
Scopes

Scopes allow you to set granular access for your App so that your App only has the permissions that it needs. To learn more about what scopes map to what endpoints, view our authentication mapping guide.

Scope Description
tweet.read All the Tweets you can view, including Tweets from protected accounts.
tweet.write Tweet and Retweet for you.
tweet.moderate.write Hide and unhide replies to your Tweets.
users.email Email from an authenticated user.
users.read Any account you can view, including protected accounts.
follows.read People who follow you and people who you follow.
follows.write Follow and unfollow people for you.
offline.access Stay connected to your account until you revoke access.
space.read All the Spaces you can view.
mute.read Accounts you’ve muted.
mute.write Mute and unmute accounts for you.
like.read Tweets you’ve liked and likes you can view.
like.write Like and un-like Tweets for you.
list.read Lists, list members, and list followers of lists you’ve created or are a member of, including private lists.
list.write Create and manage Lists for you.
block.read Accounts you’ve blocked.
block.write Block and unblock accounts for you.
bookmark.read Get Bookmarked Tweets from an authenticated user.
bookmark.write Bookmark and remove Bookmarks from Tweets.
media.write Upload media.
​
Rate limits

For the most part, the rate limits are the same as they are authenticating with OAuth 1.0a, with the exception of Tweets lookup and Users lookup. We are increasing the per-App limit from 300 to 900 requests per 15 minutes while using OAuth 2.0 for Tweet lookup and user lookup. To learn more be sure to check out our documentation on rate limits.

​
Grant types

We only provide authorization code with PKCE and refresh token as the supported grant types for this initial launch. We may provide more grant types in the future.

​
OAuth 2.0 Flow

OAuth 2.0 uses a similar flow to what we are currently using for OAuth 1.0a. You can check out a diagram and detailed explanation in our documentation on this subject.

​
Glossary

Term Description
Grant types The OAuth framework specifies several grant types for different use cases and a framework for creating new grant types. Examples include authorization code, client credentials, device code, and refresh token.
Confidential client Clients are applications that can securely authenticate with the authorization server, for example, keeping their registered client secret safe.
Public client Clients cannot use registered client secrets, such as applications running in a browser or mobile device.
Authorization code flow Used by both confidential and public clients to exchange an authorization code for an access token.
PKCE An extension to the authorization code flow to prevent several attacks and to be able to perform the OAuth exchange from public clients securely.
Client ID Can be found in the keys and tokens section of the developer portal under the header “Client ID.” If you don’t see this, please get in touch with our team directly. The Client ID will be needed to generate the authorize URL.
Redirect URI Your callback URL. You will need to have exact match validation.
Authorization code This allows an application to hit APIs on behalf of users. Known as the auth_code. The auth_code has a time limit of 30 seconds once the App owner receives an approved auth_code from the user. You will have to exchange it with an access token within 30 seconds, or the auth_code will expire.
Access token Access tokens are the token that applications use to make API requests on behalf of a user.
Refresh token Allows an application to obtain a new access token without prompting the user via the refresh token flow.
Client Secret If you have selected an App type that is a confidential client you will be provided with a “Client Secret” under “Client ID” in your App’s keys and tokens section.
​
Parameters

To construct an OAuth 2.0 authorize URL, you will need to ensure you have the following parameters in the authorization URL.

Parameter Description
response_type You will need to specify that this is a code with the word “code”.
client_id Can be found in the developer portal under the header “Client ID”.
redirect_uri Your callback URL. This value must correspond to one of the Callback URLs defined in your App’s settings. For OAuth 2.0, you will need to have exact match validation for your callback URL.
state A random string you provide to verify against CSRF attacks. The length of this string can be up to 500 characters.
code_challenge A PKCE parameter, a random secret for each request you make.
code_challenge_method Specifies the method you are using to make a request (S256 OR plain).
​
Authorize URL

With OAuth 2.0, you create an authorize URL, which you can use to allow a user to authenticate via an authentication flow, similar to “Sign In” with X.

An example of the URL you are creating is as follows:

Copy

Ask AI
https://x.com/i/oauth2/authorize?response_type=code&client_id=M1M5R3BMVy13QmpScXkzTUt5OE46MTpjaQ&redirect_uri=https://www.example.com&scope=tweet.read%20users.read%20account.follows.read%20account.follows.write&state=state&code_challenge=challenge&code_challenge_method=plain
You will need to have the proper encoding for this URL to work, be sure to check out our documentation on the percent encoding.

OAuth 2.0
How to connect to endpoints using OAuth 2.0 Authorization Code Flow with PKCE
​
How to connect to endpoints using OAuth 2.0 Authorization Code Flow with PKCE

​
How to connect to the endpoints

To authenticate your users, your App will need to implement an authorization flow. This authorization flow lets you direct your users to an authorization dialog on X. From there, the primary X experience will show the authorization dialog and handle the authorization on behalf of your App. Your users will be able to authorize your App or decline permission. After the user makes their choice, X will redirect the user to your App, where you can exchange the authorization code for an access token (if the user authorized your App), or handle a rejection (if the user did not authorize your App).

​
Working with confidential clients

If you are working with confidential clients, you will need to use a basic authentication scheme for generating an authorization header with base64 encoding while making requests to the token endpoints.

The userid and password are separated by a single colon (”:”) character within a base64 encoded string in the credentials.

An example would look like this:

-header 'Authorization: Basic V1ROclFTMTRiVWhwTWw4M2FVNWFkVGQyTldNNk1UcGphUTotUm9LeDN4NThKQThTbTlKSXQyZm1BanEzcTVHWC1icVozdmpKeFNlR3NkbUd0WEViUA=='

If the user agent wishes to send the Client ID “Aladdin” and password “open sesame,” it would use the following header field:

Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

To create the basic authorization header you will need to base64 encoding on your Client ID and Client Secret which can be obtained from your App’s “Keys and Tokens” page inside of the developer portal.

​
Steps to connect using OAuth 2.0

Step 1: Construct an Authorize URL

Your App will need to build an authorize URL to X, indicating the scopes your App needs to authorize. For example, if your App needs to lookup Tweets, users and to manage follows, it should request the following scopes:

tweet.read%20users.read%20follows.read%20follows.write

The URL will also contain the code_challenge and state parameters, in addition to the other required parameters. In production you should use a random string for the code_challenge.

Step 2: GET oauth2/authorize

Have the user authenticate and send the application an authorization code. If you have enabled OAuth 2.0 for your App you can find your Client ID inside your App’s “Keys and Tokens” page.

An example URL to redirect the user to would look like this:

Copy

Ask AI
https://x.com/i/oauth2/authorize?response_type=code&client_id=M1M5R3BMVy13QmpScXkzTUt5OE46MTpjaQ&redirect_uri=https://www.example.com&scope=tweet.read%20users.read%20follows.read%20follows.write&state=state&code_challenge=challenge&code_challenge_method=plain
An example URL with offline_access would look like this:

Copy

Ask AI
https://x.com/i/oauth2/authorize?response_type=code&client_id=M1M5R3BMVy13QmpScXkzTUt5OE46MTpjaQ&redirect_uri=https://www.example.com&scope=tweet.read%20users.read%20follows.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain
Upon successful authentication, the redirect_uri you would receive a request containing the auth_code parameter. Your application should verify the state parameter.

An example request from client’s redirect would be:

Copy

Ask AI
https://www.example.com/?state=state&code=VGNibzFWSWREZm01bjN1N3dicWlNUG1oa2xRRVNNdmVHelJGY2hPWGxNd2dxOjE2MjIxNjA4MjU4MjU6MToxOmFjOjE
Step 3: POST oauth2/token - Access Token

At this point, you can use the authorization code to create an access token and refresh token (only if offline.access scope is requested). You can make a POST request to the following endpoint:

Copy

Ask AI
https://api.x.com/2/oauth2/token
You will need to pass in the Content-Type of application/x-www-form-urlencoded via a header. Additionally, you should have in your request: code, grant_type, client_id and redirect_uri, and the code_verifier.

Here is an example token request for a public client:

Copy

Ask AI
curl --location --request POST 'https://api.x.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'code=VGNibzFWSWREZm01bjN1N3dicWlNUG1oa2xRRVNNdmVHelJGY2hPWGxNd2dxOjE2MjIxNjA4MjU4MjU6MToxOmFjOjE' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'client_id=rG9n6402A3dbUJKzXTNX4oWHJ' \
--data-urlencode 'redirect_uri=https://www.example.com' \
--data-urlencode 'code_verifier=challenge'
Here is an example using a confidential client:

Copy

Ask AI
curl --location --request POST 'https://api.x.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic V1ROclFTMTRiVWhwTWw4M2FVNWFkVGQyTldNNk1UcGphUTotUm9LeDN4NThKQThTbTlKSXQyZm1BanEzcTVHWC1icVozdmpKeFNlR3NkbUd0WEViUA=='\
--data-urlencode 'code=VGNibzFWSWREZm01bjN1N3dicWlNUG1oa2xRRVNNdmVHelJGY2hPWGxNd2dxOjE2MjIxNjA4MjU4MjU6MToxOmFjOjE' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'redirect_uri=https://www.example.com' \
--data-urlencode 'code_verifier=challenge'
Step 4: Connect to the APIs

You are now ready to connect to the endpoints using OAuth 2.0. To do so, you will request the API as you would using Bearer Token authentication. Instead of passing your Bearer Token, you’ll want to use the access token you generated in the last step. As a response, you should see the appropriate payload corresponding to the endpoint you are requesting. This request is the same for both public and confidential clients.

An example of the request you would make would look as follows:

Copy

Ask AI
curl --location --request GET 'https://api.x.com/2/tweets?ids=1261326399320715264,1278347468690915330' \
--header 'Authorization: Bearer Q0Mzb0VhZ0V5dmNXSTEyNER2MFNfVW50RzdXdTN6STFxQlVkTGhTc1lCdlBiOjE2MjIxNDc3NDM5MTQ6MToxOmF0OjE'
Step 5: POST oauth2/token - refresh token

A refresh token allows an application to obtain a new access token without prompting the user. You can create a refresh token by making a POST request to the following endpoint: https://api.x.com/2/oauth2/token You will need to add in the Content-Type of application/x-www-form-urlencoded via a header. In addition, you will also need to pass in your refresh_token, set your grant_type to be a refresh_token, and define your client_id.

This request will work for public clients:

Copy

Ask AI
POST 'https://api.x.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'refresh_token=bWRWa3gzdnk3WHRGU1o0bmRRcTJ5VUxWX1lZTDdJSUtmaWcxbTVxdEFXcW5tOjE2MjIxNDc3NDM5MTQ6MToxOnJ0OjE' \
--data-urlencode 'grant_type=refresh_token' \
--data-urlencode 'client_id=rG9n6402A3dbUJKzXTNX4oWHJ'
Here is an example of one for confidential clients:

Copy

Ask AI
POST 'https://api.x.com/2/oauth2/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic V1ROclFTMTRiVWhwTWw4M2FVNWFkVGQyTldNNk1UcGphUTotUm9LeDN4NThKQThTbTlKSXQyZm1BanEzcTVHWC1icVozdmpKeFNlR3NkbUd0WEViUA=='\
--data-urlencode 'refresh_token=bWRWa3gzdnk3WHRGU1o0bmRRcTJ5VUxWX1lZTDdJSUtmaWcxbTVxdEFXcW5tOjE2MjIxNDc3NDM5MTQ6MToxOnJ0OjE'\
--data-urlencode 'grant_type=refresh_token'
Step 6: POST oauth2/revoke - Revoke Token

A revoke token invalidates an access token or refresh token. This is used to enable a “log out” feature in clients, allowing you to clean up any security credentials associated with the authorization flow that may no longer be necessary. The revoke token is for an App to revoke a token and not a user. You can create a revoke token request by making a POST request to the following URL if the App wants to programmatically revoke the access given to it:

Copy

Ask AI
https://api.x.com/2/oauth2/revoke
You will need to pass in the Content-Type of application/x-www-form-urlencoded via a header, your token, and your client_id.

In some cases, a user may wish to revoke access given to an App, they can revoke access by visiting the connected Apps page.

Copy

Ask AI
curl --location --request POST 'https://api.x.com/2/oauth2/revoke' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'token=Q0Mzb0VhZ0V5dmNXSTEyNER2MFNfVW50RzdXdTN6STFxQlVkTGhTc1lCdlBiOjE2MjIxNDc3NDM5MTQ6MToxOmF0OjE' \
--data-urlencode 'client_id=rG9n6402A3dbUJKzXTNX4oWHJ'
This request will work for confidential clients:

Copy

Ask AI
curl --location --request POST 'https://api.x.com/2/oauth2/revoke' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Basic V1ROclFTMTRiVWhwTWw4M2FVNWFkVGQyTldNNk1UcGphUTotUm9LeDN4NThKQThTbTlKSXQyZm1BanEzcTVHWC1icVozdmpKeFNlR3NkbUd0WEViUA=='\
--data-urlencode 'token=Q0Mzb0VhZ0V5dmNXSTEyNER2MFNfVW50RzdXdTN6STFxQlVkTGhTc1lCdlBiOjE2MjIxNDc3NDM5MTQ6MToxOmF0OjE'
