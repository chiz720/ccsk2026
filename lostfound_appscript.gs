/**
 * CCSK 2026 — Lost & Found · Google Apps Script backend
 *
 * SETUP (takes ~5 minutes):
 * 1. Go to sheets.google.com → create a new spreadsheet → name it "CCSK 2026 Lost & Found"
 * 2. Click Extensions → Apps Script
 * 3. Delete the default code and paste this entire file
 * 4. Click Deploy → New deployment → Type: Web app
 *    · Execute as: Me
 *    · Who has access: Anyone
 *    → Click Deploy → Authorise → Copy the Web app URL
 * 5. In index.html find:  const GS_URL = '';
 *    and replace with:    const GS_URL = 'PASTE_YOUR_URL_HERE';
 * 6. Commit and push index.html to GitHub
 *
 * The sheet is created automatically on first use.
 * You can view all submissions live in the spreadsheet.
 */

const SH_NAME = 'LostFound';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SH_NAME);
  if (!sh) {
    sh = ss.insertSheet(SH_NAME);
    sh.appendRow(['id', 'type', 'item', 'desc', 'loc', 'name', 'contact', 'resolved', 'timestamp']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 140);
    sh.setColumnWidth(3, 200);
    sh.setColumnWidth(4, 220);
  }
  return sh;
}

function doGet() {
  const sh   = getSheet();
  const vals = sh.getDataRange().getValues();
  if (vals.length <= 1) return respond([]);

  const rows = vals.slice(1)
    .filter(r => r[0])
    .map(r => ({
      id:       String(r[0]),
      type:     r[1],
      item:     r[2],
      desc:     r[3],
      loc:      r[4],
      name:     r[5],
      contact:  r[6],
      resolved: r[7] === true || r[7] === 'TRUE' || r[7] === true,
      ts:       r[8]
    }))
    .reverse(); // newest first

  return respond(rows);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sh   = getSheet();

  if (data.action === 'resolve') {
    const vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        sh.getRange(i + 1, 8).setValue(true);
        break;
      }
    }
  } else {
    sh.appendRow([
      String(data.id || Date.now()),
      data.type    || 'lost',
      data.item    || '',
      data.desc    || '',
      data.loc     || '',
      data.name    || '',
      data.contact || '',
      false,
      Utilities.formatDate(new Date(), 'Africa/Nairobi', 'dd/MM HH:mm')
    ]);
  }

  return respond({ ok: true });
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
