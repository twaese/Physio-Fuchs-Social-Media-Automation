const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle,
} = require('docx');

const GRUEN = '809B3D', BRAUN = '5D4739', CREME = 'F4EFE2';
const ROT = 'B3352B', GRUEN_OK = '2E7D32';
const W = 9360;

const p = (t, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 120 },
  children: [new TextRun({
    text: t, bold: o.bold, italics: o.italic, size: o.size ?? 22,
    color: o.color, font: o.mono ? 'Consolas' : 'Calibri',
  })],
});
const h1 = (t) => new Paragraph({
  spacing: { after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GRUEN, space: 8 } },
  children: [new TextRun({ text: t, bold: true, size: 40, color: BRAUN, font: 'Calibri' })],
});
const h2 = (t) => new Paragraph({
  spacing: { before: 300, after: 140 },
  children: [new TextRun({ text: t, bold: true, size: 26, color: BRAUN, font: 'Calibri' })],
});
const marke = () => new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'PHYSIO FUCHS', bold: true, size: 20, color: GRUEN, font: 'Calibri' })],
});
const bullet = (t, o = {}) => new Paragraph({
  bullet: { level: 0 }, spacing: { after: 80 },
  children: [new TextRun({ text: t, size: 22, font: 'Calibri', bold: o.bold, color: o.color })],
});
const check = (t) => new Paragraph({
  spacing: { after: 90 },
  children: [
    new TextRun({ text: '☐   ', size: 24, font: 'Calibri' }),
    new TextRun({ text: t, size: 22, font: 'Calibri' }),
  ],
});
const zitat = (t) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [W],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: W, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: CREME },
    margins: { top: 150, bottom: 150, left: 180, right: 180 },
    children: t.split('\n').map(z => new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: z, size: 21, font: 'Calibri', italics: true })],
    })),
  })] })],
});
// Zweispaltige Gegenüberstellung
const gegen = (paare, links, rechts) => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [
    new TableRow({
      tableHeader: true,
      children: [links, rechts].map((t, i) => new TableCell({
        width: { size: 4680, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: i === 0 ? ROT : GRUEN_OK },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 21, color: 'FFFFFF', font: 'Calibri' })] })],
      })),
    }),
    ...paare.map(([a, b]) => new TableRow({
      children: [a, b].map(t => new TableCell({
        width: { size: 4680, type: WidthType.DXA },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, size: 21, font: 'Calibri' })] })],
      })),
    })),
  ],
});
const tabelle = (kopf, zeilen, breiten) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: breiten,
  rows: [
    new TableRow({
      tableHeader: true,
      children: kopf.map((t, i) => new TableCell({
        width: { size: breiten[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GRUEN },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })],
      })),
    }),
    ...zeilen.map(z => new TableRow({
      children: z.map((t, i) => new TableCell({
        width: { size: breiten[i], type: WidthType.DXA },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, size: 20, font: 'Calibri' })] })],
      })),
    })),
  ],
});
const seite = (kinder) => ({
  properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
  children: kinder,
});
const mkDoc = (titel, kinder) => new Document({
  creator: 'Physio Fuchs', title: titel,
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [seite(kinder)],
});

// ===== 1. So schreiben wir =====
const d1 = mkDoc('So schreiben wir', [
  marke(), h1('So schreiben wir'),
  p('Gilt für alle Beiträge, Stories, Reels und Antworten auf Kommentare', { italic: true, color: '666666', after: 240 }),

  zitat('Wir sprechen wie eine erfahrene, herzliche Physiotherapeutin,\ndie ihren Patientinnen und Patienten auf Augenhöhe begegnet,\nfachlich erklärt, nichts verspricht und immer einlädt,\nin die Praxis zu kommen.'),

  h2('Drei Worte, die unseren Ton beschreiben'),
  bullet('Professionell – fachlich korrekt und sauber formuliert'),
  bullet('Sympathisch – warm, persönlich, mit echtem Interesse'),
  bullet('Motivierend – ermutigend, ohne Druck und ohne große Worte'),

  h2('Sie oder du?'),
  p('Im Feed siezen wir – das passt zum Praxiskontext. In Stories und Reels darf geduzt werden, wenn das Format locker ist. Wichtig ist nur: innerhalb einer Reihe bleiben wir einheitlich.', { after: 200 }),

  h2('Formulierungen'),
  gegen([
    ['heilt, beseitigt, verschwindet', 'kann helfen zu lindern, zu mobilisieren'],
    ['garantiert, 100 %, immer', 'häufig, bei vielen Menschen'],
    ['Sie müssen, Sie sollten', 'wir empfehlen, Sie können'],
    ['Wunder, Geheimtipp', 'einfach weglassen'],
    ['kostenlose Erstberatung', 'nichts versprechen ohne Rücksprache'],
  ], 'Lieber nicht', 'Besser so'),

  h2('Das geht gar nicht'),
  bullet('Versprechen, dass etwas heilt oder Beschwerden verschwinden'),
  bullet('Diagnosen über Social Media stellen'),
  bullet('Vorher-Nachher-Bilder ohne Einwilligung und Aufklärung'),
  bullet('Bilder, Namen oder Geschichten von Patientinnen und Patienten ohne schriftliche Einwilligung'),
  bullet('Vergleiche mit anderen Praxen oder Kolleginnen und Kollegen'),

  h2('Aufbau eines Beitrags'),
  tabelle(['Element', 'Regel'], [
    ['Erste Zeile', 'Der Aufhänger, maximal 80 Zeichen – er muss ohne „mehr anzeigen" funktionieren'],
    ['Länge', '80 bis 250 Zeichen für den Hauptteil, danach zwei bis drei kurze Absätze'],
    ['Emojis', 'Sparsam, höchstens drei pro Beitrag'],
    ['Hashtags', '8 bis 15, davon mindestens zwei mit lokalem Bezug'],
    ['Aufforderung', 'Genau eine pro Beitrag – Termin, Speichern oder Frage stellen'],
    ['Abschluss', 'Am besten eine Frage an die Leserinnen und Leser'],
  ], [2200, 7160]),

  h2('Ein guter und ein schlechter Aufhänger'),
  p('Gut:', { bold: true, after: 60 }),
  zitat('Stechender Schmerz im unteren Rücken nach langem Sitzen?\nDiese Mini-Übung dauert 60 Sekunden.'),
  p('Weniger gut:', { bold: true, after: 60 }),
  zitat('Hallo zusammen, heute zeigen wir euch eine super tolle Übung\ngegen Rückenschmerzen, die jedem hilft!'),
  p('Der zweite Aufhänger ist zu allgemein, enthält ein Heilversprechen und beginnt mit einer Floskel.', { size: 20, italic: true, after: 200 }),

  h2('Kommentare und Nachrichten'),
  bullet('Innerhalb von 24 Stunden antworten'),
  bullet('Bei medizinischen Fragen immer auf einen Termin verweisen, nie aus der Ferne einschätzen'),
  bullet('Bei Kritik: ruhig und sachlich bleiben, einmal antworten, dann in die Direktnachricht wechseln'),
  bullet('Bei Beleidigungen oder Spam: kommentarlos ausblenden'),

  h2('Kurz prüfen vor dem Veröffentlichen'),
  check('Kein Heilversprechen, keine Diagnose'),
  check('Kein Bezug zu Patientinnen und Patienten ohne Einwilligung'),
  check('Aufhänger steht in den ersten 80 Zeichen'),
  check('Genau eine Aufforderung'),
  check('8 bis 15 Hashtags, davon mindestens zwei lokal'),
  check('Höchstens drei Emojis'),
  check('Hinweis auf ärztliche Abklärung, wenn eine Übung gezeigt wird'),
]);

// ===== 2. Werberecht =====
const d2 = mkDoc('Was wir schreiben dürfen', [
  marke(), h1('Was wir schreiben dürfen'),
  p('Werberecht im Gesundheitsbereich – die praxisrelevanten Punkte', { italic: true, color: '666666', after: 240 }),

  p('Für Werbung im Gesundheitsbereich gelten strengere Regeln als anderswo. Der Gesetzgeber will verhindern, dass Menschen mit falschen Hoffnungen geworben wird. Für uns heißt das vor allem: Wir erklären und laden ein – wir versprechen nichts.', { after: 200 }),
  p('Diese Übersicht ist eine Arbeitshilfe, keine Rechtsberatung. Im Zweifel bitte anwaltlich prüfen lassen.', { italic: true, size: 20, after: 200 }),

  h2('Die wichtigsten Beispiele'),
  gegen([
    ['Diese Übung heilt Rückenschmerzen.', 'Diese Übung kann helfen, die Rückenmuskulatur zu mobilisieren.'],
    ['Garantiert schmerzfrei in 7 Tagen.', 'Viele Menschen erleben mit regelmäßiger Bewegung eine Erleichterung.'],
    ['Unsere Methode ist wirksamer als andere.', 'Allgemein erklären, wie etwas funktioniert.'],
    ['Frau M. war 10 Jahre in Schmerzen – jetzt ist sie beschwerdefrei!', 'Einblicke in den Praxisalltag ohne Versprechen.'],
    ['Sonst wird es immer schlimmer.', 'Bei anhaltenden Beschwerden empfehlen wir eine ärztliche Abklärung.'],
  ], 'So nicht', 'So gerne'),

  h2('Vorher-Nachher-Bilder'),
  p('Besonders heikel. Nur mit ausdrücklicher schriftlicher Einwilligung der abgebildeten Person – und nie als Therapie-Erfolg dargestellt. Ein allgemeiner Haltungsvergleich („vor dem Schreibtisch / nach fünf Minuten Übung") ist möglich. Im Zweifel: weglassen.', { after: 200 }),

  h2('Patientenstimmen'),
  p('Zurückhaltend einsetzen. Allgemeine Bewertungen zu zitieren ist unkritischer, als eine persönliche Geschichte zu erzählen. Niemals als Heilungsgeschichte darstellen, und nur anonymisiert und mit Einwilligung.', { after: 200 }),

  h2('Sätze, die wir anhängen dürfen'),
  p('Wenn eine Übung oder eine körperliche Empfehlung gezeigt wird:', { after: 100 }),
  zitat('Dieser Beitrag ersetzt keine ärztliche oder physiotherapeutische\nBeratung. Bei Beschwerden wenden Sie sich bitte an Ihre Ärztin\noder Ihren Arzt beziehungsweise an eine Physiotherapiepraxis.'),
  zitat('Bitte hören Sie auf Ihren Körper. Wenn eine Übung Schmerzen\nverursacht, brechen Sie sie ab.'),

  h2('Kurz prüfen vor dem Veröffentlichen'),
  check('Kein Heilversprechen'),
  check('Keine Diagnose'),
  check('Kein Wirksamkeitsversprechen für eine bestimmte Methode'),
  check('Keine Angst-Botschaft'),
  check('Kein Vorher-Nachher ohne Einwilligung und Aufklärung'),
  check('Keine Patientenstimme ohne Einwilligung'),
  check('Hinweissatz enthalten, wenn eine Übung gezeigt wird'),
  check('Kein Vergleich mit anderen Praxen oder Marken'),

  h2('Falls doch einmal eine Beschwerde kommt'),
  bullet('Den Beitrag sofort offline nehmen'),
  bullet('Screenshot der Beanstandung sichern'),
  bullet('An die Praxisleitung weiterleiten, gegebenenfalls an einen Anwalt'),
  bullet('Auf keinen Fall öffentlich im Affekt antworten'),
]);

// ===== 3. Videoaufnahmen =====
const d3 = mkDoc('Videoaufnahmen für den digitalen Avatar', [
  marke(), h1('Videoaufnahmen für den digitalen Avatar'),
  p('Anleitung für die Aufnahme mit dem Smartphone', { italic: true, color: '666666', after: 240 }),

  p('Damit aus der Aufnahme ein guter digitaler Avatar wird, muss das Video ein paar Anforderungen erfüllen. Die gute Nachricht: Das lässt sich mit dem Smartphone allein erledigen. Rechne mit etwa 30 Minuten für Aufbau, Probe und Aufnahme.', { after: 200 }),

  h2('Was du brauchst'),
  tabelle(['Was', 'Worauf achten'], [
    ['Smartphone', 'Ein aktuelles Gerät genügt völlig, 1080p reicht aus'],
    ['Stativ', 'Ein einfaches Smartphone-Stativ, notfalls ein Bücherstapel'],
    ['Hintergrund', 'Ruhige, helle Wand ohne Plakate. Nicht vor einem Fenster stehen'],
    ['Licht', 'Tageslicht von vorne – das Fenster also hinter der Kamera'],
    ['Ton', 'Smartphone-Mikrofon reicht, wenn der Raum nicht hallt. Besser sind AirPods'],
    ['Kleidung', 'Praxis-Polo oder neutrales Oberteil, keine auffälligen Muster'],
    ['Aussehen', 'So wie später auch in den Videos – der Avatar lernt genau dieses Erscheinungsbild'],
  ], [2000, 7360]),

  h2('Aufbau'),
  bullet('Querformat, nicht hochkant'),
  bullet('Die Kamera auf Augenhöhe stellen'),
  bullet('80 bis 120 Zentimeter Abstand – Kopf und Schultern im Bild, etwas Luft über dem Kopf'),
  bullet('Mindestens einen Meter Abstand zur Wand, damit kein harter Schatten entsteht'),
  bullet('Störgeräusche ausschalten: Lüftung, Telefon, Musik'),

  h2('Erst eine Probe'),
  p('Vor der eigentlichen Aufnahme ein kurzes Testvideo von etwa 30 Sekunden machen und anschauen:', { after: 120 }),
  check('Ist das Bild scharf?'),
  check('Sind die Augen gut zu sehen, ohne Schatten?'),
  check('Klingt die Stimme klar, ohne Hall?'),
  check('Sitzt die Kleidung?'),

  h2('Kleiner Tipp'),
  p('Sprich so, wie du auch mit einer Patientin sprechen würdest – ruhig, freundlich, mit einem Lächeln in der Stimme. Der Avatar übernimmt später genau diese Art zu sprechen.', { after: 200 }),

  zitat('Wenn etwas nicht klappt oder du unsicher bist: lieber einmal mehr\nnachfragen, als eine Aufnahme zu machen, die nachher nicht taugt.'),
]);

Promise.all([
  Packer.toBuffer(d1).then(b => (fs.writeFileSync('So-schreiben-wir.docx', b), b.length)),
  Packer.toBuffer(d2).then(b => (fs.writeFileSync('Was-wir-schreiben-duerfen.docx', b), b.length)),
  Packer.toBuffer(d3).then(b => (fs.writeFileSync('Videoaufnahmen-Anleitung.docx', b), b.length)),
]).then(l => console.log('geschrieben:', l));
