---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Explainer "Anorganische Chemie – Einstieg" for Klasse 7/8 (assumption of the creator, not fixed by a Lehrplan).
Plan: `.vibe/plans/01-anorganische-chemie.md`. Extensions (Bindungen, Reaktionen vertieft): issue #1.

## Curriculum

- Schulform, Land: none (creator wants no Landeslehrplan). Jahrgang: Klasse 7/8 (assumption).
- Orientation: KMK, Bildungsstandards im Fach Chemie für den Mittleren Schulabschluss (Jahrgangsstufe 10), Beschluss
  vom 16.12.2004, https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/2004/2004_12_16-Bildungsstandards-Chemie.pdf.
  Used: F 1.1–1.3, F 2.1–2.3, F 3.1, F 3.4, E 7. The standards end at Klasse 10; order and depth for Klasse 7/8 are
  derived by us, not quoted from a Lehrplan.
- The creator's own material: none. The app follows the competencies below.

## Competencies

1. Kapitel `stoffe` (Stoffe und ihre Eigenschaften), KMK F 1.1, F 2.1, F 2.3
   - Ich kann Reinstoffe und Gemische unterscheiden.
   - Ich kann Stoffe nach ihren Eigenschaften ordnen.
   - Ich kann aus den Eigenschaften eines Stoffs auf seine Verwendung schließen.
2. Kapitel `teilchen` (Teilchenmodell und Atombau), KMK F 1.2, F 1.3, F 2.2
   - Ich kann mit dem Teilchenmodell erklären, warum ein Stoff fest, flüssig oder gasförmig ist.
   - Ich kann den Bau eines Atoms mit einem Atommodell zeichnen.
   - Ich kann Protonen, Neutronen und Elektronen einem Atom zuordnen.
3. Kapitel `periodensystem` (Periodensystem), KMK E 7, F 2.1
   - Ich kann aus dem Periodensystem Ordnungszahl und Elementsymbol ablesen.
   - Ich kann Elemente einer Gruppe oder Periode zuordnen.
   - Ich kann Metalle und Nichtmetalle unterscheiden.
4. Kapitel `reaktionen` (Formeln und Reaktionen), KMK F 3.1, F 3.4
   - Ich kann Elemente und einfache Verbindungen mit Symbolen und Formeln schreiben.
   - Ich kann eine chemische Reaktion von einer physikalischen Veränderung unterscheiden.
   - Ich kann eine einfache Reaktionsgleichung mit Atomerhaltung aufstellen.

Page and exercise ids (page file, exercise id):
- Kapitel `stoffe`: `src/stoffe/reinstoffe-gemische.yaml` (`gemische-finden`, `salzwasser-reinstoff`) for Reinstoffe/Gemische;
  `src/stoffe/stoffeigenschaften.yaml` (`zustand-bestimmen`, `siedetemperatur-ordnen`, `kupfer-kabel`) for Eigenschaften, Ordnen und Verwendung.
- Other chapters: added when their pages exist.

## Content structure

- Chapter folder `src/<chapter>/` with `chapter.yaml` (title, summary, pages), listed in `src/app.yaml`.
- Pages: `reinstoffe-gemische`, `stoffeigenschaften` (stoffe); `teilchenmodell`, `atombau` (teilchen);
  `periodensystem-lesen`, `metalle-nichtmetalle` (periodensystem); `symbole-formeln`, `reaktionen`,
  `reaktionsgleichungen` (reaktionen).
- Every page has the sections in this order and with these ids: `warum`, `regel`, `beispiel` (a box `example`),
  `uebung`. Titles: Warum, Regel, Beispiel, Übung. Every page has at least one exercise in `uebung`.
- A page explains one competency group in about 150–250 words in plain German plus figure and exercises.
- Ids short and stable; never reuse a removed id (`explainer-stable-ids`).

## Terminology

- Learners are addressed with "du". Short sentences, active voice, technical terms explained at first use and as a
  `definition` block (glossary).
- Terms: Reinstoff, Gemisch, Teilchenmodell, Atom, Proton, Neutron, Elektron, Elementsymbol, Ordnungszahl, Periode,
  Gruppe, Metall, Nichtmetall, Verbindung, Formel, Reaktionsgleichung.
- Avoid "Molekül" before page `symbole-formeln`; avoid "Ion", "Bindung", "Elektronegativität" (later chapters, issue #1).
- Chemistry notation only with `\ce{…}` and `\pu{…}`; temperatures in °C, density in g/cm³.

## Exercise patterns

- Zuordnen/Benennen: `matching` or `single-choice` (Stoff ↔ Eigenschaft, Zustand ↔ Beschreibung); every wrong option has
  `info`.
- Ordnen: `ordering` (Stoffe nach Siedetemperatur, Zustände nach Teilchenabstand); only where the order is fixed.
- Ablesen: `generated` with `given: { e: { pick: 1, from: { data: elemente } } }` (Ordnungszahl, Gruppe, Periode,
  Neutronenzahl = Massenzahl − Protonenzahl); mistake "Massenzahl statt Protonenzahl" with message.
- Urteilen: `true-false` with the reason in `explanation` ("Alle Metalle sind fest": nein, Quecksilber).
- Ausgleichen: `generated` from `src/data/reaktionen.yaml`, asks for one coefficient; mistake "Atome nur auf einer
  Seite gezählt".
- Aufbauen: component `AtomBuilder` (exercise): set protons, neutrons, electrons for a given element; checks the
  property, not one model solution.
- Examples built: Ablesen/Wahl: `src/stoffe/stoffeigenschaften.yaml`, `zustand-bestimmen` (data `stoffe`); Ordnen:
  `siedetemperatur-ordnen` (three drawn records `a`, `b`, `c`, with `where` for distinct ones; a list cannot be a placeholder);
  Urteilen: `src/stoffe/reinstoffe-gemische.yaml`, `salzwasser-reinstoff`; Verwendung: `kupfer-kabel`.
- Other patterns: examples added when built.
- Data files `src/data/`: `stoffe.yaml`, `elemente.yaml` (Elemente 1–20), `reaktionen.yaml`. Same fields in every record.
  Every value is checked against an opened source before it goes in; the source is named in `sources`.

## Figures

- Colours: Protonen rot, Neutronen grau, Elektronen blau, in all figures and components. Labels in German.
- Teilchenmodell: three own SVGs (fest, flüssig, gasförmig) in `src/images/` plus component `ParticleModel` with a
  temperature slider and a `nojs` text.
- Atommodell: own SVG (Kern, Schalen), element 1–20. Periodensystem: `labelled-figure` or `table`.
- Every figure: `alt` says what it shows, caption what to look at; works at 360 px.
- Origin: eigene Arbeit; licence CC-BY-4.0 (default, the creator may change it).

## Sources

- KMK Bildungsstandards (above), read in full.
- Second explanations, opened and checked by title: Serlo Chemie (CC BY-SA 4.0), linked only, no sentences copied:
  `https://de.serlo.org/chemie/155713/was-ist-chemie`, `.../155714/grundlagenbegriffe`, `.../155706/stoffe`,
  `.../18902/stoffeigenschaften`, `.../19470/atommodelle`, `.../158240/das-periodensystem-der-elemente`,
  `.../155738/chemische-zeichensprache`, `.../18885/chemische-reaktionen`. Serlo Chemie is marked "im Aufbau".
- Not used: Wikibooks "Anorganische Chemie für Schüler" (licence unclear, GFDL), Bildungsserver link list.
- Data values: from sources named per file in `src/app.yaml` `sources`.

## Adding a chapter or round

1. Write the competencies ("Ich kann …") for the chapter into "Competencies" above.
2. Create `src/<chapter>/chapter.yaml` and list the folder in `chapters` of `src/app.yaml`.
3. One page file per competency group with the sections `warum`, `regel`, `beispiel`, `uebung`; list the pages in
   `chapter.yaml` in reading order.
4. New facts into `src/data/*.yaml` once, with the source checked; exercises from the patterns above.
5. Add `topics` (page path, section id) to the catalog entry; add the page/exercise ids to "Competencies".
6. `npx lernapps check`, then commit.

## Rules learned from mistakes

None yet.
