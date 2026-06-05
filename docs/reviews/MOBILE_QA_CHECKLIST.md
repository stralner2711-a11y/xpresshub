# XpressIntra mobil QA-checkliste

Status: Bruges før hver større intern opdatering og før appen gives til flere kollegaer.

## Minimum før release

- Kør lokal QA: `npm run qa`.
- Byg/synkroniser mobil assets: `npm run native:sync`.
- Tjek at `public/version.json`, `docs/version.json` og `version.json` har samme version.
- Tjek at download-siden viser iPhone/PC og Android APK tydeligt.
- Tjek at medarbejder-login ikke viser creator-knapper, Supabase-test eller offentlig standardkode-oprettelse.

## Android APK

- Installer nyeste APK på en rigtig Android-telefon.
- Login med en almindelig medarbejder.
- Test første login efter standardkode og skift til personlig kode.
- Test fælleschat, direkte besked og relevant lastbil/varebil-chat.
- Test profilbillede med et lille foto, et stort foto og en forkert filtype.
- Test frivillig positionsdeling i 15 minutter og stop deling igen.
- Test at opdateringsboksen vises pænt, og at download/installationsflowet kan forstås.
- Test logout og login igen.

## iPhone webapp/PWA

- Åbn appen i Safari.
- Føj appen til hjemmeskærmen.
- Åbn fra hjemmeskærmen og login.
- Test chat, Information, Forside, Arbejde og Live-kort.
- Test at billeder kan vælges fra fotos, hvis brugeren giver tilladelse.
- Test at siden kan genindlæses, hvis der kommer en ny version.

## PC/web

- Login i browser.
- Test creator-panelet med creator-bruger.
- Test at creator kan oprette medarbejder og sende korrekt download/onboarding-tekst.
- Test driftsoverblik, rollback-center og release-status.
- Test at almindelig medarbejder ikke kan se creator-værktøjer.

## Ældre chauffør-test

- Kan man forstå forsiden på under 10 sekunder?
- Kan man finde `Arbejde`, `Beskeder`, `Live-kort` og `Information` uden forklaring?
- Er knapperne store nok med én hånd?
- Er tekst læsbar i mørk kabine?
- Er fejlbeskeder skrevet som XpressIntra-beskeder, ikke teknisk Supabase-sprog?

## Stop release hvis

- Login ikke virker på mobil.
- Chat viser forkerte kanaler eller forkert adgang.
- GPS starter uden tydeligt valg.
- En almindelig medarbejder kan se creator/admin-værktøjer.
- Appen viser tekniske fejlbeskeder ved normale handlinger.
- Version/download-link peger på en forkert kilde.
