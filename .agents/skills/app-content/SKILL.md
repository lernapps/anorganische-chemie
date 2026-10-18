---
name: app-content
description: Use for any content work in this app - researching, writing, extending, correcting or reviewing its competencies, chapters, pages, rounds, questions, exercises, figures, terms or sources. This app's own content decisions; they take precedence over the generic lernapps content skills. Load it before you change any content.
---

# Content guide of this app

Explainer "Anorganische Chemie – Einstieg" (de, en) for Klasse 7/8 (assumption of the creator, not fixed by a Lehrplan).
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
- `stoffe`: `src/stoffe/reinstoffe-gemische.yaml` (`gemische-finden`, `salzwasser-reinstoff`);
  `src/stoffe/stoffeigenschaften.yaml` (`zustand-bestimmen`, `siedetemperatur-ordnen`, `kupfer-kabel`).
- `teilchen`: `src/teilchen/teilchenmodell.yaml` (`zustand-beschreibung`, `wasser-fliesst`, `teilchen-groesser`, component
  `ParticleModel`); `src/teilchen/atombau.yaml` (component `AtomBuilder` id `atom-bauen`, `neutronen-berechnen`).
- `periodensystem`: `periodensystem-lesen.yaml` (`ordnungszahl-ablesen`, `periode-bestimmen`); `hauptgruppen.yaml`
  (`gruppe-name`, `aussenelektronen`, `hauptgruppe-bestimmen`); `metalle-nichtmetalle.yaml` (`metall-oder-nichtmetall`,
  `metalle-fest`, `metall-eigenschaft`, `bor-halbmetall`).
- `reaktionen`: `symbole-formeln.yaml` (`symbol-zuordnen`, `atome-ammoniak`, `atome-methan`); `reaktionen.yaml`
  (`vorgang-art`, `atome-entstehen`, `sicheres-zeichen`); `reaktionsgleichungen.yaml` (`koeffizient-wasser`,
  `koeffizient-magnesium`, `koeffizient-ammoniak`, `koeffizient-methan`, `gleichung-schritte`).

## Content structure

- Chapter folder `src/<chapter>/` with `chapter.yaml` (title, summary, pages), listed in `src/app.yaml`.
- Chapters and pages: `stoffe` (`reinstoffe-gemische`, `stoffeigenschaften`); `teilchen` (`teilchenmodell`, `atombau`);
  `periodensystem` (`periodensystem-lesen`, `hauptgruppen`, `metalle-nichtmetalle`); `reaktionen` (`symbole-formeln`,
  `reaktionen`, `reaktionsgleichungen`).
- Every page has the sections in this order and with these ids: `warum`, `regel`, `beispiel` (a box `example`),
  `uebung`. Titles: Warum, Regel, Beispiel, Übung (English: Why, Rule, Example, Practice). Every page has at least one
  exercise in `uebung`.
- A page explains one competency group in about 150–250 words in plain German plus figure and exercises.
- Ids short and stable; never reuse a removed id (`explainer-stable-ids`).

## Languages

- `languages: [de, en]`, German first (guess: the creator asked for "mehrsprachig"; the runtime supports de and en).
- Every learner text is a map `{ de, en }` (content, data files, component props); ids, numbers, formulas, symbols are
  the same. Exercise components take a `language` prop and export `about` and `describe` per language.
- English terms: Reinstoff = pure substance, Gemisch = mixture, Aggregatzustand = state of matter, Atomkern = nucleus,
  Hauptgruppe = main group.

## Terminology

- Learners are addressed with "du". Short sentences, active voice, technical terms explained at first use and as a
  `definition` block (glossary).
- Terms: Reinstoff, Gemisch, Teilchenmodell, Atom, Proton, Neutron, Elektron, Elementsymbol, Ordnungszahl, Periode,
  Gruppe, Metall, Nichtmetall, Verbindung, Formel, Reaktionsgleichung.
- Metall/Nichtmetall/Halbmetall: `artid` is `metall`, `nichtmetall` or `grenzfall`; the exercise only draws clear cases, borderline
  elements (B, Si, Ge, As, Se, Sb, Te, Bi, Po, At) are shown as "Grenzfall (Halbmetall)".
- Avoid "Molekül" before page `symbole-formeln`; avoid "Ion", "Bindung", "Elektronegativität" (later chapters, issue #1).
- Chemistry notation only with `\ce{…}` and `\pu{…}`; temperatures in °C, density in g/cm³.

## Exercise patterns

- Zuordnen/Benennen: `matching` (right entries must be different) or `single-choice`; every wrong option has `info`.
  Example: `src/teilchen/teilchenmodell.yaml`, `zustand-beschreibung`. Element symbols: `generated` with
  `answer.compare: { pairs: { left: name, right: symbol } }`, `src/reaktionen/symbole-formeln.yaml`, `symbol-zuordnen`.
- Ordnen: `ordering` for a fixed order (`gleichung-schritte`); with data `generated` and `compare: order`
  (`siedetemperatur-ordnen`: three drawn records `a`, `b`, `c` with `where` for distinct ones; a list cannot be a
  placeholder).
- Ablesen: `generated` with `given: { e: { pick: 1, from: { data: elemente } } }` and `compare: number` or
  `{ choice: [...] }` (`ordnungszahl-ablesen`, `periode-bestimmen`, `aussenelektronen`, `zustand-bestimmen`,
  `metall-oder-nichtmetall`). A mistake may not equal the answer for any record, so some have none; the hint then says
  where to look. `hauptgruppe-bestimmen` restricts the draw to groups 13–18 with `where` so that the mistake "group number
  instead of main group" never equals the answer.
- Auswählen: `multiple-choice` where several options are right, every option with `info` (`gemische-finden`, `vorgang-art`).
- Zählen: `number` with `tolerance: 0` and the typical mistakes (`atome-ammoniak`, `atome-methan`).
- Urteilen: `true-false` with the reason in `explanation` (`metalle-fest`: mercury is a liquid metal).
- Ausgleichen: `number` with a formula `\ce{…}` in the text and a blank `x`, e.g. `koeffizient-wasser`; the typical
  mistake per exercise has its message. The equations are fixed in the YAML (a placeholder cannot carry a formula);
  every equation was checked against a Wikipedia article (water, magnesium oxide, ammonia, methane).
- Aufbauen: component `AtomBuilder` (exercise, elements 1–10): set protons, neutrons, electrons for a given element;
  checks the property, not one model solution.
- Visualisieren: component `ParticleModel` (not an exercise) with a temperature slider and a `nojs` text.
- Data files `src/data/`: `stoffe.yaml` (9 pure substances: state, melting and boiling point), `elemente.yaml` (all 44
  elements of the eight main groups without the superheavy ones: Z, shells, group, main group, outer electrons, period,
  kind), `atome.yaml` (elements 1–20 with mass number and neutrons, because the most common isotope is not clear for
  heavier elements). Same fields in every record. Every value was checked against an opened source (named in the file's
  comment); new values need the same check.

## Figures

- Colours: Protonen rot, Neutronen grau, Elektronen blau, in all figures and components. Labels in both languages.
- Teilchenmodell: component `ParticleModel` with a temperature slider and a `nojs` text, and a `table` of the three states.
  No bundled images so far; own images would go to `src/images/` with `source: eigene Arbeit` and a licence.
- Atommodell: drawn live by the component `AtomBuilder` (nucleus, shells K–N). Periodensystem: a `table` of the main groups
  (columns) and periods (rows) with symbol and atomic number, built from `elemente.yaml`; main group names and elements in
  `hauptgruppen.yaml`.
- Every figure: `alt` says what it shows, caption what to look at; works at 360 px.
- Origin of drawings: own work, code of this repository (MIT); no third-party images.

## Sources

- KMK Bildungsstandards (above), read in full.
- Second explanations, opened and checked by title: Serlo Chemie (CC BY-SA 4.0), linked only, no sentences copied:
  `https://de.serlo.org/chemie/155713/was-ist-chemie`, `.../155714/grundlagenbegriffe`, `.../155706/stoffe`,
  `.../18902/stoffeigenschaften`, `.../19470/atommodelle`, `.../158240/das-periodensystem-der-elemente`,
  `.../155738/chemische-zeichensprache`, `.../18885/chemische-reaktionen`. Serlo Chemie is marked "im Aufbau".
- Not used: Wikibooks "Anorganische Chemie für Schüler" (licence unclear, GFDL), Bildungsserver link list.
- Data values and facts: de.wikipedia.org articles opened on 2026-10-18 and named in the comment of each data file
  (elements, Metalle, Halbmetalle, Nichtmetalle, Hauptgruppe, Reinstoff, Aggregatzustand, Reaktionsgleichung and the
  articles of the substances in `stoffe.yaml`). Wikipedia is CC BY-SA: facts are taken, no sentences are copied; links
  point to the articles.

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
