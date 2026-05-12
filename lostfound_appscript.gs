/**
 * CCSK 2026 — Lost & Found + Live Polls + Q&A · Google Apps Script backend
 *
 * SETUP:
 * 1. Extensions → Apps Script → paste this file → save
 * 2. Deploy → Manage deployments → edit → New version → Deploy
 *    (URL stays the same — no change needed in index.html)
 *
 * ── Polls admin ────────────────────────────────────────────────────────────
 * "Polls" sheet columns:  id | question | options (JSON array) | active
 * Set active=TRUE to show. Results update live every 20 s.
 *
 * ── Q&A ────────────────────────────────────────────────────────────────────
 * Questions submitted from the site land in the "QA" sheet automatically.
 * No admin action needed — just watch the sheet fill up during sessions.
 */

const SH_NAME    = 'LostFound';
const POLLS_SH   = 'Polls';
const VOTES_SH   = 'Votes';
const QA_SH      = 'QA';
const ANNOUNCE_SH = 'Announcements';

// ── Sheet helpers ─────────────────────────────────────────────────────────────

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SH_NAME);
  if (!sh) {
    sh = ss.insertSheet(SH_NAME);
    sh.appendRow(['id','type','item','desc','loc','name','contact','resolved','timestamp']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 140); sh.setColumnWidth(3, 200); sh.setColumnWidth(4, 220);
  }
  return sh;
}

function getPollsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(POLLS_SH);
  if (!sh) {
    sh = ss.insertSheet(POLLS_SH);
    sh.appendRow(['id','question','options','active']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(2, 340); sh.setColumnWidth(3, 280);
  }
  return sh;
}

function getVotesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(VOTES_SH);
  if (!sh) {
    sh = ss.insertSheet(VOTES_SH);
    sh.appendRow(['poll_id','option_index','device_id','timestamp']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(3, 200);
  }
  return sh;
}

function getQASheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(QA_SH);
  if (!sh) {
    sh = ss.insertSheet(QA_SH);
    sh.appendRow(['id','session','question','name','upvotes','timestamp']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(2, 200); sh.setColumnWidth(3, 340); sh.setColumnWidth(4, 160);
  }
  return sh;
}

// ── doGet — routes on ?type= ──────────────────────────────────────────────────

function getAnnouncementSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ANNOUNCE_SH);
  if (!sh) {
    sh = ss.insertSheet(ANNOUNCE_SH);
    sh.appendRow(['message', 'active']);
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 400);
    sh.setColumnWidth(2, 80);
    sh.appendRow(['Welcome to CCSK 2026! Please collect your badge at the registration desk.', 'FALSE']);
  }
  return sh;
}

function doGet(e) {
  const type = (e && e.parameter && e.parameter.type) ? e.parameter.type : 'lostfound';
  if (type === 'polls')        return getPolls();
  if (type === 'qa')           return getQA();
  if (type === 'announcement') return getAnnouncement();

  // Default: Lost & Found
  const sh   = getSheet();
  const vals = sh.getDataRange().getValues();
  if (vals.length <= 1) return respond([]);
  const rows = vals.slice(1).filter(r => r[0]).map(r => ({
    id: String(r[0]), type: r[1], item: r[2], desc: r[3], loc: r[4],
    name: r[5], contact: r[6],
    resolved: r[7] === true || r[7] === 'TRUE', ts: r[8]
  })).reverse();
  return respond(rows);
}

// ── Announcement reader ───────────────────────────────────────────────────────

function getAnnouncement() {
  const sh   = getAnnouncementSheet();
  const vals = sh.getDataRange().getValues();
  // Find first active row
  for (let i = 1; i < vals.length; i++) {
    if (vals[i][1] === true || vals[i][1] === 'TRUE') {
      return respond({ message: String(vals[i][0]), active: true });
    }
  }
  return respond({ active: false });
}

// ── Poll reader ───────────────────────────────────────────────────────────────

function getPolls() {
  const pollSh = getPollsSheet();
  const voteSh = getVotesSheet();
  const pollVals = pollSh.getDataRange().getValues();
  const voteVals = voteSh.getDataRange().getValues();

  const tally = {};
  voteVals.slice(1).forEach(r => {
    const pid = String(r[0]), opt = Number(r[1]);
    if (!tally[pid]) tally[pid] = {};
    tally[pid][opt] = (tally[pid][opt] || 0) + 1;
  });

  const polls = pollVals.slice(1)
    .filter(r => r[0] && (r[3] === true || r[3] === 'TRUE'))
    .map(r => {
      const id = String(r[0]);
      let options = [];
      try { options = JSON.parse(r[2]); } catch(e) { options = String(r[2]).split(',').map(s => s.trim()); }
      const t = tally[id] || {};
      const total = options.reduce((s, _, i) => s + (t[i] || 0), 0);
      return { id, question: r[1], options, votes: options.map((_, i) => t[i] || 0), total };
    });
  return respond(polls);
}

// ── Q&A reader ────────────────────────────────────────────────────────────────

function getQA() {
  const sh   = getQASheet();
  const vals = sh.getDataRange().getValues();
  if (vals.length <= 1) return respond([]);
  const rows = vals.slice(1).filter(r => r[0]).map(r => ({
    id:       String(r[0]),
    session:  r[1],
    question: r[2],
    name:     r[3] || 'Anonymous',
    upvotes:  Number(r[4]) || 0,
    ts:       r[5]
  })).sort((a, b) => b.upvotes - a.upvotes);
  return respond(rows);
}

// ── doPost — routes on data.action ───────────────────────────────────────────

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === 'resolve') {
    const sh = getSheet(), vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) { sh.getRange(i+1,8).setValue(true); break; }
    }

  } else if (data.action === 'poll_vote') {
    const voteSh   = getVotesSheet();
    const voteVals = voteSh.getDataRange().getValues();
    const pollId   = String(data.poll_id);
    const deviceId = String(data.device_id || '');
    const already  = voteVals.slice(1).some(r => String(r[0]) === pollId && String(r[2]) === deviceId);
    if (!already && deviceId) {
      voteSh.appendRow([pollId, Number(data.option_index), deviceId,
        Utilities.formatDate(new Date(),'Africa/Nairobi','dd/MM HH:mm')]);
    }

  } else if (data.action === 'qa_submit') {
    const sh = getQASheet();
    sh.appendRow([
      String(data.id || Date.now()),
      data.session  || '',
      data.question || '',
      data.name     || 'Anonymous',
      0,
      Utilities.formatDate(new Date(),'Africa/Nairobi','dd/MM HH:mm')
    ]);

  } else if (data.action === 'qa_upvote') {
    const sh = getQASheet(), vals = sh.getDataRange().getValues();
    for (let i = 1; i < vals.length; i++) {
      if (String(vals[i][0]) === String(data.id)) {
        sh.getRange(i+1, 5).setValue((Number(vals[i][4]) || 0) + 1);
        break;
      }
    }

  } else {
    // Lost & Found submission
    const sh = getSheet();
    sh.appendRow([
      String(data.id || Date.now()), data.type||'lost', data.item||'',
      data.desc||'', data.loc||'', data.name||'', data.contact||'',
      false, Utilities.formatDate(new Date(),'Africa/Nairobi','dd/MM HH:mm')
    ]);
  }

  return respond({ ok: true });
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
