# XpressIntra go-live tjekliste

Denne liste er til overgangen fra lokal demo til rigtig intern brug.

## 1. Supabase

- Opret et Supabase-projekt.
- Kør `supabase/schema.sql` i SQL editoren.
- Kontroller at Storage bucket `xpressintra-media` er privat.
- Kontroller at Realtime er aktiv for de tabeller, schemaet tilføjer til publication.
- Brug kun den offentlige anon/publishable key i webappen.
- Brug aldrig service-role eller secret key i browseren.

## 2. Første chef/admin

- Opret første bruger i Supabase Auth.
- Ret email i `supabase/first-admin.sql`.
- Kør `supabase/first-admin.sql` i SQL editoren.
- Log ind i appen med den bruger og kontroller at Chef/admin vises under Kontrol.

## 3. App-konfiguration

- Åbn appen.
- Gå til `Mere` -> `Indstillinger`.
- Indsæt Supabase URL.
- Indsæt offentlig anon/publishable key.
- Log ud og log ind med en rigtig bruger.

## 4. Mobiltest

Test med mindst to telefoner:

- login
- mød ind
- automatisk stop kl. 19.00 dansk tid
- GPS-tilladelse
- livekort
- fælleschat
- lastbilchat og varebilchat
- direkte beskeder
- billeder i chat
- opslag, kommentarer og likes
- afhentning for kollega
- personlig logbog og til/fra-valg

## 5. Jura og drift

Beslut før rigtig brug:

- hvem er dataansvarlig
- Supabase databehandleraftale
- formål med GPS
- om GPS kun er live eller må gemmes som historik
- slettefrister for chat, billeder, GPS, audit-log og dataanmodninger
- interne regler for billeder
- hvem må være chef/admin
- hvordan fratrådte medarbejdere deaktiveres

## 6. Produktion

- Slå demo-admin fra ved at sætte `DEMO_MODE = false` i `src/app.js`.
- Host appen på HTTPS.
- Test service worker/cache efter ny version.
- Lav en kort medarbejdervejledning med skærmbilleder.
- Aftal hvem der godkender regelnyt.
