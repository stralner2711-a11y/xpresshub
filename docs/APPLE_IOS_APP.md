# XpressIntra Apple/iOS-klargøring

Dato: 2026-06-04  
Omfang: iPhone/iPad via Capacitor iOS og App Store/TestFlight-forberedelse.  
Status: Projektet er teknisk klargjort til iOS, men endelig build og upload kræver Mac med Xcode.

## Kort status

Apple/iOS-platformen er nu tilføjet i projektet:

- `@capacitor/ios` er installeret.
- `ios/`-mappen er oprettet.
- Webappen er kopieret ind i iOS-projektets public-mappe.
- `package.json` har genveje til iOS:
  - `npm run native:sync`
  - `npm run ios:sync`
  - `npm run ios:open`
- Xcode-projektets native version matcher Android/web: `1.3.4` / build `17`.
- `KLIK HER - OPDATER ALT.cmd` synkroniserer nu både Android- og iOS-filer, før pakken kopieres til GitHub-klargøring.
- `Build Apple iOS paa Mac.command` kan køres på en Mac for at installere pakker, synkronisere iOS, teste Xcode-build og åbne workspace.
- `docs/APPLE_REVIEW_INFO.md` indeholder en kladde til Apple review notes, privacy-beskrivelse og testbrugerfelt.

På denne Windows-maskine kan projektet forberedes og synkroniseres, men Apple-buildet kan normalt ikke færdiggøres her, fordi Xcode, CocoaPods og App Store-upload kræver macOS.

## Sådan bygges den på en Mac

1. Installer Node.js, Xcode og CocoaPods på Mac.
2. Kopier eller hent hele projektet på Mac.
3. Kør:

```bash
npm install
npm run ios:sync
npm run ios:open
```

Eller kør den fælles Mac-hjælper:

```bash
sh ./tools/build-ios-mac.sh
```

4. I Xcode:
   - Vælg Apple Developer Team.
   - Kontroller bundle id: `dk.xpressbudet.xpressintra`.
   - Vælg en simulator eller fysisk iPhone.
   - Kør appen lokalt.

5. Til TestFlight/App Store:
   - Sæt version og build number i Xcode.
   - Vælg `Any iOS Device`.
   - Kør `Product` -> `Archive`.
   - Upload arkivet via Organizer til App Store Connect.
   - Brug `docs/APPLE_REVIEW_INFO.md` som kladde til review notes og testbruger.

## Apple-kravstatus

| Område | Status | Kommentar |
| --- | --- | --- |
| iOS-projekt | Klar | `ios/` er oprettet via Capacitor. |
| App-id/bundle id | Klar til test | `dk.xpressbudet.xpressintra` er sat i Capacitor. Skal matche Apple Developer/App Store Connect. |
| Appnavn | Skal besluttes | Capacitor bruger `XpressIntra`, mens webmanifestet bruger `IntraBudet`. Vælg et navn før App Store. |
| Ikoner | Delvist klar | 192/512 PNG findes til web/PWA. Xcode bør have fuldt iOS AppIcon-sæt. Capacitor/Xcode kan hjælpe, men bør visuelt kontrolleres på Mac. |
| Splash/startskærm | Delvist klar | Appen har web-startskærm/offline-cache. Native iOS launch screen bør kontrolleres i Xcode. |
| Privacy policy | Delvist klar | `docs/privacy.html` og GDPR-dokumenter findes. Til App Store skal privacy policy have en offentlig URL. |
| GPS/lokation | Delvist klar | Appen bruger frivillig lokationsdeling. App Store kræver tydelig formålstekst og korrekt privacy nutrition label. |
| Kamera/billeder | Delvist klar | Billedfunktioner skal beskrives i privacy label, hvis de bruges i iOS-versionen. |
| Login/testadgang | Mangler til review | Apple review skal have testbruger eller klare instruktioner, hvis appen kræver login. |
| Supabase/secrets | God retning | Service-role keys må fortsat ikke ind i appen. Kun offentlig anon/publishable key. |
| TestFlight | Ikke udført | Kræver Apple Developer-konto og upload fra Mac. |

## Vigtige Apple-beslutninger før upload

1. Vælg endeligt navn: `XpressIntra` eller `IntraBudet`.
2. Opret Apple Developer App ID med bundle id `dk.xpressbudet.xpressintra`.
3. Opret appen i App Store Connect.
4. Lav en review-testbruger i Supabase eller en sikker demo-adgang.
5. Udgiv privacy policy på en offentlig URL, for eksempel via jeres webside, GitHub Pages, Vercel eller Netlify.
6. Udfyld App Privacy i App Store Connect, så den matcher GPS, chat, profiler, billeder og login.
7. Test på mindst én rigtig iPhone, ikke kun simulator.
8. Udfyld `docs/APPLE_REVIEW_INFO.md` med testbruger og privacy policy URL.

## App Privacy-kladde til App Store Connect

Forvent at skulle deklarere følgende, hvis funktionerne er aktive i iOS-versionen:

| Datatype | Forventet svar | Hvorfor |
| --- | --- | --- |
| Contact Info | Ja | Navn, email og eventuelt telefon i medarbejderprofiler/login. |
| Location | Ja | Frivillig GPS/livekort og afhentningsopgaver. |
| User Content | Ja | Chat, opslag, billeder, logbog og opgaver. |
| Identifiers | Ja | Supabase Auth-bruger og interne profil-id'er. |
| Usage Data | Muligvis | Mød ind, opgaver, notifikationer og logbog, hvis det gemmes centralt. |
| Diagnostics | Kun hvis aktivt indsamlet | Deklareres kun hvis I bruger egentlig crash/diagnostiksporing. |

Vigtigt: App Privacy må ikke udfyldes pænt for at komme hurtigere igennem. Den skal matche den faktiske app, Supabase-tabellerne og privacy policy.

## Lokal vedligeholdelse

Når webappen ændres, synkroniser iOS-projektet med:

```bash
npm run ios:sync
```

Når både Android og iOS skal holdes i takt med webappen, brug:

```bash
npm run native:sync
```

På Windows kan synkronisering normalt opdatere filerne, men `pod install`, Xcode clean, simulatorbuild og arkivering skal ske på Mac.

## Næste praktiske skridt

1. Åbn projektet på en Mac.
2. Kør `npm install` og `npm run ios:sync`.
3. Åbn `ios/App/App.xcworkspace` i Xcode.
4. Vælg team/signing og test på iPhone.
5. Ret navn/ikon/privacy-tekster, hvis Xcode viser mangler.
6. Upload første build til TestFlight.
