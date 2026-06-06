# XpressIntra jura- og GDPR-opdateringsplan

Dato: 2026-06-06  
Gælder for: brugsvilkår, privatlivspolitik, GDPR-dokumentation, GPS-regler, billedregler, slettefrister og adgangsregler.

## Hovedregel

Brugsvilkår og GDPR-tekster er ikke engangsdokumenter. De skal holdes ajour, når appen, virksomheden, leverandører eller regler ændrer sig.

## Fast rytme

| Hvornår | Hvad skal tjekkes |
| --- | --- |
| Hver 3. måned | Brugsvilkår, privatlivspolitik, GPS-formål, slettefrister, adgangsregler og databehandlerstatus. |
| Ved ny funktion | Om appen indsamler nye data, giver nye personer adgang eller ændrer medarbejdernes valgmuligheder. |
| Ved ny leverandør | Om der kræves databehandleraftale, nye vilkår eller ny information til medarbejderne. |
| Ved regelændring | Om privatlivspolitik, oplysningspligt, slettefrister eller sikkerhed skal opdateres. |
| Ved sikkerhedshændelse | Om risikovurdering, medarbejderinformation, adgangsregler og beredskab skal ændres. |

## Ting der altid skal udløse review

- Ny brug af GPS, fart, historik eller lokationsdeling.
- Nye billeder, dokumenter, uploadtyper eller lagringssteder.
- Nye chattyper, rollekanaler eller adgangsregler.
- Nye administratorroller eller ændret chef/creator-adgang.
- Ændret slettefrist for GPS, chat, billeder, logbog eller audit-log.
- Ny hosting, database, mailservice, kortservice eller release-distribution.
- Mistet telefon, forkert adgang, datalæk eller mistanke om misbrug.

## Kilder der bør tjekkes

- Datatilsynet: databeskyttelse i ansættelsesforhold.
- Datatilsynet/EDPB: behandlingssikkerhed, brud og privacy by design.
- GDPR-regler om oplysningspligt og fortegnelse over behandlingsaktiviteter.
- Supabase, hosting, GitHub/release, kort og mailleverandørers aktuelle vilkår.
- XpressBudets egne beslutninger om GPS, adgang, sletning og medarbejderinformation.

## Praktisk arbejdsgang

1. Creator/chef åbner `Sikkerhed, privatliv & brugsvilkår` i appen.
2. Gennemgå `Jura-opdateringsvagt`.
3. Ret `docs/privacy.html`, `docs/brugsvilkaar.html` og relevante GDPR-dokumenter.
4. Bump `GDPR_POLICY_VERSION`, hvis medarbejderne skal acceptere ny tekst.
5. Udgiv ny app-version.
6. Gem beslutning internt: dato, hvem godkendte, hvad ændrede sig og hvorfor.

## Status

Nuværende politikversion: `2026-06-06`.  
Appen viser nu tydeligt, når nyeste version mangler accept.
