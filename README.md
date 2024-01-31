# Dokumentation av vår Auth-server

> ## server.js
>
> I auth-servern har vi lagt all vår säkerhet.
> Vi har implementerat jsonwebtoken för autentisering, vilket innebär att vi kontrollerar användarnamn och lösenord innan vi skickar med en token till backend för verifiering och auktorisering.

I vår server.js-fil har vi lagt till Helmet för att förbättra säkerheten, eftersom det hjälper till att skydda applikationen mot attacker. Vi har även säkrat upp följande:

### Frameguard:

För att förhindra Clickjacking (förhindrar angripare från att lura användare att klicka på något annat än vad de tror att de klickar på).

### XSS (Cross-Site Scripting):

Minskar risken för att skadlig kod injiceras.

### MIME-sniffing:

Förhindrar potentiella säkerhetsrisker och missbruk av hur webbläsare tolkar och visar olika typer av filer.

### Referrer Leakage:

Används för att kontrollera hur webbläsaren delar information om refererande sidor när en användare navigerar från en webbsida till en annan.

### CSP (Content Security Policy):

För att förhindra skadlig kod, t.ex. skript, från att köras på webbplatsen. För att stärka upp detta, eftersom det kan bli ett säkerhetsproblem, har vi även lagt till extra säkerhet specifikt för CSP.

Utöver Helmet använder vi även Cors (Cross-Origin Resource Sharing) för att möjliggöra säker informationsöverföring samt Cookie-Parser, som hjälper till med skapandet av cookies.

> ## auth_router.js
>
> I vår auth_routes.js-fil har vi lagt till CORS-hantering som tillåter anrop från localhost:3000 och möjliggör användningen av autentiseringsuppgifter genom att sätta Access-Control-Allow-Credentials till true.

Vi har även lagt till:

> JWT-Cookie som hanterar Cross-Origin Resource Sharing (CORS) och som skapar en HTTP-cookie för JWT-token.

> En utgångstid på 1 timme vilket begränsar giltighetstiden för token och ökar säkerheten.

> En autentiserings-middleware som verifierar JWT-token innan åtkomst till skyddad data tillåts.

> En authMiddleware-fil som hanterar auktoriseringen.

> Hashing och saltning, som används för att öka säkerheten vid lagring av lösenord eller annan känslig data.
