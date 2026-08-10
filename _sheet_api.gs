/**
 * 243 Luz — Google Sheets Write API
 *
 * SETUP (30 seconds, one time):
 * 1. In the sheet: Extensions → Apps Script → paste this code → Save
 * 2. Deploy → New deployment → Type: "Web app"
 * 3. Execute as: "Me"  |  Who has access: "Anyone"
 * 4. Copy the Web app URL (ends in /exec) and give it to the developer
 *
 * After that, all data can be updated remotely via simple HTTP calls.
 *
 * Endpoints:
 *   GET  ?action=read&sheet=Exhibitions
 *   GET  ?action=set&sheet=Exhibitions&cell=B2&value=Hello
 *   GET  ?action=appendRow&sheet=Exhibitions&values=id|title|...
 *   GET  ?action=createSheet&name=NewTab
 *   GET  ?action=clear&sheet=Exhibitions&keepHeader=y
 *   GET  ?action=listSheets
 */

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var p = (e && e.parameter) || {};
  var action = p.action || "";

  // Support JSON POST body for long values
  if (!action && e && e.postData && e.postData.contents) {
    try {
      var body = JSON.parse(e.postData.contents);
      action = body.action || "";
      p = body;
    } catch (err) {}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result;

  try {
    if (action === "read") {
      result = readSheet(ss, p.sheet);
    } else if (action === "set") {
      result = setCell(ss, p.sheet, p.cell, p.value);
    } else if (action === "appendRow") {
      result = appendRow(ss, p.sheet, p.values);
    } else if (action === "createSheet") {
      result = createSheet(ss, p.name);
    } else if (action === "clear") {
      result = clearSheet(ss, p.sheet, p.keepHeader);
    } else if (action === "listSheets") {
      result = listSheets(ss);
    } else if (action === "setRow") {
      result = setRow(ss, p.sheet, p.row, p.values);
    } else {
      result = { error: "Unknown action. Use: read, set, setRow, appendRow, createSheet, clear, listSheets" };
    }
  } catch (err) {
    result = { error: String(err) };
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function readSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return { error: "Sheet not found: " + name };
  return { values: sheet.getDataRange().getValues() };
}

function setCell(ss, name, cell, value) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return { error: "Sheet not found: " + name };
  sheet.getRange(cell).setValue(value);
  return { ok: true, cell: cell };
}

function setRow(ss, name, rowNum, values) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return { error: "Sheet not found: " + name };
  var vals = values.split("|");
  sheet.getRange(parseInt(rowNum), 1, 1, vals.length).setValues([vals]);
  return { ok: true, row: rowNum, cols: vals.length };
}

function appendRow(ss, name, values) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return { error: "Sheet not found: " + name };
  sheet.appendRow(values.split("|"));
  return { ok: true };
}

function createSheet(ss, name) {
  if (ss.getSheetByName(name)) return { ok: true, note: "already exists" };
  ss.insertSheet(name);
  return { ok: true };
}

function clearSheet(ss, name, keepHeader) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) return { error: "Sheet not found: " + name };
  if (keepHeader === "y") {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.deleteRows(2, lastRow - 1);
  } else {
    sheet.clear();
  }
  return { ok: true };
}

function listSheets(ss) {
  return { sheets: ss.getSheets().map(function(s) { return s.getName(); }) };
}
