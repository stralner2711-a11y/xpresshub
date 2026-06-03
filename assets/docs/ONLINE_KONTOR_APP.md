# XpressIntra som kontor-app på PC

Denne vejledning er til at lægge XpressIntra online, så chefer og kontor kan bruge appen på PC via et link. Når appen opdateres her i projektet og udgives igen, får alle den nye version automatisk.

## Anbefalet løsning

- Supabase bruges til login, medarbejdere, beskeder, køretøjer og fælles data.
- Vercel eller Netlify bruges til at lægge selve webappen online.
- Kontor-PC'er bruger appen i Chrome eller Edge og kan installere den som en almindelig Windows-app.

## Før udgivelse

1. Opret eller brug jeres Supabase-projekt.
2. Kør `supabase/schema.sql` i Supabase SQL editoren.
3. Opret den første chef/admin i Supabase Auth.
4. Kør `supabase/first-admin.sql` med chefens mailadresse.
5. Tjek at `public/app-config.js` kun indeholder Supabase URL og offentlig anon/publishable key.

Vigtigt: service role, secret key eller database password må aldrig ind i `public/app-config.js`.

## Udgiv på Vercel

1. Opret et projekt på Vercel.
2. Vælg dette projekt fra GitHub eller upload projektmappen.
3. Vercel finder `vercel.json`.
4. Build command skal være `npm run build`.
5. Output directory skal være `dist`.
6. Udgiv projektet.

Når der senere ændres i appen og den nye version udgives, sørger browseren og service worker for at hente den nye version.

## Udgiv på Netlify

1. Opret et site på Netlify.
2. Vælg dette projekt fra GitHub eller upload projektmappen.
3. Netlify finder `netlify.toml`.
4. Build command skal være `npm run build`.
5. Publish directory skal være `dist`.
6. Udgiv sitet.

## Sådan bruger kontoret appen på PC

1. Åbn appens webadresse i Microsoft Edge eller Google Chrome.
2. Log ind med kontorbrugerens Supabase-login.
3. Tryk på browserens installer-knap i adresselinjen, eller vælg menuen og derefter "Installer app".
4. Appen kan derefter åbnes fra Windows Start-menuen som XpressIntra.

## Når appen er opdateret

Efter en ny udgivelse kan åbne brugere få den nye version ved at lukke og åbne XpressIntra igen. Hvis en PC stadig viser en gammel version, tryk `Ctrl+F5` i browseren én gang.

## Lokal kontrol før udgivelse

Kør:

```powershell
npm.cmd run build
```

Hvis buildet slutter uden fejl, ligger den færdige webapp i `dist`.
