# Supabase dashboard - sidste sikkerhedstrin

Dato: 2026-06-04  
Projekt: `mtfbdoajzmlgqbeiubxe`

## Status fra live Security Advisor

De tekniske RLS-hjælpefunktioner er flyttet ud af `public` og ind i et privat `private` schema. Det fjerner advarslerne om, at almindelige indloggede brugere kan kalde interne `SECURITY DEFINER` funktioner direkte via API/RPC.

Der er stadig to Supabase Auth-punkter, som skal slås til og bekræftes i Supabase dashboard:

1. Leaked password protection
2. Flere MFA/to-faktor muligheder

Statusnotat: MFA er meldt slået til manuelt, men live Security Advisor viser stadig `Insufficient MFA Options`. Det betyder sandsynligvis, at der skal aktiveres flere MFA options i projektets Auth-indstillinger, eller at den aktiverede MFA kun gælder en bruger/konto og ikke projektets Auth-konfiguration.

## 1. Slå leaked password protection til

Formål: Supabase kan afvise adgangskoder, der allerede er kendt fra datalæk.

Gør sådan:

1. Åbn Supabase.
2. Vælg XpressIntra-projektet.
3. Gå til Authentication.
4. Gå til Password Security eller Security.
5. Slå leaked password protection til.
6. Gem ændringen.
7. Kør Security Advisor igen.

## 2. Slå MFA/to-faktor til

Formål: Creator/admin-konti skal være sværere at misbruge, hvis en adgangskode bliver gættet eller lækket.

Gør sådan:

1. Åbn Supabase.
2. Vælg XpressIntra-projektet.
3. Gå til Authentication.
4. Find MFA / Multi-Factor Authentication.
5. Slå mindst én sikker MFA-metode til.
6. Hvis Supabase stadig advarer, slå flere MFA options til hvis dashboardet tilbyder det.
7. Brug MFA på creator/admin-konti.
8. Kør Security Advisor igen.

## 3. Tjek efter ændringen

Når de to ting er slået til:

1. Kør Supabase Security Advisor.
2. Tjek at der ikke er røde/høje sikkerhedsadvarsler.
3. Test login i appen.
4. Test fælleschat.
5. Test livekort.
6. Test profilbillede.

## Det er vigtigt

Appen kan godt være teknisk sikker i koden, men creator/admin-konti er stadig et svagt punkt uden to-faktor. For et medarbejdersystem bør MFA bruges på alle konti, der kan ændre roller, medarbejdere, sikkerhed eller database.
