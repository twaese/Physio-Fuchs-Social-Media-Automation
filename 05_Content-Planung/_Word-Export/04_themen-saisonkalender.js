const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle,
} = require('docx');

const GRUEN = '809B3D', BRAUN = '5D4739', CREME = 'F4EFE2';
const W = 9360;

const p = (t, o = {}) => new Paragraph({
  spacing: { after: o.after ?? 120 },
  children: [new TextRun({ text: t, bold: o.bold, italics: o.italic, size: o.size ?? 22, color: o.color, font: 'Calibri' })],
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
const h3 = (t) => new Paragraph({
  spacing: { before: 200, after: 100 },
  children: [new TextRun({ text: t, bold: true, size: 22, color: GRUEN, font: 'Calibri' })],
});
const bullet = (t) => new Paragraph({
  bullet: { level: 0 }, spacing: { after: 70 },
  children: [new TextRun({ text: t, size: 21, font: 'Calibri' })],
});
const marke = () => new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'PHYSIO FUCHS', bold: true, size: 20, color: GRUEN, font: 'Calibri' })],
});
const zitat = (t) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [W],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: W, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: CREME },
    margins: { top: 150, bottom: 150, left: 180, right: 180 },
    children: [new Paragraph({ children: [new TextRun({ text: t, size: 21, font: 'Calibri', italics: true })] })],
  })] })],
});

const monate = [
  ['Januar', 'Gute Vorsätze realistisch angehen'],
  ['Februar', 'Nach langem Sitzen richtig aufwärmen'],
  ['März', 'Frühjahrsmüdigkeit, sanfter Wiedereinstieg in den Sport'],
  ['April', 'Tag der Rückengesundheit'],
  ['Mai', 'Gartenarbeit ohne Kreuzschmerzen'],
  ['Juni', 'Wandern und Sprunggelenk'],
  ['Juli', 'Reisen und langes Sitzen'],
  ['August', 'Hitze und Kreislauf – vorsichtig bewegen'],
  ['September', 'Schulanfang: Haltung und Schulranzen'],
  ['Oktober', 'Welt-Osteoporose-Tag am 20. Oktober'],
  ['November', 'Dunkle Jahreszeit – Bewegung als Stimmungsaufheller'],
  ['Dezember', 'Weihnachtsstress und Verspannungen'],
];

const kalender = new Table({
  width: { size: W, type: WidthType.DXA },
  columnWidths: [1800, 7560],
  rows: [
    new TableRow({
      tableHeader: true,
      children: ['Monat', 'Anlass oder Thema'].map((t, i) => new TableCell({
        width: { size: [1800, 7560][i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GRUEN },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })],
      })),
    }),
    ...monate.map(([m, t], idx) => new TableRow({
      children: [m, t].map((x, i) => new TableCell({
        width: { size: [1800, 7560][i], type: WidthType.DXA },
        shading: idx % 2 ? { type: ShadingType.CLEAR, fill: 'F7F7F4' } : undefined,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: x, size: 20, bold: i === 0, font: 'Calibri' })] })],
      })),
    })),
  ],
});

const doc = new Document({
  creator: 'Physio Fuchs', title: 'Themen-Ideen und Saisonkalender',
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [{
    properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } },
    children: [
      marke(), h1('Themen-Ideen und Saisonkalender'),
      p('Eine Sammlung zum Stöbern, keine Pflichtliste', { italic: true, color: '666666', after: 240 }),

      p('Wenn dir beim Ausfüllen des Formulars gerade kein Thema einfällt: Hier stehen Ideen nach Körperregion sortiert, dazu ein Kalender mit saisonalen Anlässen. Nichts davon muss in einer bestimmten Reihenfolge kommen.', { after: 200 }),

      h2('Ideen nach Thema'),

      h3('Rücken und Wirbelsäule'),
      bullet('Mobilisation der Lendenwirbelsäule – Katze und Kuh, Beckenkippen'),
      bullet('Faszienrolle für den unteren Rücken'),
      bullet('Aufklärung: Ein Bandscheibenvorfall bedeutet nicht automatisch eine Operation'),
      bullet('Büro-Rücken: was in der Schreibtischpause hilft'),

      h3('Schulter und Nacken'),
      bullet('Schulterkreisen am Türrahmen'),
      bullet('Nackendehnung in 60 Sekunden'),
      bullet('Headset statt eingeklemmtem Telefon'),

      h3('Knie, Hüfte und Beine'),
      bullet('Oberschenkeldehnung im Stand'),
      bullet('Sicher Treppen steigen'),
      bullet('Hüftöffner für alle, die viel sitzen'),

      h3('Alltag und Lebensstil'),
      bullet('Trinken und Faszien'),
      bullet('Schlafposition und Rücken'),
      bullet('Der Spaziergang als Therapie'),
      bullet('Fünf-Minuten-Routine vor dem Bildschirm'),

      h3('Rund um die Praxis'),
      bullet('Das Team vorstellen – einzeln oder gemeinsam'),
      bullet('Ein Tag bei uns: wie eine Behandlung abläuft'),
      bullet('Neue Geräte oder Ausstattung zeigen'),
      bullet('Fortbildungen, die jemand aus dem Team gemacht hat'),
      bullet('Freie Termine, Aktionen, Öffnungszeiten'),

      h3('Wir suchen Verstärkung'),
      p('Diese Themen zahlen darauf ein, dass sich neue Kolleginnen und Kollegen bei uns melden:', { size: 20, italic: true, after: 100 }),
      bullet('Warum ich gerne hier arbeite – ein Teammitglied erzählt'),
      bullet('Was wir bieten: Arbeitszeiten, Fortbildung, Ausstattung'),
      bullet('Ein Tag im Leben unserer Therapeutinnen und Therapeuten'),
      bullet('Wir stellen ein – ganz direkt gefragt'),

      h2('Saisonkalender'),
      p('Anlässe, die sich gut zwei bis drei Wochen vorher aufgreifen lassen:', { after: 140 }),
      kalender,

      h2('Wenn gar nichts einfällt'),
      p('Kein Problem – dann kommt automatisch eine Erinnerung, und es werden dir drei Vorschläge aus dieser Sammlung geschickt. Du wählst einfach einen aus.', { after: 200 }),

      zitat('Tipp: Am besten funktionieren Themen, bei denen jemand aus dem Team zu sehen ist. Gesichter bleiben im Gedächtnis – Grafiken nicht.'),
    ],
  }],
});

Packer.toBuffer(doc).then(b => {
  fs.writeFileSync('Themen-Ideen-und-Saisonkalender.docx', b);
  console.log('geschrieben:', b.length, 'Bytes');
});
