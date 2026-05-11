/**
 * CCSK 2026 — Lost & Found + Live Polls · Google Apps Script backend
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
 * ── Polls admin (no code changes needed) ──────────────────────────────────────
 * In the "Polls" sheet, add a row for each poll question:
 *   id          | question                          | options (JSON array)         | active
 *   poll_001    | Should we adopt daily PT bundles? | ["Yes","No","Need more data"]| TRUE
 *
 * Set active=TRUE to show the poll on the site. Set active=FALSE to hide it.
 * Results update live every 20 seconds.
 */

const SH_NAME    = 'LostFound';
const POLLS_SH   = 'Polls';
const VOTES_SH   = 'Votes';

// ── Sheet helpers ─────────────────────────────────────────────────────────────

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

function getPollsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(POLLS_SH);
  if (!sh) {
    sh = ss.insertSheet(POLLS_SH);
    sh.appendRow(['id', 'question', 'options', 'active']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 120);
    sh.setColumnWidth(2, 340);
    sh.setColumnWidth(3, 280);
    sh.setColumnWidth(4, 80);
  }
  return sh;
}

function getVotesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(VOTES_SH);
  if (!sh) {
    sh = ss.insertSheet(VOTES_SH);
    sh.appendRow(['poll_id', 'option_index', 'device_id', 'timestamp']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 120);
    sh.setColumnWidth(3, 200);
  }
  return sh;
}

// ── doGet — routes on ?type= ──────────────────────────────────────────────────

function doGet(e) {
  const type = (e && e.parameter && e.parameter.type) ? e.parameter.type : 'lostfound';

  if (type === 'polls') {
    return getPolls();
  }

  // Default: Lost & Found
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
      resolved: r[7] === true || r[7] === 'TRUE',
      ts:       r[8]
    }))
    .reverse();

  return respond(rows);
}

// ── Poll reader ───────────────────────────────────────────────────────────────

function getPolls() {
  const pollSh  = getPollsSheet();
  const voteSh  = getVotesSheet();

  const pollVals = pollSh.getDataRange().getValues();
  const voteVals = voteSh.getDataRange().getValues();

  // Build vote tally: { poll_id: { option_index: count } }
  const tally = {};
  voteVals.slice(1).forEach(r => {
    const pid = String(r[0]);
    const opt = Number(r[1]);
    if (!tally[pid]) tally[pid] = {};
    tally[pid][opt] = (tally[pid][opt] || 0) + 1;
  });

  const polls = pollVals.slice(1)
    .filter(r => r[0] && (r[3] === true || r[3] === 'TRUE'))
    .map(r => {
      const id       = String(r[0]);
      const question = r[1];
      let options    = [];
      try { options = JSON.parse(r[2]); } catch(e) { options = String(r[2]).split(',').map(s => s.trim()); }
      const pollTally = tally[id] || {};
      const totalVotes = options.reduce((sum, _, i) => sum + (pollTally[i] || 0), 0);
      return {
        id,
        question,
        options,
        votes: options.map((_, i) => pollTally[i] || 0),
        total: totalVotes
      };
    });

  return respond(polls);
}

// ── doPost — routes on data.action ───────────────────────────────────────────

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === 'resolve') {
    const sh   = getSheet();
    const vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        sh.getRange(i + 1, 8).setValue(true);
        break;
      }
    }

  } else if (data.action === 'poll_vote') {
    const voteSh   = getVotesSheet();
    const voteVals = voteSh.getDataRange().getValues();
    const pollId   = String(data.poll_id);
    const deviceId = String(data.device_id || '');

    // Check for duplicate vote on this poll from this device
    const alreadyVoted = voteVals.slice(1).some(r =>
      String(r[0]) === pollId && String(r[2]) === deviceId
    );

    if (!alreadyVoted && deviceId) {
      voteSh.appendRow([
        pollId,
        Number(data.option_index),
        deviceId,
        Utilities.formatDate(new Date(), 'Africa/Nairobi', 'dd/MM HH:mm')
      ]);
    }

  } else {
    // Lost & Found submission
    const sh = getSheet();
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

// ── Shared response helper ────────────────────────────────────────────────────

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
