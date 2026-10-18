---
# Read by the hooks, the review, the evals. Schema: @lernapps/tooling/guidance/plan-front-matter.v1.schema.json
# Archetype as in the app's first plan; set it when you start. Never changes.
archetype: explainer
# Current phase. Allowed values: explore, plan, code, commit. Change the value line below, never this comment.
phase: commit
# prePushFailures: failed pre-push runs of this increment, written by the hook. Never change it.
prePushFailures: 0
---

# Increment: Periodensystem-Kapitel interaktiv

<!--
For you, the assistant. One increment of a published app: new competencies, chapters, pages, rounds, questions, or
a correction.
- Path: .vibe/plans/<NN>-<short name>.md, NN = highest + 1. Highest = current; never change earlier plans.
  App with only `.vibe/plan.md`: that is plan 01; start this as 02 (the update in Code moves it).
- Read every skill and page named here in full, from its file (`.agents/skills/`, curl). Never a summarising fetch tool.
- The first version's decisions stand: archetype, content method, content guide
  `.agents/skills/app-content/SKILL.md`. Change the guide only for a new pattern, figure type or source rule; say
  so at the checkpoints.
- One phase at a time, tasks in order. Done → tick `[x]` at once, move it to "Completed". New task → add it.
- Checkpoint task: stop, ask, wait for the creator's answer.
- Work on the branch `increment/<NN>-<short name>` until the yes to publish; push only that branch. A failing check:
  tell the creator, do not push.
- Plan in the creator's language. Keep headings and front matter keys. Delete a comment once its part is filled.
-->

*Gestartet 2026-10-18. Explore, Plan, Code, Commit.*

## Goal

Alle Seiten des Kapitels "Periodensystem" (Periodensystem lesen, Die acht Hauptgruppen, Metalle und Nichtmetalle) arbeiten mit der farbigen, interaktiven Karte: Lernende erkunden die Elemente dort, üben direkt auf der Karte und lesen dafür deutlich weniger Fließtext. Der Grammatikfehler "1 Außenelektronen" und gleich gebaute Fälle ("1 Protonen") sind behoben.

## Key decisions

- Kein neuer Lernstoff: die Kompetenzen des Kapitels bleiben, nur Darstellung und Übungsform ändern sich (Creator: "Das Periodensystem-Kapitel mit seinen Unterelementen sollte komplett Gebrauch von der interaktiven Komponente machen").
- Die Komponente `PeriodicTable` bekommt zwei Sichten: nach Hauptgruppe und nach Metall/Nichtmetall/Grenzfall, plus Hervorheben einer Periode. Ein Umschalter steht nur dort, wo beide Sichten sinnvoll sind.
- Neue Übungskomponente `ElementFinder`: Lernende tippen auf der Karte das gesuchte Element oder die gesuchten Elemente an. Eigenschaften werden geprüft, nicht eine Musterlösung (Eigenschaft statt Lösung, `success.md`).
- Die statische Tabelle der Hauptgruppen und die Formular-Übungen des Kapitels entfallen, soweit die Karte und `ElementFinder` sie ersetzen. Die `nojs`-Texte der Komponenten tragen den Inhalt ohne JavaScript.
- Die Startseite und die Kapitelseiten bleiben, wie sie sind: sie werden von der Vorlage erzeugt und lassen keine Blöcke zu (guess: Karte nur auf den drei Unterseiten).
- Gleiche Plural-Korrektur in `AtomBuilder` ("1 Proton", "2 Protonen"), weil dort derselbe Fehler steckt (guess: der Creator wollte "den Grammatikfehler" im Ganzen behoben haben).

## Notes

Quellen und Daten bleiben die der ersten Version (Inhaltsführer): KMK-Bildungsstandards, Wikipedia-Artikel der Elemente und Gruppen, Serlo nur verlinkt. Es kommen keine neuen Fakten dazu.

Kompetenzen des Kapitels, unverändert:
- Ich kann aus dem Periodensystem Ordnungszahl und Elementsymbol ablesen.
- Ich kann Elemente einer Gruppe oder Periode zuordnen.
- Ich kann Metalle und Nichtmetalle unterscheiden.
- Ich kann die Hauptgruppe eines Elements nennen und daraus die Außenelektronen ableiten (Hauptgruppen-Seite).

Didaktischer Ansatz je Seite (alles als "guess" markiert, bis der Creator bestätigt hat):
- `periodensystem-lesen`: Karte oben, Tippen auf eine Periodenzeile hebt sie hervor und sagt "Atome mit n Schalen". Übung `ElementFinder`: Element nach Name, nach Ordnungszahl, nach Periode und Hauptgruppe finden.
- `hauptgruppen`: Karte wie bisher, darunter weniger Text. Übung `ElementFinder`: alle Elemente einer Hauptgruppe antippen; ein Element mit n Außenelektronen finden.
- `metalle-nichtmetalle`: Karte mit Umschalter "nach Hauptgruppe / nach Art" und Steckbrief. Übung `ElementFinder`: ein Metall oder Nichtmetall einer Periode finden. Die beiden Wahr-falsch- und Auswahlfragen bleiben, weil sie Begründungen prüfen.

Umfang: alle 44 Elemente der Hauptgruppen, Deutsch und Englisch, Handy ab 360 px, Tastaturbedienung. Nicht im Umfang: Übergangsmetalle, andere Kapitel, die Startseite.

## Explore

### Tasks

- [x] Set `archetype` as in the app's first plan in `.vibe/plans/`.
- [x] Skills are in `.agents/skills/`. Only if missing: `npx skills add lernapps/tooling#exp/compact-guidance`.
- [x] Load the content guide `.agents/skills/app-content/SKILL.md` and skill `lernapps-content-growth`; read the
      plans in `.vibe/plans/` (what the app teaches, how content is made, what is open).
- [x] Ask: which competencies, chapters or rounds, for which school years?
- [x] Research: the guide's curriculum and sources; skill `lernapps-content-research` for the rest. Under "Notes":
      curriculum orientation (Lehrplan cited where used), new competencies by chapter as Ich-kann-Sätze, verified
      sources.
- [x] Ask: which hurdles and misconceptions, which examples or experiments for the new content? Under "Notes": the
      didactic approach per competency and the scope (in, out, data range).
- [x] **Checkpoint:** research. Show in plain words: curriculum orientation, new competencies by chapter, didactic
      approach, scope, sources and how checked, what is unchecked. Stop and wait. Changes → change, ask again.
- [x] Set `phase: plan`: change the value line (`grep '^phase:'` prints `phase: plan`).

### Answers

- Kapitel: "Das Periodensystem-Kapitel mit seinen Unterelementen sollte komplett Gebrauch von der interaktiven Komponente machen. Der Grammatikfehler kann da mit geregelt werden."
- Anlass: "Unsere neue Periodensystem-Komponente ist da viel zu selten eingebunden." und "Wenn ich die Adresse öffne, stehen da immer noch sehr viele Fließtexte."
- Zu Umfang und Plan: "Wir sollten das jetzt einfach noch zu einem ersten brauchbaren Abschluss bringen, so dass es einen sinnvollen Mehrwert bietet." (gelesen als Bestätigung von Recherche- und Plan-Haltepunkt; Veröffentlichen bleibt ein eigener Haltepunkt). Außerdem: keine Anfragen mehr an die andere Session.
- Hürden und Beispiele: nicht gefragt; die Annahmen stehen als "guess" unter "Notes".

### Completed

## Plan

<!-- Confirmable in one read. After the confirmation: work on your own (creator turns to the end: max 3). -->

### Tasks

- [x] Write the Code tasks: one slice per competency (skill `lernapps-content-growth`), in the guide's order; each
      ends in a commit.
- [x] Write "Content method": the guide's patterns, figures, components per slice; anything new, with why the
      guide's patterns do not fit.
- [x] Show the creator, short: goal, new competencies by chapter, slices; in plain words what learners see and do,
      and what is new. Max 2 questions.
- [x] Each new component or interactive exercise: show a sketch (static SVG or image, or the steps). Words alone are
      not enough.
- [x] **Checkpoint:** confirm the plan and the content method. Stop and wait for an explicit yes. Changes → change,
      ask again.
- [x] Set `phase: code`: change the value line (`grep '^phase:'` prints `phase: code`).

### Content method

- Muster aus dem Inhaltsführer: "Ablesen" und "Zuordnen" werden zu einer neuen Eigenschaft-Übung auf der Karte, `ElementFinder` (neues Muster, kommt in derselben Scheibe in den Inhaltsführer); Wahr-falsch und Auswahl bleiben wie bisher.
- Komponenten: `PeriodicTable` (neue Sicht "nach Art", Hervorheben einer Periode, Prop `mode`), neue Übungskomponente `ElementFinder` (Aufgaben aus den Elementdaten, Prüfung nach Eigenschaft, Begründung beim Fehler, `nojs` aus `describe`). Warum kein Block passt: ein Block kann kein Antippen eines Elements auf einer Karte prüfen (`prefer-built-in-block`).
- Daten: die Elemente der Karte stehen als Props im Seitenblock (aus derselben Quelle wie `src/data/elemente.yaml`); `ElementFinder` bekommt eine schlanke Liste (Symbol, Name, Ordnungszahl, Gruppe, Periode, Außenelektronen, Art).
- Abbildungen: keine Bilder; Farben der Hauptgruppen bleiben, für die Sicht "nach Art" kommen drei neue helle Füllungen mit dunklem Text (Kontrast mindestens 7:1, im Test geprüft); jedes Feld nennt Gruppe oder Art zusätzlich als Text.
- Grenzen: `ElementFinder` fragt nur nach den 44 Elementen der Hauptgruppen; Grenzfälle (Halbmetalle) kommen in Aufgaben nach Art nicht als Lösung vor, weil die Quellen sich uneinig sind; eine neue Aufgabe wählt Element und Aufgabentyp nach der Aufgabennummer (immer dieselbe Aufgabe pro Nummer).
- Neue Aufgabentypen später: ein Eintrag in `ElementFinder.ts` (Typ, Text je Sprache in `labels`, Prüfung) und ein Test, dann im Inhaltsführer ergänzen.

### Completed

## Code

<!--
- Load skill lernapps-app, the archetype's skill and the content guide before content.
- Commit after each slice; the hooks check. Pre-commit fails → read node_modules/.cache/lernapps/pre-commit.log.
- Fix from the message; never bypass a hook. Undecidable → choose, mark "(guess)", go on.
- Creator asks for a change → first say your reading in one sentence; never narrow it silently.
-->

### Tasks

- [x] `git switch -c increment/02-periodensystem-interaktiv` from `main`. Commit this plan on it.
- [ ] `npx --yes github:lernapps/tooling#exp/compact-guidance update`, then `npm install`. It replaces the `lernapps-*` skills: reread
      the ones you use. Commit the update alone; fix its check findings before content.
- [x] Slice 1, Plural: "1 Proton" statt "1 Protonen" in `AtomBuilder` (Text, Begründung, Test). Commit.
- [x] Slice 2, Karte: `PeriodicTable` mit Sicht "nach Art", Hervorheben einer Periode, Prop `mode`; Test; `nojs` bleibt vollständig. Commit.
- [x] Slice 3, Übung: `ElementFinder` (Logik, Test, Ansicht) mit den Aufgabentypen Name, Ordnungszahl, Periode und Hauptgruppe, alle Elemente einer Hauptgruppe, Außenelektronen, Art und Periode. Commit.
- [x] Slice 4, Seiten: `periodensystem-lesen`, `hauptgruppen`, `metalle-nichtmetalle` mit Karte und `ElementFinder`, kürzere Texte, Eintrags-Themen. Commit.
- [x] The content guide describes the app as it is now: competencies, chapters, patterns, procedure for the next
      increment (`app-content-matches`). `grep -c "FILL IN" .agents/skills/app-content/SKILL.md` prints 0.
- [x] `npx lernapps check` passes.
- [x] Every box of Explore, Plan and Code ticked.
- [x] Set `phase: commit`: change the value line (`grep '^phase:'` prints `phase: commit`).

### Completed

## Commit

<!--
- Push to `main` = publish (workflow `Pages`, job `deploy`). A pull request to `main` runs the same checks without
  publishing.
-->

### Tasks

- [ ] Push the branch; open a pull request to `main`. Pre-push runs the heavy checks; fix failures. See the pull
      request's checks to green. GitHub step fails or refused → skill `lernapps-github`.
- [ ] **Checkpoint:** publish. Show what the increment adds and the preview link from the comment "Vorschau der
      App"; ask whether it may go online. Wait for the yes.
- [ ] Merge the pull request into `main` (no pull request: merge the branch, push `main`). Watch the `Pages` run of
      that commit. Fails → read the failed step, fix, push.
- [ ] Open the address the job `deploy` printed ("published at ...", run summary); confirm the new content. Never
      a derived address; follow redirects.
- [ ] App listed and the entry changes (topics, school years, summary) → load skill `lernapps-listing`, write the
      changed entry. Else skip the next task.
- [ ] **Checkpoint:** list. Ask before opening the pull request to the catalog; wait for the yes.
- [ ] Fill the retrospective.
- [ ] Commit this plan on `main` and push it. A push of only `.vibe/` publishes nothing.
- [ ] Catalog pull request opened → see it to "bestanden" as the skill says.
- [ ] Plan changed since its last push → commit on `main`, push again.

### Completed

## Retrospective

<!-- At the end of Commit. Facts, short, no names. Read by review and evals. -->

### Phases reached

<!-- Last phase completed, checkpoints passed. E.g. "commit; confirmed, published". -->

### Failed checks

<!-- Each failed check: rule id, count. E.g. "`no-request-before-click`: 2". Not the pre-push count. -->

### Creator turns after the plan

<!-- Number of creator messages after the confirmation, topic of each. Target: max 3. -->

### Where I had to guess

<!-- Each gap in plan, skills, content guide, messages or answers, and your choice. "None" if none. -->
