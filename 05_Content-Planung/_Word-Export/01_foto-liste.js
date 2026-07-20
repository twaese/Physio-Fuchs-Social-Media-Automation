const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
} = require('docx');

const GRUEN = '809B3D';
const BRAUN = '5D4739';
const CREME = 'F4EFE2';

const W = 9360;              // Textbreite in DXA (A4 minus Ränder)
const COLS = [700, 1100, 2000, 3260, 2300];

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120 },
  alignment: opts.align,
  children: [new TextRun({
    text, bold: opts.bold, italics: opts.italic, size: opts.size ?? 22,
    color: opts.color, font: 'Calibri',
  })],
});

const h = (text, level) => new Paragraph({
  heading: level,
  spacing: { before: 280, after: 140 },
  children: [new TextRun({ text, bold: true, color: BRAUN, font: 'Calibri', size: level === HeadingLevel.HEADING_1 ? 32 : 26 })],
});

const bullet = (text) => new Paragraph({
  bullet: { level: 0 },
  spacing: { after: 80 },
  children: [new TextRun({ text, size: 22, font: 'Calibri' })],
});

const zelle = (text, opts = {}) => new TableCell({
  width: { size: opts.w, type: WidthType.DXA },
  shading: opts.shade ? { type: ShadingType.CLEAR, fill: opts.shade } : undefined,
  margins: { top: 80, bottom: 80, left: 100, right: 100 },
  children: [new Paragraph({
    children: [new TextRun({
      text, bold: opts.bold, size: opts.size ?? 19,
      color: opts.color, font: opts.mono ? 'Consolas' : 'Calibri',
    })],
  })],
});

// --- Daten ---
const posts = [
  ['12', '03.08.', 'Wirbelsäule', 'PF_2026_012_wirbelsaeule.jpg', 'Rückenbehandlung oder richtiges Heben', false],
  ['15', '24.08.', 'Praxis & Team', 'PF_2026_015_erstbehandlung.jpg', 'Empfang oder Anamnesegespräch', true],
  ['16', '31.08.', 'Sport & Prävention', 'PF_2026_016_sport_praevention.jpg', 'Übung mit Theraband, Laufanalyse', false],
  ['18', '14.09.', 'Herbst-Gesundheit', 'PF_2026_018_herbst_gelenke.jpg', 'Praxis von außen, herbstliche Stimmung', false],
  ['20', '28.09.', 'Entspannung', 'PF_2026_020_schlafposition.jpg', 'Lagerung auf der Behandlungsliege', false],
  ['21', '05.10.', 'Praxis & Team', 'PF_2026_021_haltungsanalyse.jpg', 'Haltungsanalyse, seitliche Ansicht', true],
  ['22', '12.10.', 'Knie & Hüfte', 'PF_2026_022_knie_huefte.jpg', 'Knie- oder Hüftbehandlung', false],
  ['23', '19.10.', 'Sport & Prävention', 'PF_2026_023_laufen_herbst.jpg', 'Laufschuhe, Aufwärmübung', false],
  ['25', '02.11.', 'Entspannung', 'PF_2026_025_waerme_kaelte.jpg', 'Wärmepackung oder Kühlkompresse', false],
  ['26', '09.11.', 'Nacken & Schultern', 'PF_2026_026_nacken_kopfschmerz.jpg', 'Nacken- oder Schulterbehandlung', false],
  ['27', '16.11.', 'Praxis & Team', 'PF_2026_027_team_rueckblick.jpg', 'Teamfoto – alle zusammen', true],
  ['28', '23.11.', 'Haltung', 'PF_2026_028_homeoffice_haltung.jpg', 'Sitzhaltung am Schreibtisch', false],
  ['29', '30.11.', 'Sport & Prävention', 'PF_2026_029_wintersport.jpg', 'Kraftübung für die Beine', false],
  ['30', '07.12.', 'Entspannung', 'PF_2026_030_weihnachtsstress.jpg', 'Ruhige Entspannungssituation', false],
  ['32', '21.12.', 'Praxis & Team', 'PF_2026_032_vorsaetze_2027.jpg', 'Team oder Empfang, Jahreswechsel', true],
];

const kopf = new TableRow({
  tableHeader: true,
  children: ['Nr.', 'Termin', 'Thema', 'So muss die Datei heißen', 'Motiv-Idee']
    .map((t, i) => zelle(t, { w: COLS[i], bold: true, shade: GRUEN, color: 'FFFFFF' })),
});

const zeilen = posts.map(([nr, datum, thema, datei, motiv, wichtig]) => new TableRow({
  children: [
    zelle(nr, { w: COLS[0], shade: wichtig ? CREME : undefined }),
    zelle(datum, { w: COLS[1], bold: true, shade: wichtig ? CREME : undefined }),
    zelle(thema + (wichtig ? '  ★' : ''), { w: COLS[2], shade: wichtig ? CREME : undefined }),
    zelle(datei, { w: COLS[3], mono: true, size: 17, shade: wichtig ? CREME : undefined }),
    zelle(motiv, { w: COLS[4], shade: wichtig ? CREME : undefined }),
  ],
}));

const doc = new Document({
  creator: 'Physio Fuchs',
  title: 'Foto-Wunschliste',
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    children: [
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: 'PHYSIO FUCHS', bold: true, size: 20, color: GRUEN, font: 'Calibri' })],
      }),
      new Paragraph({
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GRUEN, space: 8 } },
        children: [new TextRun({ text: 'Fotos für die nächsten Beiträge', bold: true, size: 40, color: BRAUN, font: 'Calibri' })],
      }),
      p('Stand: 20. Juli 2026', { italic: true, color: '888888', after: 240 }),

      p('Liebe Judith,', { after: 160 }),
      p('unsere nächsten 15 geplanten Beiträge – von Anfang August bis kurz vor Weihnachten – laufen aktuell alle mit demselben Bild: dir mit einer Patientin im Behandlungsraum. Ein schönes Foto, aber alle zwei Wochen dasselbe fällt im Feed auf.', { after: 160 }),
      p('Unten stehen alle 15 Beiträge mit dem passenden Dateinamen. Wenn du ein Foto dazu hast, benenne es genau so und lege es in den Ordner – der Rest passiert automatisch.', { after: 240 }),

      h('So einfach geht es', HeadingLevel.HEADING_2),
      bullet('Foto aussuchen (Handy reicht völlig)'),
      bullet('Umbenennen – Dateiname aus der Tabelle übernehmen'),
      bullet('Ablegen unter: Content_Socialmedia \\ Fotos \\ 2026'),
      bullet('Fertig – das Foto wird beim nächsten Durchlauf automatisch eingebaut'),

      h('Die 15 Beiträge', HeadingLevel.HEADING_2),
      p('★ = Beiträge über die Praxis und das Team. Hier wirkt ein echtes Bild von euch am stärksten – und genau diese Beiträge helfen dabei, dass sich neue Kolleginnen und Kollegen bei uns melden.', { size: 20, italic: true, after: 160 }),

      new Table({
        width: { size: W, type: WidthType.DXA },
        columnWidths: COLS,
        rows: [kopf, ...zeilen],
      }),

      h('Wenn die Zeit knapp ist', HeadingLevel.HEADING_2),
      p('Falls nicht alle 15 auf einmal machbar sind – diese Reihenfolge bringt am meisten:', { after: 120 }),
      bullet('Zuerst die vier mit ★ (24.08., 05.10., 16.11., 21.12.). Für den 16.11. wäre ein richtiges Teamfoto ideal.'),
      bullet('Danach die zeitnahen Termine: 03.08. und 31.08.'),
      bullet('Der Rest kann nach und nach dazukommen.'),
      p('Wichtig ist nur: Das Foto sollte ein bis zwei Tage vor dem Termin im Ordner liegen.', { bold: true, after: 200 }),

      h('Beim Benennen bitte beachten', HeadingLevel.HEADING_2),
      bullet('Keine Umlaute und keine Leerzeichen: ä wird zu ae, ö zu oe, ü zu ue, ß zu ss'),
      bullet('Hochkant-Format, mindestens 1080 × 1350 Pixel'),
      bullet('Höchstens 10 MB pro Bild'),
      bullet('Kein Logo und keine Schrift ins Bild setzen – das ergänzt das System automatisch oben drüber'),
      bullet('Personen nur mit unterschriebener Einwilligung (Vorlage liegt im selben Ordner)'),

      new Paragraph({
        spacing: { before: 320 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 10 } },
        children: [new TextRun({
          text: 'Und keine Sorge: Wenn einmal kein Foto da ist, passiert nichts Schlimmes. Der Beitrag erscheint trotzdem – dann eben mit dem Standardbild.',
          size: 20, italics: true, font: 'Calibri',
        })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync('Fotos-fuer-die-naechsten-Beitraege.docx', buf);
  console.log('geschrieben:', buf.length, 'Bytes');
});
