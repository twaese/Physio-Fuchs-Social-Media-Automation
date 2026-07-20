const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
} = require('docx');

const GRUEN = '809B3D', BRAUN = '5D4739', CREME = 'F4EFE2';
const W = 9360;

const p = (text, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 120 },
  children: [new TextRun({
    text, bold: o.bold, italics: o.italic, size: o.size ?? 22,
    color: o.color, font: o.mono ? 'Consolas' : 'Calibri',
  })],
});

const h1 = (text) => new Paragraph({
  spacing: { after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GRUEN, space: 8 } },
  children: [new TextRun({ text, bold: true, size: 40, color: BRAUN, font: 'Calibri' })],
});

const h2 = (text) => new Paragraph({
  spacing: { before: 300, after: 140 },
  children: [new TextRun({ text, bold: true, size: 26, color: BRAUN, font: 'Calibri' })],
});

const marke = () => new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'PHYSIO FUCHS', bold: true, size: 20, color: GRUEN, font: 'Calibri' })],
});

const bullet = (text, o = {}) => new Paragraph({
  bullet: { level: 0 }, spacing: { after: 80 },
  children: [new TextRun({ text, size: 22, font: o.mono ? 'Consolas' : 'Calibri', bold: o.bold })],
});

// Formularzeile mit Unterstrichen
const feld = (label, breite = 60) => new Paragraph({
  spacing: { after: 160 },
  children: [
    new TextRun({ text: label + '  ', size: 22, font: 'Calibri' }),
    new TextRun({ text: '_'.repeat(breite), size: 22, font: 'Calibri', color: '999999' }),
  ],
});

const ankreuz = (text) => new Paragraph({
  spacing: { after: 90 },
  children: [
    new TextRun({ text: '☐   ', size: 24, font: 'Calibri' }),
    new TextRun({ text, size: 22, font: 'Calibri' }),
  ],
});

const kasten = (text) => new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [W],
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: W, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: CREME },
      margins: { top: 160, bottom: 160, left: 180, right: 180 },
      children: [new Paragraph({ children: [new TextRun({ text, size: 21, font: 'Calibri' })] })],
    })],
  })],
});

const seite = (children) => ({
  properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
  children,
});

// ============ Dokument 1: Fotos richtig benennen ============
const beispiele = [
  ['PF_2026_012_wirbelsaeule.jpg', 'richtig', true],
  ['PF_2026_027_team_rueckblick.jpg', 'richtig', true],
  ['PF_2026_12_wirbelsaeule.jpg', 'Nummer muss dreistellig sein: 012', false],
  ['PF-2026-012-wirbelsaeule.jpg', 'Bindestriche statt Unterstriche', false],
  ['PF_2026_012 Wirbelsäule.jpg', 'Leerzeichen und Umlaut', false],
  ['PF_2026_012.jpg', 'Stichwort am Ende fehlt', false],
];

const beispielTabelle = new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [700, 4300, 4360],
  rows: [
    new TableRow({
      tableHeader: true,
      children: ['', 'Dateiname', 'Anmerkung'].map((t, i) => new TableCell({
        width: { size: [700, 4300, 4360][i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GRUEN },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })],
      })),
    }),
    ...beispiele.map(([name, hinweis, ok]) => new TableRow({
      children: [
        new TableCell({
          width: { size: 700, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: ok ? '✓' : '✗', bold: true, size: 24, color: ok ? '2E7D32' : 'C0392B', font: 'Calibri' })] })],
        }),
        new TableCell({
          width: { size: 4300, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: name, size: 18, font: 'Consolas' })] })],
        }),
        new TableCell({
          width: { size: 4360, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 100, right: 100 },
          children: [new Paragraph({ children: [new TextRun({ text: hinweis, size: 20, font: 'Calibri' })] })],
        }),
      ],
    })),
  ],
});

const doc1 = new Document({
  creator: 'Physio Fuchs', title: 'Fotos richtig benennen',
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [seite([
    marke(),
    h1('Fotos richtig benennen und ablegen'),
    p('Stand: 20. Juli 2026', { italic: true, color: '888888', after: 240 }),

    p('Damit ein Foto automatisch im richtigen Beitrag landet, muss es zwei Dinge erfüllen: den richtigen Namen und den richtigen Ordner. Mehr ist es nicht.', { after: 240 }),

    h2('Der Ordner'),
    p('Content_Socialmedia \\ Fotos \\ 2026', { mono: true, size: 21, after: 120 }),
    p('Im Jahresordner landen die Fotos, die zu einem bestimmten Beitrag gehören. Ab Januar gibt es entsprechend einen Ordner 2027.', { after: 200 }),

    h2('Der Name'),
    p('Der Aufbau ist immer gleich:', { after: 120 }),
    p('PF_2026_Nummer_Stichwort.jpg', { mono: true, size: 24, bold: true, after: 160 }),
    bullet('PF_2026 – bleibt immer gleich (2027 dann entsprechend)'),
    bullet('Nummer – dreistellig, mit führenden Nullen: 012, nicht 12'),
    bullet('Stichwort – frei wählbar, beschreibt was zu sehen ist'),
    bullet('.jpg oder .png – beides geht'),
    p('Die Nummer steht in der Foto-Liste bei jedem Beitrag. Am einfachsten kopierst du den fertigen Dateinamen von dort.', { after: 200 }),

    h2('Beispiele'),
    beispielTabelle,

    h2('Umlaute und Sonderzeichen'),
    p('Die machen im Internet Probleme – deshalb bitte ersetzen:', { after: 120 }),
    bullet('ä wird zu ae, ö zu oe, ü zu ue, ß zu ss'),
    bullet('Leerzeichen werden zu Unterstrichen'),
    bullet('&, + und Apostrophe einfach weglassen'),

    h2('Anforderungen ans Bild'),
    bullet('Hochkant-Format, mindestens 1080 × 1350 Pixel'),
    bullet('Höchstens 10 MB'),
    bullet('Kein Logo und keine Schrift ins Bild setzen – das ergänzt das System oben drüber automatisch'),
    bullet('Personen nur mit unterschriebener Einwilligung'),

    h2('Häufige Fragen'),
    p('Kann ich ein Foto nachträglich austauschen?', { bold: true, after: 60 }),
    p('Ja, solange der Beitrag noch nicht veröffentlicht ist. Sag Thomas kurz Bescheid, dann wird das Bild neu erzeugt.', { after: 160 }),
    p('Was, wenn ich mehrere Fotos für einen Beitrag habe?', { bold: true, after: 60 }),
    p('Dann wird das alphabetisch erste genommen. Wenn du ein bestimmtes willst, nenne es so, dass es vorne steht.', { after: 160 }),
    p('Was passiert, wenn ich kein Foto liefere?', { bold: true, after: 60 }),
    p('Nichts Schlimmes – der Beitrag erscheint trotzdem, dann mit einem Standardbild.', { after: 200 }),

    kasten('Kurz gefasst: Foto aussuchen, umbenennen, in den Ordner Fotos \\ 2026 legen. Alles Weitere passiert von allein.'),
  ])],
});

// ============ Dokument 2: Einwilligung Mitarbeitende ============
const doc2 = new Document({
  creator: 'Physio Fuchs', title: 'Einwilligung Bild- und Tonaufnahmen',
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [seite([
    marke(),
    h1('Einwilligung in Bild- und Tonaufnahmen'),
    p('für die Veröffentlichung auf den Social-Media-Kanälen der Praxis Physio Fuchs', { italic: true, color: '666666', after: 300 }),

    feld('Name:', 55),
    feld('Funktion in der Praxis:', 44),
    feld('Datum:', 58),

    h2('Ich willige ein, dass folgende Aufnahmen von mir gemacht werden dürfen'),
    ankreuz('Fotos'),
    ankreuz('Videos'),
    ankreuz('Tonaufnahmen'),
    ankreuz('Aufnahmen hinter den Kulissen (Behind the Scenes)'),

    h2('Diese Aufnahmen dürfen verwendet werden für'),
    ankreuz('Instagram'),
    ankreuz('Facebook'),
    ankreuz('LinkedIn'),
    ankreuz('Website der Praxis'),
    ankreuz('Gedruckte Werbung der Praxis'),
    ankreuz('Interne Schulungsunterlagen'),

    p('Die Aufnahmen dürfen bearbeitet werden – zum Beispiel Zuschnitt, Farbkorrektur, Untertitel oder das Hinzufügen des Praxis-Logos.', { after: 220 }),

    h2('Das ist mir bekannt'),
    bullet('Die Einwilligung ist freiwillig. Ich kann sie jederzeit und ohne Angabe von Gründen widerrufen, mit Wirkung für die Zukunft.'),
    bullet('Der Widerruf hat keine Nachteile für mich.'),
    bullet('Nach einem Widerruf werden veröffentlichte Inhalte von den Kanälen der Praxis entfernt. Eine vollständige Entfernung aus dem Internet – etwa geteilte Beiträge, Screenshots oder zwischengespeicherte Kopien – kann nicht garantiert werden.'),
    bullet('Die Inhalte können auf Servern außerhalb der EU verarbeitet werden, insbesondere durch Meta.'),

    feld('Widerruf möglich per E-Mail an:', 40),

    new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '', size: 22 })] }),
    feld('Ort, Datum:', 54),
    feld('Unterschrift:', 53),

    new Paragraph({
      spacing: { before: 400 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 10 } },
      children: [new TextRun({
        text: 'Hinweis für die Praxis: Das unterschriebene Original bitte in der Personalakte aufbewahren, nicht in den Social-Media-Ordnern. Diese Vorlage vor dem ersten Einsatz von einer Datenschutz- oder Rechtsstelle prüfen lassen.',
        size: 18, italics: true, color: '666666', font: 'Calibri',
      })],
    }),
  ])],
});

Promise.all([
  Packer.toBuffer(doc1).then(b => fs.writeFileSync('Fotos-richtig-benennen.docx', b) || b.length),
  Packer.toBuffer(doc2).then(b => fs.writeFileSync('Einwilligung-Bild-und-Tonaufnahmen.docx', b) || b.length),
]).then(l => console.log('geschrieben:', l));
