const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle,
} = require('docx');

const GRUEN = '809B3D', BRAUN = '5D4739', CREME = 'F4EFE2';
const ROT = 'B3352B', OK = '2E7D32';
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
const marke = () => new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: 'PHYSIO FUCHS', bold: true, size: 20, color: GRUEN, font: 'Calibri' })],
});
const bullet = (t) => new Paragraph({
  bullet: { level: 0 }, spacing: { after: 80 },
  children: [new TextRun({ text: t, size: 21, font: 'Calibri' })],
});
const nummer = (n, t) => new Paragraph({
  spacing: { after: 90 },
  children: [
    new TextRun({ text: n + '.  ', bold: true, size: 22, color: GRUEN, font: 'Calibri' }),
    new TextRun({ text: t, size: 22, font: 'Calibri' }),
  ],
});
const ankreuz = (t) => new Paragraph({
  spacing: { after: 90 },
  children: [
    new TextRun({ text: '☐   ', size: 24, font: 'Calibri' }),
    new TextRun({ text: t, size: 22, font: 'Calibri' }),
  ],
});
const feld = (label, breite = 55) => new Paragraph({
  spacing: { after: 160 },
  children: [
    new TextRun({ text: label + '  ', size: 22, font: 'Calibri' }),
    new TextRun({ text: '_'.repeat(breite), size: 22, color: '999999', font: 'Calibri' }),
  ],
});
const kasten = (t, farbe = CREME) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: [W],
  rows: [new TableRow({ children: [new TableCell({
    width: { size: W, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: farbe },
    margins: { top: 150, bottom: 150, left: 180, right: 180 },
    children: t.split('\n').map(z => new Paragraph({
      spacing: { after: 50 },
      children: [new TextRun({ text: z, size: 21, font: 'Calibri' })],
    })),
  })] })],
});
const tab = (kopf, zeilen, breiten, ampel) => new Table({
  width: { size: W, type: WidthType.DXA }, columnWidths: breiten,
  rows: [
    new TableRow({
      tableHeader: true,
      children: kopf.map((t, i) => new TableCell({
        width: { size: breiten[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: GRUEN },
        margins: { top: 90, bottom: 90, left: 110, right: 110 },
        children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, size: 20, color: 'FFFFFF', font: 'Calibri' })] })],
      })),
    }),
    ...zeilen.map(z => new TableRow({
      children: z.map((t, i) => {
        let farbe;
        if (ampel && i === 1) farbe = t.startsWith('Ja') ? OK : (t.startsWith('Nein') ? ROT : 'B8860B');
        return new TableCell({
          width: { size: breiten[i], type: WidthType.DXA },
          margins: { top: 85, bottom: 85, left: 110, right: 110 },
          children: [new Paragraph({ children: [new TextRun({ text: t, size: 20, font: 'Calibri', bold: !!farbe, color: farbe })] })],
        });
      }),
    })),
  ],
});
const seite = (k) => ({ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 } } }, children: k });
const mk = (titel, k) => new Document({
  creator: 'Physio Fuchs', title: titel,
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  sections: [seite(k)],
});

// ===== 1. Datenschutz: was geht, was nicht =====
const d1 = mk('Datenschutz in Social Media', [
  marke(), h1('Datenschutz in Social Media'),
  p('Was veröffentlicht werden darf – und was nicht', { italic: true, color: '666666', after: 240 }),

  p('Diese Übersicht ist eine Arbeitshilfe für den Alltag, keine Rechtsberatung. Bei Unsicherheiten bitte mit der Datenschutzbeauftragten der Praxis sprechen.', { italic: true, size: 20, after: 200 }),

  h2('Vier Grundsätze'),
  nummer(1, 'Wir verwenden nur Daten, die wir wirklich brauchen.'),
  nummer(2, 'Wer auf unseren Inhalten erkennbar ist, weiß das und hat schriftlich eingewilligt.'),
  nummer(3, 'Aus der Patientenakte kommt niemals etwas in einen Beitrag.'),
  nummer(4, 'Zugangsdaten und patientenbezogene Informationen werden geschützt aufbewahrt.'),

  h2('Was dürfen wir zeigen?'),
  tab(['Inhalt', 'Erlaubt?', 'Bedingung'], [
    ['Allgemeine Übungsanleitungen', 'Ja', 'Mit Hinweis, bei Beschwerden ärztlich abklären zu lassen'],
    ['Räume, Geräte, Praxis von außen', 'Ja', 'Keine Patientinnen oder Patienten erkennbar'],
    ['Mitarbeitende mit Bild oder Namen', 'Ja', 'Unterschriebene Einwilligung liegt vor'],
    ['Hände am Behandlungstisch', 'Ja', 'Wenn die Person nicht erkennbar ist'],
    ['Porträt einer Patientin, eines Patienten', 'Nein', 'Nur mit ausdrücklicher schriftlicher Einwilligung'],
    ['Patientengeschichten, Erfolgsgeschichten', 'Nein', 'Nur anonymisiert und mit Einwilligung'],
    ['Vorher-Nachher-Bilder', 'Heikel', 'Nur mit Einwilligung, siehe Werberecht-Dokument'],
    ['Digitaler Avatar von Judith', 'Ja', 'Einwilligung liegt vor, Beitrag ist als KI gekennzeichnet'],
    ['Digitaler Avatar anderer Personen', 'Nein', 'Grundsätzlich nicht'],
    ['Screenshots aus der Praxissoftware', 'Nein', 'Enthalten praktisch immer persönliche Daten'],
  ], [3400, 1300, 4660], true),

  h2('Einwilligungen'),
  p('Für Mitarbeitende, für den digitalen Avatar und in Ausnahmefällen für Patientinnen und Patienten gibt es jeweils ein eigenes Formular in diesem Ordner. Wichtig ist bei allen:', { after: 120 }),
  bullet('Vor der ersten Veröffentlichung unterschreiben lassen'),
  bullet('Das Original sicher aufbewahren, nicht in den Social-Media-Ordnern'),
  bullet('Ein Widerruf ist jederzeit möglich – dann den Inhalt zeitnah von den Kanälen nehmen'),

  h2('Wie lange wird was aufbewahrt?'),
  tab(['Was', 'Wie lange', 'Wer kümmert sich'], [
    ['Veröffentlichte Beiträge', '24 Monate, dann archivieren', 'Praxis'],
    ['Aufnahmen für den Avatar', 'Solange der Avatar genutzt wird', 'Thomas'],
    ['Unterschriebene Einwilligungen', '3 Jahre nach einem Widerruf', 'Praxis'],
    ['Technische Protokolle', '30 Tage', 'Thomas'],
  ], [3400, 3200, 2760]),

  h2('Wenn doch einmal etwas schiefgeht'),
  p('Falls versehentlich persönliche Daten veröffentlicht wurden:', { after: 120 }),
  nummer(1, 'Den Beitrag sofort entfernen.'),
  nummer(2, 'Judith und Thomas informieren.'),
  nummer(3, 'Die Datenschutzbeauftragte der Praxis einbeziehen.'),
  nummer(4, 'Den Vorfall intern schriftlich festhalten.'),
  nummer(5, 'Sind fremde Personen betroffen, muss innerhalb von 72 Stunden geprüft werden, ob eine Meldung an die Aufsichtsbehörde nötig ist.'),

  kasten('Im Zweifel gilt immer: lieber einmal zu viel nachfragen als einen Beitrag\nveröffentlichen, bei dem du unsicher bist. Ein Beitrag später ist kein Problem –\nein Beitrag zu viel kann eines werden.'),
]);

// ===== 2. Einwilligung Avatar =====
const d2 = mk('Einwilligung digitaler Avatar', [
  marke(), h1('Einwilligung für den digitalen Avatar'),
  p('Erstellung und Nutzung eines KI-basierten Avatars und einer Stimmkopie', { italic: true, color: '666666', after: 300 }),

  feld('Name:', 55),
  feld('Funktion in der Praxis:', 44),
  feld('Datum:', 58),

  h2('Ich willige ein, dass folgende Aufnahmen verwendet werden dürfen'),
  ankreuz('Bild- und Videoaufnahmen meiner Person'),
  ankreuz('Tonaufnahmen meiner Stimme'),

  p('Zweck: die Erstellung eines KI-basierten Avatars und gegebenenfalls einer Stimmkopie.', { after: 160 }),
  feld('Verwendete Anbieter oder Werkzeuge:', 36),

  h2('Der Avatar darf eingesetzt werden für'),
  ankreuz('Beiträge auf den Social-Media-Kanälen der Praxis'),
  ankreuz('Erklär- und Aufklärungsvideos auf praxiseigenen Kanälen'),
  ankreuz('Interne Schulungsunterlagen'),

  p('In veröffentlichten Inhalten wird der Avatar als KI-generiert gekennzeichnet.', { after: 220 }),

  h2('Das ist mir bekannt'),
  bullet('Die Einwilligung ist freiwillig und jederzeit widerrufbar.'),
  bullet('Nach einem Widerruf werden Avatar und Stimmkopie beim Anbieter gelöscht; bereits veröffentlichte Inhalte werden zeitnah von den Kanälen der Praxis entfernt.'),
  bullet('Die Trainingsdaten werden geschützt gespeichert und nicht für Zwecke Dritter freigegeben.'),
  bullet('Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung.'),

  new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '', size: 22 })] }),
  feld('Ort, Datum:', 54),
  feld('Unterschrift:', 53),

  new Paragraph({
    spacing: { before: 400 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 10 } },
    children: [new TextRun({
      text: 'Hinweis für die Praxis: Das unterschriebene Original sicher aufbewahren, nicht in den Social-Media-Ordnern. Diese Vorlage vor dem ersten Einsatz rechtlich prüfen lassen.',
      size: 18, italics: true, color: '666666', font: 'Calibri',
    })],
  }),
]);

// ===== 3. Einwilligung Patient:innen =====
const d3 = mk('Einwilligung Patientinnen und Patienten', [
  marke(), h1('Einwilligung zur Veröffentlichung'),
  p('Für Patientinnen und Patienten – nur in Ausnahmefällen zu verwenden', { italic: true, color: '666666', after: 300 }),

  feld('Name:', 55),
  feld('Geburtsdatum:', 51),
  feld('Datum:', 58),

  h2('Ich willige ein, dass folgende Inhalte veröffentlicht werden'),
  ankreuz('Foto'),
  ankreuz('Video'),
  ankreuz('Ein Text von mir, etwa eine Rückmeldung zur Behandlung'),
  ankreuz('Vorher-Nachher-Bilder (nur nach zusätzlicher Aufklärung)'),

  feld('Konkret geht es um:', 45),

  h2('So sollen die Inhalte gezeigt werden'),
  ankreuz('Mit meinem Namen'),
  ankreuz('Anonymisiert, ohne Namen'),

  p('Zweck ist die allgemeine Information über Übungs- und Therapieinhalte – ohne Aussagen über einen Behandlungserfolg.', { after: 220 }),

  h2('Das ist mir bekannt'),
  bullet('Die Einwilligung ist freiwillig und jederzeit widerrufbar.'),
  bullet('Ein Widerruf hat keinerlei Auswirkungen auf meine Behandlung.'),
  bullet('Die Inhalte können auf Servern außerhalb der EU verarbeitet werden, insbesondere durch Meta.'),
  bullet('Eine vollständige Entfernung aus dem Internet – etwa geteilte Beiträge oder Bildschirmfotos – kann nicht garantiert werden.'),

  new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '', size: 22 })] }),
  feld('Ort, Datum:', 54),
  feld('Unterschrift:', 53),

  new Paragraph({
    spacing: { before: 400 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 10 } },
    children: [new TextRun({
      text: 'Hinweis für die Praxis: Nur in begründeten Ausnahmefällen einsetzen. Das unterschriebene Original in der Patientenakte aufbewahren. Diese Vorlage vor dem ersten Einsatz rechtlich prüfen lassen.',
      size: 18, italics: true, color: '666666', font: 'Calibri',
    })],
  }),
]);

Promise.all([
  Packer.toBuffer(d1).then(b => (fs.writeFileSync('Datenschutz-in-Social-Media.docx', b), b.length)),
  Packer.toBuffer(d2).then(b => (fs.writeFileSync('Einwilligung-digitaler-Avatar.docx', b), b.length)),
  Packer.toBuffer(d3).then(b => (fs.writeFileSync('Einwilligung-Patientinnen-und-Patienten.docx', b), b.length)),
]).then(l => console.log('geschrieben:', l));
