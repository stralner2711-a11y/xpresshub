# XpressIntra som kontor-app pa PC

Denne vejledning er til at laegge XpressIntra online, sa chefer og kontor kan bruge appen pa PC via et link. Nar appen opdateres i GitHub og udgives igen, far alle den nye version automatisk.

Vigtigt: Kontor-appen pa PC skal ikke vaere en separat offline demo. Den skal bruge samme Supabase-projekt som mobilappen, sa beskeder, opslag, dokumenter, profiler og roller arbejder sammen pa tvaers af PC og telefon.

## Anbefalet losning

- GitHub bruges til app-koden.
- Vercel eller Netlify bruges til at udgive webappen online.
- Supabase bruges til login, medarbejdere, beskeder, opslag, dokumenter og roller.
- Kontor-PC'er bruger appen i Chrome eller Edge og kan installere den som en almindelig Windows-app.
- Android-appen og PC-appen bygges fra samme kode og peger pa samme Supabase-login/database.

## Saadan arbejder mobil og PC sammen

Begge versioner skal bruge samme Supabase-konfiguration i `public/app-config.js`.

Nar chaufforen skriver i mobilappen, gemmes beskeden i Supabase, og kontoret kan se den pa PC. Nar kontoret sender et opslag fra PC, gemmes opslaget i samme Supabase-projekt, og chaufforerne kan se det i mobilappen.

Det er Supabase der binder systemet sammen. GitHub og Vercel leverer kun selve appen.

## For udgivelse

1. Opret eller brug jeres Supabase-projekt.
2. Kor `supabase/schema.sql` i Supabase SQL editoren.
3. Opret den forste chef/admin i Supabase Auth.
4. Ret chefens mailadresse i `supabase/first-admin.sql`.
5. Kor `supabase/first-admin.sql` i Supabase SQL editoren.
6. Tjek at `public/app-config.js` kun indeholder Supabase URL og offentlig anon/publishable key.

Vigtigt: service role, secret key eller database password ma aldrig ind i `public/app-config.js`, GitHub, Vercel eller APK'en.

## Udgiv pa Vercel

1. Push projektet til GitHub.
2. Opret et projekt pa Vercel.
3. Vaelg GitHub-repoet.
4. Build command skal vaere `npm run build`.
5. Output directory skal vaere `dist`.
6. Udgiv projektet.

Nar der senere aendres i appen og der pushes til GitHub, bygger Vercel automatisk den nye PC/web-version.

## Saadan bruger kontoret appen pa PC

1. Aabn appens Vercel-adresse i Microsoft Edge eller Google Chrome.
2. Log ind med kontorbrugerens Supabase-login.
3. Tryk pa browserens installer-knap i adresselinjen, eller vaelg menuen og derefter "Installer app".
4. Appen kan derefter abnes fra Windows Start-menuen som XpressIntra.

## Mobilapp til chaufforer

1. Byg APK/AAB fra samme projekt.
2. Sorg for at `public/app-config.js` peger pa samme Supabase-projekt som Vercel-versionen.
3. Installer appen pa telefonen.
4. Log ind med chaufforens Supabase-login.

Hvis mobilappen er bygget med samme Supabase-konfiguration, arbejder den sammen med PC-appen.

## Det der ikke skal bruges til rigtig drift

`computer-demo.html` er kun en visuel demo. Den bruger demo-login og lokal data. Den skal ikke bruges som rigtig kontorapp.

Til rigtig brug skal kontoret bruge Vercel-linket eller den installerede PWA-version.

## Lokal kontrol for udgivelse

Kor:

```powershell
npm.cmd run build
```

Hvis buildet slutter uden fejl, ligger den faerdige webapp i `dist`.

