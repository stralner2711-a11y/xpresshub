# Creator Control Center Design

## Formaal

Creator skal have et professionelt driftpanel, der samler appens tekniske drift, sikkerhed, GDPR, medarbejderstyring, opdateringer og rollback uden at give adgang til private chats eller private logboeger.

## Hoveddele

- Driftstatus: app-version, Supabase-status, go-live procent, sikkerhed, aktive profiler og kernefunktioner.
- Handlinger: test Supabase, tjek opdatering, go-live tjek, sikkerhedscenter, backend, medarbejderoprettelse og regelnyt.
- Advarsler: manglende backend, sikkerhedspunkter, GDPR, slukkede kernefunktioner, dataanmodninger og opdateringskrav.
- Rollback: creator kan aabne et rollback-center, se installeret version, stabil version, sidste stabile version, aarsag og handlinger.
- Privatliv: panelet viser driftstal og status, men ikke indhold fra direkte beskeder, interne kanalchats eller private logboeger.

## Rollback-regler

Rollback maa ikke vaere en farlig enkeltknap. Creator skal se en tydelig advarsel og bekraefte handlingen. Rollback maa kun pege paa godkendte GitHub/download-links og maa ikke aendre Supabase-data. Hvis problemet skyldes database/schema, skal panelet forklare at der kraeves database-repair i stedet for APK-rollback.

## Test

Der skal vaere QA-tests der sikrer at creator-panelet viser drift, rollback, sikkerhed, GDPR, opdateringsstatus og privatlivsbeskyttelse. Medarbejder-login maa ikke vise creator-diagnostik.
