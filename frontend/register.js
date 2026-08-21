console.log("REGISTER.JS LOADED");

let auth0Client;


async function initAuth0() {

    console.log("Creating Auth0 client...");

    try {

        auth0Client =
            await auth0.createAuth0Client({

                domain:
                    "dev-1p1pnj4cvotiwki2.us.auth0.com",

                clientId:
                    "dyz1cLmqOJJrMpc0jQEB82gxFIAnyD0l",

                cacheLocation:
                    "localstorage",

                authorizationParams: {

                    audience:
                        "https://shopeasy-api",

                    redirect_uri:
                        "http://127.0.0.1:5500/frontend/register.html"

                }

            });


        console.log("Auth0 client created");


        const registerButton =
            document.getElementById(
                "registerButton"
            );


        registerButton.addEventListener(
            "click",
            async function () {

                console.log(
                    "CREATE ACCOUNT BUTTON CLICKED"
                );


                try {

                    await auth0Client.loginWithRedirect({

                        authorizationParams: {

                            screen_hint:
                                "signup"

                        }

                    });

                } catch (error) {

                    console.error(
                        "REGISTER ERROR:",
                        error
                    );

                }

            }
        );


        // ===============================
        // AUTH0 CALLBACK
        // ===============================

        if (
            window.location.search.includes("code=") &&
            window.location.search.includes("state=")
        ) {

            console.log(
                "REGISTER CALLBACK DETECTED"
            );


            await auth0Client.handleRedirectCallback();


            console.log(
                "ACCOUNT CREATED / LOGIN SUCCESS"
            );


            const user =
                await auth0Client.getUser();


            console.log(
                "USER:",
                user
            );


            document.getElementById(
                "registerMessage"
            ).textContent =
                "Account created successfully!";


            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );


            setTimeout(
                function () {

                    window.location.href =
                        "index.html";

                },
                1000
            );

        }


    } catch (error) {

        console.error(
            "AUTH0 INITIALIZATION ERROR:",
            error
        );

    }

}


initAuth0();