console.log("LOGIN.JS LOADED");

let auth0Client;

async function initAuth0() {

    console.log("Creating Auth0 client...");

    try {

        auth0Client = await auth0.createAuth0Client({

            domain: "dev-1p1pnj4cvotiwki2.us.auth0.com",

            clientId: "dyz1cLmqOJJrMpc0jQEB82gxFIAnyD0l",

            cacheLocation: "localstorage",

            authorizationParams: {

                audience: "https://shopeasy-api",

                redirect_uri:
                    "http://127.0.0.1:5500/frontend/login.html"
            }

        });

        console.log("Auth0 client created");


        const loginButton =
            document.getElementById("loginButton");


        loginButton.addEventListener(
            "click",
            async function () {

                console.log("LOGIN BUTTON CLICKED");

                try {

                    await auth0Client.loginWithRedirect();

                } catch (error) {

                    console.error(
                        "LOGIN ERROR:",
                        error
                    );

                }

            }
        );


        // Handle Auth0 callback
        if (
            window.location.search.includes("code=") &&
            window.location.search.includes("state=")
        ) {

            console.log("AUTH0 CALLBACK DETECTED");

            await auth0Client.handleRedirectCallback();

            console.log("LOGIN SUCCESS");

            const user =
                await auth0Client.getUser();

            console.log("USER:", user);     

            document.getElementById(
                "loginMessage"
            ).textContent =
                "Login successful!";

            // Remove ?code=...&state=...
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );

            setTimeout(function () {

                window.location.href =
                    "index.html";

            }, 1000);
        }


    } catch (error) {

        console.error(
            "AUTH0 INITIALIZATION ERROR:",
            error
        );

    }

}

initAuth0();