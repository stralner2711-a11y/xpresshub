# XpressIntra arkitektur

## Nuværende demo

Appen er en lokal PWA-demo med én hovedfil:

- `src/app.js`: tilstand, rettigheder, render-funktioner og handlinger
- `src/styles.css`: samlet visuelt system
- `supabase/schema.sql`: målarkitektur for rigtig online drift
- `qa/*.cjs`: smoke-tests for centrale arbejdsgange

## Moduler der bør udskilles næste gang

Når appen kobles til Supabase, bør `src/app.js` deles i disse moduler:

- `state`: lokal tilstand, seed-data og storage/sync
- `access`: roller, chatadgang, målgrupper og adminregler
- `profiles`: medarbejderprofiler, chef/admin og mine data
- `chat`: samtaler, billeder, emojis og kanaladgang
- `map`: livekort, GPS-deling, tidsudløb og afhentningsdeling
- `logbook`: privat logbog, automatik, kladder og billeder
- `info`: officielle links, regelnyt, favoritter og landeguider
- `search`: global søgning og senere serverindeks

## Sikkerhedsregel

Klienten må gerne gøre brugerfladen nem og tydelig, men den må ikke være den eneste sikkerhed. Supabase RLS, triggers og Storage policies skal altid være den endelige lås.
