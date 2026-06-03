# Pilot: testbrugere og roller

## Regel

Testbrugere maa ikke oprettes som almindelige, aabne medarbejderinvitationer uden en klar pilot-aftale.

Creator/owner skal styre testbrugere, saa de ikke kan forveksles med rigtige kollegaer.

## Aktuel status

- `stralner2711@gmail.com` er owner/Appansvarlig.
- Visningsnavn er rettet til `Tommy Hansen`.
- `testchauffor@xpressintra.local` er kun en testmarkoer.
- Testinvitationen er sat til `cancelled`, saa den ikke ligger som en aaben invitation.

## Saadan tester vi sikkert

1. Brug din owner-bruger til at tjekke pc/web og mobil.
2. Opret kun en rigtig testchauffoer, naar vi skal teste login-flowet aktivt.
3. Brug en tydelig testmail og slet/annuller den efter testen.
4. Testchauffoeren skal have `access_role = employee`, aldrig `owner`.
5. Rigtige kollegaer oprettes foerst, naar pilotflowet er testet med dig og en kontrolleret testbruger.

## Minimumstest foer kollegaer inviteres

- Owner kan logge ind paa pc/web.
- Owner kan logge ind paa mobil.
- Testchauffoer kan logge ind som almindelig medarbejder.
- Testchauffoer kan ikke se creator/admin-vaerktoejer.
- Chat mellem owner og testchauffoer virker.
- Besked skrevet paa mobil kan ses paa pc.
- Besked skrevet paa pc kan ses paa mobil.
- Profilnavne vises som rigtige navne, ikke email.
- Supabase release-check er groen.
