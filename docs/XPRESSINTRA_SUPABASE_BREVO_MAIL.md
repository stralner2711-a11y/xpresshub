# XpressIntra Supabase/Brevo Mailopsætning

Dato: 2026-06-29

Formål: XpressIntra skal kunne sende bekræftelsesmail, gensend bekræftelsesmail og nulstilling af adgangskode via en stabil mailudbyder. Opsætningen må ikke blandes med LifeNet eller andre projekter.

## Aktuel status

Status 2026-06-29:

- Supabase `Confirm email` er slået til.
- Supabase `Site URL` er sat til `https://xpresshub-seven.vercel.app/`.
- Redirect URLs er sat til webappen og GitHub Pages-reserve.
- Brevo har en separat aktiv SMTP-key: `XpressIntra Supabase Auth`.
- Supabase custom SMTP er slået til for XpressIntra.
- Test af Supabase recovery-mail returnerede `200 OK`.

## Anbefalet løsning

Brug Supabase Auth med custom SMTP via Brevo.

XpressIntra skal have sin egen Brevo-afsender og helst sin egen SMTP-key:

- Afsendernavn: `XpressIntra`
- Afsendermail: en mail der er godkendt i Brevo
- SMTP host: `smtp-relay.brevo.com`
- SMTP port: `587`
- SMTP username: Brevo SMTP-login
- SMTP password: Brevo SMTP-key

Gem aldrig SMTP-key i appens filer, GitHub, `public/app-config.js`, screenshots eller dokumentation.

## Supabase Auth-krav

I Supabase-projektet `mtfbdoajzmlgqbeiubxe`:

1. Authentication -> Sign In / Providers
2. `Confirm email` skal være slået til.
3. Authentication -> URL Configuration
4. `Site URL` skal være:

```text
https://xpresshub-seven.vercel.app/
```

5. Redirect URLs skal mindst indeholde:

```text
https://xpresshub-seven.vercel.app/
https://stralner2711-a11y.github.io/xpresshub/**
```

6. Authentication -> Emails / SMTP
7. Slå `Enable custom SMTP` til.
8. Indsæt Brevo SMTP-oplysningerne.
9. Gem.

## Brevo-krav

I Brevo:

1. Opret/godkend en XpressIntra-afsender.
2. Opret en separat SMTP-key til XpressIntra/Supabase.
3. Hvis Brevo IP-beskyttelse blokerer Supabase, skal SMTP-keyen kunne bruges uden fast IP-liste.
4. Slå link/click tracking fra for auth-mails, hvis Brevo omskriver Supabase-links.

Vigtigt: Auth-links fra Supabase bør ikke omskrives gennem tracking-domæner. Hvis bekræftelseslink eller reset-link bliver til et Brevo tracking-link og fejler, skal tracking slås fra eller mailudbyder skiftes.

## Appstatus

XpressIntra-koden understøtter allerede:

- Oprettelse via Supabase Auth
- Bekræftelsesmail-flow
- Gensend bekræftelsesmail
- Besked når mail skal bekræftes
- Korrekt redirect til officiel appadresse

Appen kan dog ikke selv garantere at mailen sendes. Det afhænger af Supabase SMTP/Brevo-opsætningen.

## Test efter opsætning

Brug en testmail, fx `mikkelsen2711@outlook.dk`.

1. Slet gammel testbruger i `auth.users`, `profiles` og `employee_invitations`.
2. Opret profil med standardkode i appen.
3. Kontroller at appen viser `Bekræftelsesmail er sendt`.
4. Tjek indbakke og spam.
5. Klik bekræftelseslinket.
6. Log ind med personlig kode.
7. Kontroller at profilen afventer eller får adgang efter creator/chef-godkendelse.
8. Test `Gensend bekræftelsesmail`.

## Fejlsøgning

Hvis mail ikke kommer:

- Tjek Supabase Auth logs for `/signup`, `/resend` eller `/recover`.
- Tjek Brevo transactional logs.
- Tjek at afsendermail er godkendt i Brevo.
- Tjek spam/uønsket mail.
- Tjek at Supabase redirect URLs ikke mangler.
- Tjek at Brevo ikke omskriver links med tracking.

Hvis Supabase viser `Error sending recovery email`, er det næsten altid SMTP/Brevo-indstilling, afsendergodkendelse, IP-beskyttelse eller SMTP-key.
