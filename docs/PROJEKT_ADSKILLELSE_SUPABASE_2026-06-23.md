# Projektadskillelse i Supabase

Dato: 2026-06-23

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
