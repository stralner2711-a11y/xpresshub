# XpressIntra GDPR- og sikkerhedstjek

Dette er en praktisk intern tjekliste til go-live. Den erstatter ikke juridisk rådgivning, men samler de beslutninger virksomheden bør tage før appen bruges med rigtige medarbejderdata.

## Dataområder

- Profiler: navn, mail, telefon, rolle, afdeling, køretøj, beviser og nødkontakt.
- Chat: fælleschat, rollekanaler, direkte beskeder og billeder.
- Livekort: frivillig GPS, synlighed, eventuel fart, status og midlertidig deling.
- Logbog: privat medarbejderlogbog og automatiske kladder.
- Dokumenter og billeder: CMR, fragtbreve, skader, opgaver og opslag.
- Drift: adminhandlinger, invitationer, kernefunktioner og audit-log.

## Beslutninger før drift

- Fastlæg dataansvarlig og intern kontaktperson.
- Beslut formål og lovligt grundlag for hvert dataområde.
- Aftal slettefrister for GPS, chat, billeder, dokumenter, logbog og audit-log.
- Lav en enkel risikovurdering/DPIA for GPS og medarbejderkontrol.
- Sørg for databehandleraftaler med Supabase, hosting og øvrige leverandører.
- Beskriv hvad der må deles i chat og billeder.
- Beskriv hvem der må være chef/admin/creator.
- Beskriv hvordan fratrådte medarbejdere lukkes ned.

## Tekniske minimumskrav

- Service-role keys må aldrig ligge i appen eller i browseren.
- RLS skal være slået til på alle Supabase-tabeller med persondata.
- Private logbøger og direkte beskeder må ikke kunne læses af chef/admin.
- GPS skal være frivillig, synlig og nem at stoppe.
- Fart, bil og status skal kun gemmes/deles hvis medarbejderen har valgt det.
- Billeder skal gemmes i privat Storage med adgang via samtale/opslag.
- Adminhandlinger skal logges uden at logge privat chatindhold.

## Medarbejderrettigheder

- Indsigt: medarbejderen kan se hvilke hoveddata appen har.
- Rettelse: forkerte profiloplysninger kan rettes.
- Sletning: data kan slettes når formålet er væk eller fristen udløber.
- Eksport: egne data kan udleveres i læsbart format.
- Begrænsning/indsigelse: frivillige funktioner som GPS, billeder og logbog kan styres.

## Go-live test

- Test login med mindst to rigtige medarbejdere.
- Test lastbilchat, varebilchat, fælleschat og direkte besked.
- Test at disponent/chef ikke kan læse lukkede chaufførchats uden korrekt arbejdsfunktion.
- Test GPS-synlighed for alle, lastbil, varebil og ingen.
- Test upload af profilbillede og chatbillede.
- Test dataanmodning, adminrolle, invitation og deaktivering af medarbejder.
