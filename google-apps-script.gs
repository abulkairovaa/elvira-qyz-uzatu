Уб// Вставьте ID Google-таблицы из её адреса: между /d/ и /edit.
const SHEET_ID = '1l3z35idoE6x1wRZnrnQTRJvbMkCegC9C5NHdgfH_DSg';
const SHEET_NAME = 'Жауаптар';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const values = e && e.parameter ? e.parameter : {};
    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      values.name || '',
      values.attendance || '',
      values.sentAt || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['Дата получения', 'Аты-жөні', 'Қатысуы', 'Время отправки сайта']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
