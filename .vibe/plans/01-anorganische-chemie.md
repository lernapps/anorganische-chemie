---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# archetype: explainer | interactive | quiz; null until chosen in Explore.
archetype: explainer
# phase: explore | plan | code | commit. Set it on entering a phase.
phase: plan
# prePushFailures: written by the pre-push hook. Never change it.
prePushFailures: 0
---

# Plan: <app name>, first version

<!--
For you, the assistant.
- Path: .vibe/plans/01-<short name>.md. Later changes: increment template, own plan.
- Read this plan before each step. One phase at a time, tasks in order.
- Done → tick `[x]` at once, move it to "Completed" of its phase. Unticked boxes count as not done.
- New task found → add it.
- Read every skill and page named here in full, from its file (curl, cat). Never a summarising fetch tool.
- Checkpoint task: stop, ask, wait for the creator's answer.
- Work on the branch `work` until the first publish; push only `work`. Commit brings `work` into `main`.
- GitHub step fails → skill `lernapps-github`.
- Plan in the creator's language. Keep headings and front matter keys.
- Delete a comment once its part is filled.
-->

*Started <date>. Explore, Plan, Code, Commit.*

## Goal

Lernende der unteren Klassenstufen (7/8, Annahme) lernen die Grundlagen der anorganischen Chemie: Stoffe, Teilchen und Atombau, Periodensystem, Formeln und einfache Reaktionen. Auf jeder Seite üben sie selbst.

## Key decisions

- Archetyp explainer: der Stoff baut aufeinander auf, jede Seite erklärt und übt; ein Quiz allein erklärt nichts.
- Klassenstufen 7/8 (guess): "untere Klassenstufen" genannt, Jahrgang nicht bestätigt.
- Kein Landeslehrplan: Orientierung an den KMK-Bildungsstandards (Wunsch des Creators); Reihenfolge der unteren Stufen selbst abgeleitet.
- Sprachen `[de, en]` (guess): "mehrsprachig" ohne Sprachen genannt; das System kann für App-Texte nur Deutsch und Englisch. Alle Texte, Daten und Komponenten in beiden Sprachen.
- Hauptgruppen: alle 44 Elemente der acht Hauptgruppen ohne die superschweren (Creator: "alle Hauptgruppen (44, ohne die superschweren)"); Daten `elemente.yaml`. Die Neutronen-Übung bleibt bei Elementen 1–20 (`atome.yaml`), weil die Massenzahl des häufigsten Isotops sonst nicht eindeutig ist (guess).
- Interaktives Periodensystem (nach der Vorschau gewünscht): neue Komponente `PeriodicTable` auf der Seite `hauptgruppen`, farbig nach Hauptgruppe, Klick auf ein Element zeigt Steckbrief mit üblichen Verbindungen und Nutzen. Die bisherige Tabelle bleibt als Text für Lesende ohne JavaScript.
- Inhalte selbst geschrieben, Serlo (CC BY-SA 4.0) nur als Zweitquelle verlinkt (Creator: "schreib selbst, binde serlo ein wo sinnvoll").

## Notes

Lehrplan-Orientierung (kein Bundesland gewünscht, daher bundesweit):
- KMK: Bildungsstandards im Fach Chemie für den Mittleren Schulabschluss (Jahrgangsstufe 10), Beschluss vom 16.12.2004, Luchterhand 2005. Heruntergeladen und gelesen: https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2004/2004_12_16-Bildungsstandards-Chemie.pdf. Fachwissen F1 Stoff-Teilchen (F 1.1–1.5), F2 Struktur-Eigenschaft (F 2.1–2.3), F3 chemische Reaktion (F 3.1–3.7), F4 Energie (F 4.1–4.3); Erkenntnisgewinnung E7 (Atommodelle, Periodensystem). Gilt für das Ende von Klasse 10, nicht für Klasse 7/8: die Reihenfolge der unteren Stufen ist hier abgeleitet, kein Lehrplan zitiert.
- Kein Landeslehrplan (Wunsch des Creators). Eigenes Material des Creators: bisher keines genannt.

Zweitquellen (alle geöffnet, HTTP 200, Titel geprüft; Lizenz serlo.org: CC BY-SA 4.0 laut https://de.serlo.org/terms; nur verlinkt, nichts kopiert):
- https://de.serlo.org/chemie/155713/was-ist-chemie
- https://de.serlo.org/chemie/155714/grundlagenbegriffe
- https://de.serlo.org/chemie/155706/stoffe
- https://de.serlo.org/chemie/18902/stoffeigenschaften
- https://de.serlo.org/chemie/19470/atommodelle
- https://de.serlo.org/chemie/158240/das-periodensystem-der-elemente
- https://de.serlo.org/chemie/155738/chemische-zeichensprache
- https://de.serlo.org/chemie/18885/chemische-reaktionen
- Serlo-Chemie ist laut Seite noch "im Aufbau" (https://de.serlo.org/106081): Inhalte nicht ungeprüft übernehmen.

Nicht verwendbar / ungeklärt:
- Wikibooks "Anorganische Chemie für Schüler": Autorenseite nennt GFDL (alt), Lizenz ungeklärt, nicht kopieren (https://de.wikibooks.org/wiki/Anorganische_Chemie_f%C3%BCr_Sch%C3%BCler/_Autoren_und_Lizenzbestimmungen).
- Bildungsserver-Linkliste https://www.bildungsserver.de/Chemie-4919-de.html: keine freie Lizenz belegt; nicht als Quelle.
- Noch nicht geprüft: Lizenz von Wikipedia-Artikeln je Kompetenz (Wikipedia CC BY-SA), Wikimedia-Bilder.
- Noch nicht gelesen: references/sources.md des Skills (Prüfverfahren Zweitquellen), angefordert.

Kompetenzen je Kapitel (Entwurf, abgeleitet aus KMK F1/F2/F3/E7 und der Serlo-Gliederung; Klassenstufe 7/8 ist eine Annahme):

1. Stoffe und ihre Eigenschaften (KMK F 1.1, F 2.1, F 2.3)
   - Ich kann Reinstoffe und Gemische unterscheiden.
   - Ich kann Stoffe nach ihren Eigenschaften (z. B. Farbe, Dichte, Schmelztemperatur, Löslichkeit) ordnen.
   - Ich kann aus den Eigenschaften eines Stoffs auf seine Verwendung schließen.
2. Teilchenmodell und Atombau (KMK F 1.2, F 1.3, F 2.2)
   - Ich kann mit dem Teilchenmodell erklären, warum ein Stoff fest, flüssig oder gasförmig ist.
   - Ich kann den Bau eines Atoms mit einem Atommodell zeichnen.
   - Ich kann Protonen, Neutronen und Elektronen einem Atom zuordnen.
3. Periodensystem (KMK E 7, F 2.1)
   - Ich kann aus dem Periodensystem Ordnungszahl und Elementsymbol ablesen.
   - Ich kann Elemente einer Gruppe oder Periode zuordnen.
   - Ich kann Metalle und Nichtmetalle im Periodensystem unterscheiden.
4. Formeln und Reaktionen (KMK F 3.1, F 3.4)
   - Ich kann Elemente und einfache Verbindungen mit Symbolen und Formeln schreiben.
   - Ich kann eine chemische Reaktion von einer physikalischen Veränderung unterscheiden.
   - Ich kann eine einfache Reaktionsgleichung mit Atomerhaltung aufstellen.

Offen: genaue Inhalte je Seite mit Serlo-Seiten abgleichen (Passung pro Kompetenz noch nicht geprüft, daher Serlo-Seiten bisher nur "Titel geprüft").

## Explore

<!--
- Ask; write no code; run no `create`.
- Max 2 questions per message. Skip what earlier answers tell.
- Each answer → "Answers".
-->

### Tasks

- [x] Install the skills, if missing: `npx skills add lernapps/tooling#exp/compact-guidance`. The app commits them.
- [x] Tell the creator where the app lives: GitHub Pages of their own repo, free, public, own address (usually
      `https://<owner>.github.io/<repo>/`). Offer a short explanation of GitHub; say they need not know it. Page for
      them: <https://lernapps.net/tooling/github/>. Example: "Deine App wird über GitHub veröffentlicht, kostenlos
      und öffentlich, unter deiner eigenen Adresse. Soll ich dir kurz erklären, was GitHub ist?"
- [x] Set up the branches (main, gh-pages, work pushed; default branch main verified; Pages click done by the creator, not checkable via REST) before anything else is pushed:
      - settle the repo name with the creator first (a rename can cost your access);
      - no git repo: `git init --initial-branch=main`;
      - no `main` (`git ls-remote --heads origin main`, `git branch --list main` empty): `git switch --orphan main`,
        `git commit --allow-empty -m "chore: start"`, `git push -u origin main`;
      - missing `gh-pages`: `git switch --orphan gh-pages`, `git commit --allow-empty -m "chore: gh-pages"`;
      - missing `work`: `git switch -c work main`;
      - `git push -u origin gh-pages work`. No remote yet: push all three later, `main` first;
      - Pages from `gh-pages`, root (`pages-from-gh-pages`): `gh api -X POST repos/<owner>/<repo>/pages
        -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/"`; refused → put the click from skill
        `lernapps-github` into your next question;
      - default branch not `main` (`gh api repos/<owner>/<repo> --jq .default_branch`) → skill `lernapps-github`.
- [x] Ask: what do learners do in the app, what do they learn?
- [x] Ask: who are the learners (subject, school year, prior knowledge)?
- [x] Ask: where does the content come from (own, or others' with source and licence)?
- [x] Research: load skill `lernapps-content-research` and follow it (filled-in `app-content` first). Write under
      "Notes": curriculum orientation (Lehrplan cited where used), competencies by chapter as Ich-kann-Sätze,
      verified sources. No competencies written = task not done.
- [x] Fetch https://lernapps.net/apps/schemas/entry.v1.schema.json; read every property's description. Ask what
      helps teachers and parents find the app. Fill "Entry draft".
- [x] Choose the archetype; write it with its reason under "Key decisions"; set `archetype`:
      - `interactive`: learners act in one app page (game, trainer, simulation; e.g. a typing game);
      - `explainer`: many pages of explanation, each with exercises;
      - `quiz`: questions with options and feedback.
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, competencies by chapter, sources and
      how checked, what is unchecked, archetype and reason. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`.

### Answers

- Thema: "Anorganische Chemie"
- Lernende: "ich würde gerne bei den unteren Klassenstufen beginnen"
- Repository: "https://github.com/lernapps/anorganische-chemie"
- Inhalt: "schreib selbst, binde serlo ein wo sinnvoll" (Serlo als Zweitquelle/Link)
- Ersteller: "Ich bin Oliver (@mrsimpson)"
- Pages: "Pages ist eingerichtet." (nicht per REST prüfbar, Proxy sperrt den Pfad)
- Suchbegriffe: "Die Suchbegriffe sind sehr lang und sehr spezifisch" -> auf vier kurze gekürzt
- Aufbau: "Wir haben auf Lernapps schon den Mathe trainer und elektrizität. Wesentlicher Teil sind dabei Übungen und auch hilfreiche Visualisierungen"
- Plan-Checkpoint: "Ja, anlegen" (nach Vorlage von Plan, Skizzen, Übungen; Erweiterungen in Issue #1 vertagt)
- Rückfrage zu den Elementen: "wieso nimmst Du nur die Elemente 1-20 und nicht alle Hauptgruppen (44, ohne sdie superschweren)"
- Änderung nach dem Plan: "Es sollten alle Hauptgruppen berücksichtigt werden. Außerdem hätte ich das auch gerne mehrsprachig"
- Rückmeldung zur Vorschau: "Die Elektronen von Antimon sitzen auf Schalen mit 2, 8, 18, 18, 5 Elektronen. Was ist denn das für eine dämliche Formulierung in einem Quiz? Überhaupt sind die Hauptgruppen nicht ansprechend aufbereitet. Wenn wir schon eine Webanwendung haben, hätte ich gerne eine farbige, interaktive, neugierig machende Darstellung, in der ich über die Elemente und bspw. auch ihre üblichen Verbindungen und Nutzen erfahre"
- Checkpoint Recherche: "mach das" (nach Vorlage von Kapiteln, Quellen, Archetyp)
- Bundesland: "Diese Bundesland frag nervt. Sch** Föderalismus. Es geht um den Inhalt!" (kein Landeslehrplan)
- Quellen: "Recherchiere mal, welche Quellen es gibt"
- Reihenfolge Stoffe/Stoffeigenschaften, dann Atombau, Periodensystem, Formelsprache: "das klingt passend." 

### Entry draft

<!-- YAML valid against the entry schema; its property names. Only known values, never invented. -->

```yaml
title:
  de: Anorganische Chemie – Einstieg
  en: Inorganic chemistry – first steps
subject:
  de: Chemie
  en: Chemistry
grades: [7, 8]
summary:
  de: >-
    Du lernst, woraus Stoffe bestehen: Reinstoffe und Gemische, Atome, die Hauptgruppen des Periodensystems und
    einfache Reaktionsgleichungen. Du ordnest zu, baust Atome und rechnest selbst.
  en: >-
    You learn what substances are made of: pure substances and mixtures, atoms, the main groups of the periodic
    table and simple reaction equations. You match, build atoms and calculate on your own.
# url: nach der Veröffentlichung (Adresse aus dem Job "deploy")
creator:
  name: Oliver (@mrsimpson)
topics:
  - { title: { de: "Reinstoffe und Gemische", en: "Pure substances and mixtures" }, path: stoffe/reinstoffe-gemische/ }
  - { title: { de: "Stoffeigenschaften", en: "Properties of substances" }, path: stoffe/stoffeigenschaften/ }
  - { title: { de: "Teilchenmodell", en: "Particle model" }, path: teilchen/teilchenmodell/ }
  - { title: { de: "Atombau", en: "Atomic structure" }, path: teilchen/atombau/ }
  - { title: { de: "Periodensystem lesen", en: "Reading the periodic table" }, path: periodensystem/periodensystem-lesen/ }
  - { title: { de: "Die acht Hauptgruppen", en: "The eight main groups" }, path: periodensystem/hauptgruppen/ }
  - { title: { de: "Metalle und Nichtmetalle", en: "Metals and non-metals" }, path: periodensystem/metalle-nichtmetalle/ }
  - { title: { de: "Symbole und Formeln", en: "Symbols and formulas" }, path: reaktionen/symbole-formeln/ }
  - { title: { de: "Chemische Reaktionen", en: "Chemical reactions" }, path: reaktionen/reaktionen/ }
  - { title: { de: "Reaktionsgleichungen", en: "Reaction equations" }, path: reaktionen/reaktionsgleichungen/ }
keywords: [Atome, Periodensystem, Stoffe, Formeln]
source: https://github.com/lernapps/anorganische-chemie
fitness:
  account: false
  install: false
  storage: device
  thirdParty: none
  checked: false
```

### Completed

## Plan

<!-- Confirmable in one read. After the confirmation: work on your own (creator turns to the listing: max 3). -->

### Tasks

- [x] Write the Code tasks under "Code": pages or screens, content, what each shows; each ends in a commit.
- [x] Load the archetype's skill and skill `lernapps-exercise-patterns`. Write "Content method".
- [x] Show the creator, short: goal, competencies by chapter, entry draft, tasks; the content method in plain words
      (what learners see and do, what it cannot do). Max 2 questions.
- [x] Each component or interactive exercise: show a sketch (static SVG or image, or the steps with what learners
      see after each). Words alone are not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again. No `create` before the yes.
- [x] Set `phase: code`.

### Nachtrag nach der Vorschau: interaktives Periodensystem

- [ ] Skizze zeigen: farbige Karte der 44 Elemente, Steckbrief mit Verbindungen und Nutzen (Schritte unten im Chat).
- [ ] **Checkpoint:** Nachtrag bestätigen. Stop und auf ein ausdrückliches Ja warten.
- [ ] Set `phase: code`.

### Content method

- Seitenaufbau (alle Seiten gleich): Abschnitte `warum`, `regel` (Erklärung, Formel/Figur), `beispiel` (Box `example`), `uebung`. Ids kurz und stabil.
- Daten einmal als Datei, nie doppelt: `src/data/stoffe.yaml` (Name, Reinstoff/Gemisch, Aggregatzustand bei 20 °C, Schmelz- und Siedetemperatur, Verwendung), `elemente.yaml` (Ordnungszahl, Symbol, Name, Protonen, Neutronen des häufigsten Isotops, Elektronen pro Schale, Gruppe, Periode, Metall ja/nein), `reaktionen.yaml` (Gleichung mit Koeffizienten, Name). Jeder Wert wird beim Schreiben an einer geöffneten Quelle geprüft und die Quelle in `sources`/`source` genannt, nicht aus dem Gedächtnis.
- Übungsmuster (jeweils mit Beispiel im Inhaltsführer `app-content`):
  - Zuordnen/Benennen: `matching` und `single-choice` (Stoff ↔ Eigenschaft, Zustand ↔ Beschreibung), falsche Optionen mit `info`.
  - Ordnen: `ordering` (Stoffe nach Siedetemperatur, Aggregatzustände nach Teilchenabstand).
  - Ablesen: `generated` mit `pick: 1` aus `elemente.yaml` (Ordnungszahl, Gruppe, Periode, Anzahl Neutronen = Massenzahl − Protonen), typische Fehler "Massenzahl statt Protonen" mit Meldung.
  - Urteilen: `true-false` mit Begründung ("Alle Metalle sind fest": nein, Quecksilber).
  - Rechnen/Ausgleichen: `generated` aus `reaktionen.yaml`, gefragt ist ein Koeffizient; Fehler "Atome nur auf einer Seite gezählt".
  - Aufbauen: Komponente `AtomBuilder` (Übung).
- Abbildungen: Teilchenmodell als drei `image`-SVGs (fest, flüssig, gasförmig) und dazu die Komponente `ParticleModel`; Atommodell als SVG (Kern, Schalen) aus eigener Hand, gemeinfrei/CC0 vermerkt; Periodensystem als `labelled-figure` oder `table`. Alle Bilder selbst gezeichnet, Quelle "eigene Arbeit", Lizenz CC0-1.0 oder CC-BY-4.0 (zu klären mit dem Creator). Farben und Beschriftung gleich in der ganzen App (Protonen rot, Neutronen grau, Elektronen blau), im Inhaltsführer unter "Figures".
- Komponenten, nur wo kein Block reicht (`prefer-built-in-block`): `ParticleModel` — ein Regler für die Temperatur lässt Teilchen sich schneller bewegen und die Abstände sichtbar ändern; Blöcke zeigen nur stehende Bilder, eine Veränderung durch den Lernenden ist so nicht ausdrückbar. `nojs`: die drei Zustände mit Beschreibung. Prüft nichts. `AtomBuilder` — Lernende stellen Protonen, Neutronen, Elektronen für ein gegebenes Element ein; ein Block kann kein freies Zusammenstellen prüfen. Prüft die Eigenschaft (Protonenzahl = Elektronenzahl = Ordnungszahl, Neutronen = Massenzahl − Ordnungszahl), nicht nur die Musterlösung; Rückmeldung nennt den Grund (z. B. "Ein Atom ist neutral: gleich viele Protonen wie Elektronen").
- Grenzen: Teilchenmodell ist vereinfacht (keine Quantenmechanik, Schalenmodell bis Element 20); Komponenten brauchen Tastatur- und Touch-Bedienung, Alternativen als Text; keine Gefahrstoff-Versuche, nur Hinweise auf Sicherheit im Unterricht.
- Neues Kapitel später: Ordner mit `chapter.yaml`, Eintrag in `src/app.yaml`, Seiten nach dem Seitenaufbau, neue Daten in `src/data/`, Kompetenzen im Inhaltsführer ergänzen, Eintrags-`topics` ergänzen.

### Completed

## Code

<!--
- Commit after each task; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook.
- Undecidable → choose, mark "(guess)" under "Key decisions", go on.
- `create` needs git, Node ≥ 22.18, github.com, codeload.github.com, registry.npmjs.org. Blocked → ask the creator
  to allow it, rerun. Never write the app by hand.
-->

### Tasks

- [x] Only after the confirmation: in this plan's folder, `npx --yes github:lernapps/tooling#exp/compact-guidance create
      --archetype <archetype>`. Keeps this plan.
- [x] `git switch work`, then `npm install` (dependencies, git hooks). From now on: `npx lernapps check`.
- [x] Commit the generated app with this plan on `work`.
- [x] Load skill `lernapps-app` and the archetype's skill.
- [x] Fill the content guide `.agents/skills/app-content/SKILL.md` from the plan and its content method: replace
      every placeholder comment with concrete instructions (files, ids, data files, one example). Delete its top
      comment. `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` must print 0. Commit it before any content.
- [x] Kapitel 1 "Stoffe und ihre Eigenschaften" (Seiten `reinstoffe-gemische`, `stoffeigenschaften`): Daten `src/data/stoffe.yaml`, Erklärung, Tabelle, Übungen; Commit.
- [x] Kapitel 2 "Teilchenmodell und Atombau" (Seiten `teilchenmodell`, `atombau`): Komponente `ParticleModel` (Regler Temperatur) mit `nojs`, Komponente `AtomBuilder` (Übung) mit Logik und Test; Commit je Komponente.
- [x] Kapitel 3 "Periodensystem" (Seiten `periodensystem-lesen`, `metalle-nichtmetalle`): Daten `src/data/elemente.yaml` (Elemente 1–20), `labelled-figure` des Periodensystems, `generated`-Übungen; Commit.
- [x] Kapitel 4 "Formeln und Reaktionen" (Seiten `symbole-formeln`, `reaktionen`, `reaktionsgleichungen`): Daten `src/data/reaktionen.yaml`, `\ce{…}`-Formeln, Atomzählungs-Figuren, `generated`-Übungen; Commit.
- [x] `src/app.yaml` (Titel, Einleitung, Kapitelreihenfolge, `sources`: KMK, Serlo), Glossar aus `definition`-Blöcken; Commit.
- [x] Katalogeintrag: `topics` aus den fertigen Seiten und Abschnitts-ids; Commit.
- [x] Content guide still matches what was built (`app-content-matches`); `grep -c "FILL IN"` prints 0.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`.

### Completed

## Commit

<!--
- Push to `main` = publish (workflow `Pages`, job `deploy`). Until the creator's yes: branch `work`.
- Only `main` publishes; it must be the default branch. Explore set up branches and Pages; here: verify.
- A push of only `.vibe/` publishes nothing; push the plan when a task says so.
- Every push to `main` needs a run of `Pages`: none after a minute
  (`gh run list --workflow Pages --branch main --commit <commit>`) → `gh workflow run Pages --ref main`.
- "403 Resource not accessible by integration" → a click for the creator (skill `lernapps-github`). Never push to
  trigger a run.
-->

### Tasks

- [x] `git push -u origin work` (not `main`). Pre-push runs the heavy checks; fix failures.
- [x] Verify over REST: default branch `main` (`gh api repos/<owner>/<repo> --jq .default_branch`); Pages serves
      `gh-pages` from `/` (`gh api repos/<owner>/<repo>/pages`; "Not Found" = off). Not right and not yours to
      change → note the creator's click (skill `lernapps-github`).
- [ ] **Checkpoint:** publish. Ask before the app goes online; wait for the yes. Put the noted clicks into the same
      question.
- [ ] `git switch main`, `git merge --ff-only work`, `git push origin main`. Run started?
      `gh run list --workflow Pages --branch main --commit "$(git rev-parse HEAD)"`; none after a minute →
      `gh workflow run Pages --ref main` (refused: creator clicks Actions → Pages → Run workflow). Watch it
      (`gh run watch`). Fails → read the failed step, fix, push. Admin-only Pages setting → the run deployed
      anyway; after the creator's click the app appears without a new run.
- [ ] Open the address the job `deploy` printed ("published at ...", also in the run summary); confirm the app shows.
      Use that address, never a derived one; follow redirects. Do not wait for it yourself.
- [ ] Load skill `lernapps-listing`.
- [ ] Complete the entry draft (e.g. the address).
- [ ] **Checkpoint:** list. Ask before opening the listing pull request; wait for the yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it (listing check and review read it there).
- [ ] Open the listing pull request as the skill says; see it to "bestanden" (not "nicht bestanden") in the results
      comment.
- [ ] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit, before the listing pull request. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Failed checks

<!-- Each failed check: rule id, count. E.g. "`no-request-before-click`: 2". Not the pre-push count. -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, messages or answers, and your choice. "None" if none. -->
