# Projektadskillelse i Supabase

Oprettet: 2026-06-23  
Senest kontrolleret: 2026-08-14

## Formål

XpressIntra skal være et lukket internt medarbejdersystem. Andre projekter må ikke ligge i samme produktionsdatabase.

## Hvad der blev fundet

Live Supabase-projektet til XpressIntra indeholdt tidligere enkelte TruckLex/offentlige objekter:

- `public.trucklex_places`
- `public.trucklex_traffic_events`
- `public.public_data_sources`
- `public.contribution_submissions`
- `public.public_place_cards()`
- `public.public_traffic_events()`
- `public.public_workflow_snapshot()`

Der blev ikke fundet TruckLex-referencer i den lokale XpressIntra-kodebase.

## Hvad der blev ændret live

Følgende Supabase-migrationer blev kørt:

- `remove_trucklex_from_xpressintra_20260623`
- `harden_authenticated_table_privileges_20260623`

TruckLex-tabeller og offentlige TruckLex-funktioner blev fjernet fra XpressIntra-projektet.

Anonyme brugere fik fjernet direkte tabeladgang til XpressIntra.

Indloggede brugere beholdt kun de normale app-rettigheder gennem RLS:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

Tekniske database-rettigheder blev fjernet fra `authenticated`:

- `TRUNCATE`
- `TRIGGER`
- `REFERENCES`

## Efterkontrol

Efter ændringen havde live-databasen:

- 24 public-tabeller
- RLS slået til på alle 24 tabeller
- Ingen TruckLex-tabeller eller TruckLex-public-funktioner
- Én privat storage bucket: `xpressintra-media`
- `xpressintra-media` er ikke offentlig
- Billedtyper begrænset til `jpeg`, `png`, `webp` og `gif`
- Filstørrelse begrænset til 10 MB

## Fremadrettet regel

Nye projekter skal have egne Supabase-projekter. XpressIntra-databasen må kun indeholde XpressIntra-tabeller, XpressIntra-funktioner og XpressIntra-storage.

## Gentagen oprydning 2026-08-14

En senere TruckLex-migration havde ved en fejl genoprettet 13 `trucklex_*`-tabeller i XpressIntras produktionsprojekt `mtfbdoajzmlgqbeiubxe`.

Før oprydningen blev følgende gennemført:

- Schema, constraints, indexes, policies, data og Realtime-status blev eksporteret lokalt.
- Alle 13 tabeller og 15 eksisterende rækker blev flyttet til det korrekte Truckpedia-projekt `pfhgchcqddequxhhgrla`.
- Alle 13 måltabeller fik RLS.
- 29 RLS-policies og to private rollefunktioner blev genskabt.
- Anonyme brugere fik kun læseadgang til de offentlige rækker og ingen tabelbaseret skriveadgang.
- TruckLex-koden, runtime-konfigurationen, QA-kontrollerne og dokumentationen blev ændret til Truckpedia-projektet.
- TruckLex build og statisk QA bestod mod den nye konfiguration.
- Supabase security- og performance-advisors på Truckpedia rapporterede ingen fund.

Efter at målet var verificeret, blev migrationen `remove_reintroduced_trucklex_from_xpressintra_20260814` kørt på XpressIntra. Efterkontrollen viste:

- 0 `trucklex_*`-tabeller i XpressIntra.
- 0 TruckLex-funktioner og intet `trucklex_private`-schema i XpressIntra.
- 0 TruckLex-tabeller i XpressIntras Realtime-publication.
- 26 XpressIntra-tabeller, alle med RLS slået til.

Sikkerhedseksporten ligger lokalt i `backups/trucklex-move-2026-08-14/` og er udelukket fra Git. `tools/supabase-release-check.ps1` stopper nu en release, hvis TruckLex igen dukker op i XpressIntras samlede SQL-filer.
