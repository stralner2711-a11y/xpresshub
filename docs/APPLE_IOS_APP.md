# XpressIntra Apple/iOS-klargÃ¸ring

Dato: 2026-06-04  
Omfang: iPhone/iPad via Capacitor iOS og App Store/TestFlight-forberedelse.  
Status: Projektet er teknisk klargjort til iOS, men endelig build og upload krÃ¦ver Mac med Xcode.

## Kort status

Apple/iOS-platformen er nu tilfÃ¸jet i projektet:

- `@capacitor/ios` er installeret.
- `ios/`-mappen er oprettet.
- Webappen er kopieret ind i iOS-projektets public-mappe.
- `package.json` har genveje til iOS:
  - `npm run native:sync`
  - `npm run ios:sync`
  - `npm run ios:open`
- Xcode-projektets native version matcher Android/web: `1.3.8` / build `21`.
- `KLIK HER - OPDATER ALT.cmd` synkroniserer nu bÃ¥de Android- og iOS-filer, fÃ¸r pakken kopieres til GitHub-klargÃ¸ring.
- `Build Apple iOS paa Mac.command` kan kÃ¸res pÃ¥ en Mac for at installere pakker, synkronisere iOS, teste Xcode-build og Ã¥bne workspace.
- `docs/APPLE_REVIEW_INFO.md` indeholder en kladde til Apple review notes, privacy-beskrivelse og testbrugerfelt.

PÃ¥ denne Windows-maskine kan projektet forberedes og synkroniseres, men Apple-buildet kan normalt ikke fÃ¦rdiggÃ¸res her, fordi Xcode, CocoaPods og App Store-upload krÃ¦ver macOS.

## SÃ¥dan bygges den pÃ¥ en Mac

1. Installer Node.js, Xcode og CocoaPods pÃ¥ Mac.
2. Kopier eller hent hele projektet pÃ¥ Mac.
3. KÃ¸r:

```bash
npm install
npm run ios:sync
npm run ios:open
```

Eller kÃ¸r den fÃ¦lles Mac-hjÃ¦lper:

```bash
sh ./tools/build-ios-mac.sh
```

4. I Xcode:
   - VÃ¦lg Apple Developer Team.
   - Kontroller bundle id: `dk.xpressbudet.xpressintra`.
   - VÃ¦lg en simulator eller fysisk iPhone.
   - KÃ¸r appen lokalt.

5. Til TestFlight/App Store:
   - SÃ¦t version og build number i Xcode.
   - VÃ¦lg `Any iOS Device`.
   - KÃ¸r `Product` -> `Archive`.
   - Upload arkivet via Organizer til App Store Connect.
   - Brug `docs/APPLE_REVIEW_INFO.md` som kladde til review notes og testbruger.

## Apple-kravstatus

| OmrÃ¥de | Status | Kommentar |
| --- | --- | --- |
| iOS-projekt | Klar | `ios/` er oprettet via Capacitor. |
| App-id/bundle id | Klar til test | `dk.xpressbudet.xpressintra` er sat i Capacitor. Skal matche Apple Developer/App Store Connect. |
| Appnavn | Skal besluttes | Capacitor bruger `XpressIntra`, mens webmanifestet bruger `IntraBudet`. VÃ¦lg et navn fÃ¸r App Store. |
| Ikoner | Delvist klar | 192/512 PNG findes til web/PWA. Xcode bÃ¸r have fuldt iOS AppIcon-sÃ¦t. Capacitor/Xcode kan hjÃ¦lpe, men bÃ¸r visuelt kontrolleres pÃ¥ Mac. |
| Splash/startskÃ¦rm | Delvist klar | Appen har web-startskÃ¦rm/offline-cache. Native iOS launch screen bÃ¸r kontrolleres i Xcode. |
| Privacy policy | Delvist klar | `docs/privacy.html` og GDPR-dokumenter findes. Til App Store skal privacy policy have en offentlig URL. |
| GPS/lokation | Delvist klar | Appen bruger frivillig lokationsdeling. App Store krÃ¦ver tydelig formÃ¥lstekst og korrekt privacy nutrition label. |
| Kamera/billeder | Delvist klar | Billedfunktioner skal beskrives i privacy label, hvis de bruges i iOS-versionen. |
| Login/testadgang | Mangler til review | Apple review skal have testbruger eller klare instruktioner, hvis appen krÃ¦ver login. |
| Supabase/secrets | God retning | Service-role keys mÃ¥ fortsat ikke ind i appen. Kun offentlig anon/publishable key. |
| TestFlight | Ikke udfÃ¸rt | KrÃ¦ver Apple Developer-konto og upload fra Mac. |

## Vigtige Apple-beslutninger fÃ¸r upload

1. VÃ¦lg endeligt navn: `XpressIntra` eller `IntraBudet`.
2. Opret Apple Developer App ID med bundle id `dk.xpressbudet.xpressintra`.
3. Opret appen i App Store Connect.
4. Lav en review-testbruger i Supabase eller en sikker demo-adgang.
5. Udgiv privacy policy pÃ¥ en offentlig URL, for eksempel via jeres webside, GitHub Pages, Vercel eller Netlify.
6. Udfyld App Privacy i App Store Connect, sÃ¥ den matcher GPS, chat, profiler, billeder og login.
7. Test pÃ¥ mindst Ã©n rigtig iPhone, ikke kun simulator.
8. Udfyld `docs/APPLE_REVIEW_INFO.md` med testbruger og privacy policy URL.

## App Privacy-kladde til App Store Connect

Forvent at skulle deklarere fÃ¸lgende, hvis funktionerne er aktive i iOS-versionen:

| Datatype | Forventet svar | Hvorfor |
| --- | --- | --- |
| Contact Info | Ja | Navn, email og eventuelt telefon i medarbejderprofiler/login. |
| Location | Ja | Frivillig GPS/livekort og afhentningsopgaver. |
| User Content | Ja | Chat, opslag, billeder, logbog og opgaver. |
| Identifiers | Ja | Supabase Auth-bruger og interne profil-id'er. |
| Usage Data | Muligvis | MÃ¸d ind, opgaver, notifikationer og logbog, hvis det gemmes centralt. |
| Diagnostics | Kun hvis aktivt indsamlet | Deklareres kun hvis I bruger egentlig crash/diagnostiksporing. |

Vigtigt: App Privacy mÃ¥ ikke udfyldes pÃ¦nt for at komme hurtigere igennem. Den skal matche den faktiske app, Supabase-tabellerne og privacy policy.

## Lokal vedligeholdelse

NÃ¥r webappen Ã¦ndres, synkroniser iOS-projektet med:

```bash
npm run ios:sync
```

NÃ¥r bÃ¥de Android og iOS skal holdes i takt med webappen, brug:

```bash
npm run native:sync
```

PÃ¥ Windows kan synkronisering normalt opdatere filerne, men `pod install`, Xcode clean, simulatorbuild og arkivering skal ske pÃ¥ Mac.

## NÃ¦ste praktiske skridt

1. Ã…bn projektet pÃ¥ en Mac.
2. KÃ¸r `npm install` og `npm run ios:sync`.
3. Ã…bn `ios/App/App.xcworkspace` i Xcode.
4. VÃ¦lg team/signing og test pÃ¥ iPhone.
5. Ret navn/ikon/privacy-tekster, hvis Xcode viser mangler.
6. Upload fÃ¸rste build til TestFlight.

