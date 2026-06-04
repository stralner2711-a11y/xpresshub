# XpressIntra kravstatus

Dato: 2026-06-04  
Status: Realistisk intern APK-pilot. Google Play og tre-telefoners test er parkeret til senere.

## Samlet status

Appen er tæt på at være klar til intern creator-/APK-test, men ikke klar til bred udrulning til alle medarbejdere endnu.

Vi går ikke Google Play-vejen nu. Derfor er Google Play Data Safety og Play-version uden APK-install permission ikke akutte krav. De er gemt som senere arbejde.

## Skal være klar nu

| Krav | Status | Bevis/fil | Næste handling |
| --- | --- | --- | --- |
| Privatlivspolitik | Klar som arbejdsudgave | `docs/privacy.html` | Chef/ledelse skal godkende teksten. |
| GDPR dokumentationspakke | Klar som arbejdsudgave | `docs/GDPR_DOKUMENTATIONSPAKKE.md` | Chef/ledelse skal godkende formål, adgang og slettefrister. |
| Drifts- og stabilitetsplan | Klar som arbejdsudgave | `docs/DRIFT_STABILITETSPLAN.md` | Brug den ved hver opdatering. |
| Supabase public key kun i frontend | OK, skal fortsat kontrolleres | `public/app-config.js` og QA | Kør release-check før ny APK. |
| Android target SDK 35 | OK | `android/variables.gradle` | Ingen handling nu. |
| Ingen baggrundslokation | OK | `AndroidManifest.xml` uden `ACCESS_BACKGROUND_LOCATION` | Behold sådan. |
| Ingen mikrofonadgang | OK | `AndroidManifest.xml` | Ingen handling. |
| Android backup slået fra | OK | `android:allowBackup="false"` | Ingen handling. |
| APK-opdatering internt | OK til intern test | `REQUEST_INSTALL_PACKAGES` | Behold nu, fordi vi ikke går Google Play endnu. |

## Skal besluttes før flere medarbejdere

| Krav | Status | Næste handling |
| --- | --- | --- |
| GPS historik | Mangler beslutning | Beslut om GPS kun er live, eller om kort historik må gemmes. |
| Fart fra GPS | Mangler beslutning | Beslut om fart må gemmes/deles, eller kun vises lokalt. |
| Slettefrister | Mangler endelig beslutning | Godkend frister for GPS, chat, billeder, adminlog og logbog. |
| Chef/admin-adgang | Delvist besluttet | Bekræft at chef/admin ikke kan læse private chats uden rolle/medlemskab. |
| Mistet telefon | Plan klar, ikke godkendt | Chef/ledelse skal godkende processen. |
| Fratrådt medarbejder | Plan klar, ikke testet | Test med en testbruger. |
| Supabase Security Advisor | Mangler live-tjek | Skal køres i Supabase dashboard. |
| RLS live-test | Mangler real-test | Test med rigtige roller i Supabase. |

## Kan vente

| Krav | Status | Hvornår relevant |
| --- | --- | --- |
| Tre-telefoners pilot | Parkeret | Når du har flere brugere klar. |
| Google Play Data Safety | Kladde klar | Kun hvis appen skal i Google Play. |
| Play-version uden `REQUEST_INSTALL_PACKAGES` | Parkeret | Kun hvis appen skal i Google Play. |
| Offentlig privacy URL | Kan vente lidt | Nødvendig ved Google Play eller bredere ekstern distribution. |
| Medarbejdervejledning med screenshots | Senere, men nyttig | Før flere ældre chauffører skal bruge appen. |

## Det vi kan sige nu

- Appen har en privatlivspolitik som arbejdsudgave.
- Appen har en GDPR-pakke som arbejdsudgave.
- Appen har en driftsplan.
- Appen bruger ikke baggrundslokation.
- Appen bruger ikke mikrofon.
- Appen er bygget til intern APK-test, ikke Google Play endnu.

## Det vi ikke må sige endnu

- At appen er fuldt GDPR-godkendt.
- At appen er klar til alle medarbejdere.
- At GPS er juridisk færdigbesluttet.
- At live Supabase RLS er færdigtestet.

## Næste bedste handlinger

1. Gennemgå `docs/privacy.html` med chef/ledelse.
2. Beslut GPS ud fra `docs/GPS_LOKATION_BESLUTNINGSGRUNDLAG.md`.
3. Kør Supabase Security Advisor.
4. Test RLS med mindst to rigtige roller, når du har mulighed.
5. Test fratrådt-medarbejder flow med en testbruger.
