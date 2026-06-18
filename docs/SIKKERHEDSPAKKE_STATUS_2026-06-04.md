# XpressIntra sikkerhedspakke - status 2026-06-04

## Kort vurdering

Sikkerhedspakken er god nok til kontrolleret intern pilot, men den bør ikke kaldes fuldt færdig til bred professionel drift endnu.

Det vigtigste er på plads i koden og SQL-pakken: Supabase Auth, RLS, privat Storage, frivillig GPS, ingen baggrundslokation, ingen mikrofon, Android backup slået fra, sikkerhedsheaders og interne GDPR-værktøjer. De største resterende punkter er driftsmæssige: live-test, Supabase Security Advisor, MFA, backup/gendannelse og ledelsesgodkendelse.

Opdatering efter live Supabase-tjek: de tidligere advarsler om offentligt kald af interne `SECURITY DEFINER` funktioner er rettet ved at flytte RLS-hjælpefunktionerne til et privat `private` schema. Supabase viser stadig to Auth-advarsler: leaked password protection og insufficient MFA options. MFA er meldt slået til manuelt, men Advisor kræver stadig flere/korrekte MFA options i projektets Auth-indstillinger.

## Det der ser stærkt ud

- Appen bruger offentlig Supabase publishable/anon key i frontend, ikke service-role key.
- Adgangskoder håndteres af Supabase Auth og bør ikke gemmes i appens egne tabeller.
- Supabase SQL-pakken har RLS, policies, private media bucket og rollebaseret adgang.
- Private chats og private logbøger er tænkt som private områder, ikke chef-overvågning.
- GPS er frivillig, synlig og uden baggrundslokation.
- Android manifest bruger ikke mikrofon og ikke background location.
- Android backup er slået fra.
- Hosting-konfigurationen har CSP, frame blocking, nosniff, referrer policy og no-store på app-config.
- Service worker er sat til ikke at cache Supabase/auth/rest/storage og app-config.
- Appen har sikkerhedscenter, GDPR go-live pakke, dataanmodninger og slettefrister.

## Det der stadig mangler før bred brug

1. Supabase Security Advisor skal gennemgås i Supabase dashboard.
2. Leaked password protection skal slås til i Supabase Auth.
3. MFA/to-faktor skal bekræftes i Supabase Auth, så Security Advisor ikke længere viser "insufficient MFA options".
4. RLS skal testes live med rigtige roller, ikke kun lokale smoke-tests.
5. Backup skal være aktiv, og gendannelse skal testes i et testmiljø.
6. Ledelsen skal godkende privatlivspolitik, GPS-formål, slettefrister og adgangsregler.
7. Der skal være en fast mistet-telefon og fratrådt-medarbejder procedure.
8. Profilbilleder og chatbilleder skal testes med store filer, forkerte filtyper og langsom forbindelse.
9. Der bør laves en kort DPIA-light/risikovurdering for GPS, fordi appen bruges i et ansættelsesforhold.
10. Tredjeparts scripts fra CDN bør på sigt bundtes ind i appen for mere professionel drift.

## Juridisk og praktisk konklusion

Appen er bygget med god retning for privacy by design: GPS er hjælpsomt og frivilligt, ikke et kontrolsystem, og chef/admin skal ikke have fri adgang til private samtaler.

Men GDPR handler også om beslutninger og drift. Derfor er appen først klar til bredere medarbejderbrug, når ledelsen har godkendt dokumenterne, og live Supabase-sikkerheden er kontrolleret.

## Anbefalet næste sikkerhedspakke

- Lav en "Mistet telefon" handling i creator-panelet, der guider creator gennem de konkrete trin.
- Lav en enkel "Fratrådt medarbejder" handling med deaktivér profil, stop GPS og fjern adgang.
- Tilføj en release-test der kører dependency audit, når miljøet understøtter det.
- Lav en lille medarbejdervenlig privacy-side i appen med "Hvad kan andre se om mig".
- Lav en intern accept-/læsekvittering for privatlivspolitik og GPS-regler.

## Kilder der bør bruges ved endelig godkendelse

- Datatilsynet: GDPR for små virksomheder.
- Datatilsynet: konsekvensanalyse/DPIA.
- EDPB/Datatilsynet: håndtering af brud på persondatasikkerheden.
- Supabase dokumentation: RLS, Auth, Storage og Security Advisor.
