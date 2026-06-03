# XpressIntra: mobilapp og PC-app sammen

Målet er, at chaufførernes mobilapp og kontorets PC-app arbejder i samme system. Det betyder, at PC-versionen ikke må være en separat offline demo. Den skal bruge samme login, samme database og samme app-version som mobilappen.

## Sådan hænger det sammen

- GitHub indeholder app-koden.
- Vercel udgiver webappen til PC og browser.
- Android-appen bygges fra samme kode.
- Supabase er fælles backend for begge dele.
- Brugere logger ind med samme Supabase Auth.
- Beskeder, opslag, dokumenter, profiler og roller gemmes i samme Supabase-projekt.

Når en chauffør skriver i mobilappen, kan kontoret se det på PC. Når kontoret sender et opslag fra PC, kan chaufførerne se det i mobilappen.

## Det der skal være ens

Begge versioner skal bruge samme Supabase-oplysninger:

```js
window.XPRESSINTRA_SUPABASE = {
  url: 'https://mtfbdoajzmlgqbeiubxe.supabase.co',
  anonKey: 'sb_publishable_O5_UP9V86eoCG_5f7xksCQ_uoW0jcJd',
};
```

De oplysninger ligger i:

```text
public/app-config.js
```

Det er den offentlige Supabase-nøgle. Service-role, database password og andre hemmelige nøgler må aldrig ligge i appen, GitHub, Vercel eller APK-filer.

## PC-app på kontoret

PC-appen bør være Vercel-linket installeret som app i Microsoft Edge eller Google Chrome.

Flow:

1. Koden pushes til GitHub.
2. Vercel bygger og udgiver appen.
3. Kontoret åbner Vercel-linket.
4. Kontoret logger ind med chef/kontor-bruger.
5. Browseren kan installere siden som en Windows-app.

Så får kontoret en app i Start-menuen, men den arbejder stadig online med samme data som mobilappen.

## Mobilapp til chauffører

Mobilappen bygges fra samme projekt. Når `public/app-config.js` peger på samme Supabase-projekt, arbejder APK'en sammen med PC-appen.

Flow:

1. Appen bygges som APK/AAB.
2. Chaufføren installerer appen.
3. Chaufføren logger ind med Supabase-login.
4. Beskeder, opslag og dokumenter hentes fra samme database som PC-appen.

## Det der ikke skal bruges til drift

`computer-demo.html` er kun en visuel demo. Den sætter demo-login lokalt og viser appen i en telefonramme. Den skal ikke bruges som rigtig kontorapp.

Til rigtig brug skal kontoret bruge Vercel-linket eller den installerede PWA-version.

## Roller

Rollerne skal styre, hvad brugeren ser:

- Chauffør: beskeder, opslag, dokumenter og egne oplysninger.
- Kontor/disponent: fælles beskeder, holdkanaler, opslag og relevante medarbejderoplysninger.
- Chef/admin: adgangsstyring, brugere, sikkerhed og kontrolfunktioner.

Rettighederne skal håndhæves i Supabase med RLS, ikke kun i brugerfladen.

## Kort konklusion

Der skal kun være ét XpressIntra-system:

```text
Mobilapp + PC-app
        |
        v
Samme Supabase-login og database
        |
        v
Samme beskeder, opslag, dokumenter og roller
```

