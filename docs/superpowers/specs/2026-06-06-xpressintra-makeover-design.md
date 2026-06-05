# XpressIntra Makeover Design

Dato: 2026-06-06

## Valgt Retning

Makeoveren følger retningen **Arbejdsdag først, med lidt socialt liv**.

Appen skal føles som et roligt værktøj for chauffører, ikke som et tungt kontrolpanel. Forsiden skal hjælpe brugeren med at forstå dagens vigtigste handling på få sekunder og derefter give adgang til chat, information og kollega-hjælp uden rod.

## Mål

- Gøre forsiden markant mere overskuelig.
- Samle hverdagsfunktioner logisk i stedet for at vise samme funktion flere steder.
- Gøre knapper større, tydeligere og nemmere at ramme på mobil.
- Beholde nuværende mørke XpressIntra-stil med orange og blå, men gøre den mere professionel og rolig.
- Gøre appen nemmere for ældre chauffører, der ikke er stærke smartphone-brugere.

## Forside

Forsiden skal bygges op i denne prioritet:

1. **Status og næste handling**
   - Tydelig hilsen med navn.
   - Én stor anbefalet handling:
     - Start arbejdsdag hvis brugeren ikke er mødt ind.
     - Se live-kort hvis arbejdsdag er aktiv og intet akut venter.
     - Åbn beskeder hvis der er ulæste beskeder.
     - Fortsæt aktiv afhentning hvis der er en opgave i gang.

2. **Dagens vigtigste værktøjer**
   - Store knapper til de funktioner chaufføren bruger ofte:
     - Arbejde
     - Del position
     - Hent for kollega
     - Logbog
     - Information
     - Beskeder
   - Der må ikke være dubletter af den funktion, som allerede ligger som “næste handling”.

3. **Kort kontor/fællesskab**
   - Et lille, roligt felt med vigtig besked fra kontoret eller fælleschat.
   - Ingen lang social feed på forsiden.
   - Brugeren kan åbne beskeder/opslag ved behov.

4. **Mindre vigtige ting flyttes væk**
   - Indstillinger, tilladelser, test, drift og juridiske ting skal ikke fylde på forsiden.
   - De hører hjemme under Kontrol/Indstillinger eller creator-drift.

## Arbejde-Siden

Arbejde-siden bliver det rigtige hjem for:

- Mød ind / slut dag.
- Del tur.
- Gem logbog.
- Afhentning for kollega.
- Arbejdsdagens tilladelser vises kort, men selve ændringerne ligger i Indstillinger.

Forsiden må gerne linke til Arbejde, men må ikke gentage hele Arbejde-siden.

## Information

Information skal ikke blandes ind på forsiden som mange kort. Den skal være en separat, enkel side med:

- Søgning.
- Kontakter.
- Regler.
- Håndbog.
- Nyttige links.

Makeoveren må gerne justere forsidelinket til Information, men en dybere Information-redesign er en separat runde.

## Chat Og Fællesskab

Forsiden må kun vise et kort socialt signal:

- Ulæste beskeder.
- Seneste vigtige opslag.
- Hurtig adgang til Beskeder.

Selve chatoplevelsen forbliver på Beskeder-siden.

## Designprincipper

- Store trykflader.
- Maksimalt 1 primær handling på skærmen ad gangen.
- Mindre tekst på forsiden.
- Mere luft mellem sektioner.
- Tydelige overskrifter.
- Ingen skjulte små knapper til vigtige handlinger.
- Samme visuelle sprog på alle vigtige kort.

## Teknisk Afgrænsning

Denne første makeover-runde ændrer primært:

- `src/app.js`
  - `renderHome()`
  - eventuelt små hjælpere til prioritering af handlinger

- `src/styles.css`
  - forside-layout
  - kort, knapper, spacing og mobilvisning

- QA-tests
  - forsiden må ikke vise dubletter
  - forsiden skal have én tydelig næste handling
  - forsiden skal have store hverdagsværktøjer
  - fjernede tekster må ikke dukke op igen

## Ikke Med I Første Runde

- Ingen ny database-struktur.
- Ingen ændring af Supabase/RLS.
- Ingen ny chatmotor.
- Ingen ny livekortmotor.
- Ingen stor omskrivning af hele appen.
- Ingen APK-build før design og webvisning er godkendt.

## Test

Efter implementation skal følgende testes:

- `npm run qa`
- `npm run build`
- Visuel webtest af forsiden.
- Kontrol af at navigation stadig virker.
- Kontrol af at medarbejder ikke ser creator/admin-ting.
- Kontrol af at mød ind ikke vises unødvendigt flere steder på forsiden.

## Succeskriterie

Forsiden skal kunne forklares sådan:

> “Her ser chaufføren hvad der er vigtigst lige nu, og resten er store genveje til de rigtige sider.”

Hvis en ældre chauffør kan åbne appen og forstå første handling uden forklaring, er makeoveren på rette vej.
