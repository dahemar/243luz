/**
 * Google Apps Script - Populate 243 Luz CMS
 * 
 * 1. Abre la hoja de Google Sheets
 * 2. Ve a Extensiones → Apps Script
 * 3. Pega este código completo
 * 4. Ejecuta populateSheet()
 * 5. Autoriza los permisos cuando te lo pida
 */

function populateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Delete default sheets, create our tabs
  var sheets = ss.getSheets();
  var names = sheets.map(function(s) { return s.getName(); });
  
  ["Exhibitions", "Artists", "Exhibition_Artists"].forEach(function(name) {
    if (names.indexOf(name) >= 0) {
      ss.getSheetByName(name).clear();
    } else {
      ss.insertSheet(name);
    }
  });

  // Remove "Hoja 1" if it exists
  var hoja1 = ss.getSheetByName("Hoja 1");
  if (hoja1) {
    ss.deleteSheet(hoja1);
  }

  // === EXHIBITIONS ===
  var exhSheet = ss.getSheetByName("Exhibitions");
  exhSheet.getRange(1, 1, 1, 8).setValues([[
    "id", "title", "start_date", "end_date", "description", "wix_folder_name", "show", "order"
  ]]);

  var exhibitions = [
    ["jack-otway-richard-tinkler", "Jack Otway & Richard Tinkler", "2023-06-17", "2023-07-22", "", "Jack Otway _ Richard Tinkler,  June 17th – July 22nd 2023", "y", "0"],
    ["lynn-hershman-leeson", "Lynn Hershman Leeson", "2023-09-01", "2023-10-15", "", "Lynn Hershman Leeson", "y", "1"],
    ["thing-theory", "Thing Theory", "2023-11-01", "2023-12-15", "", "Thing Theory", "y", "2"],
    ["screens", "Screens", "2024-01-15", "2024-02-28", "", "Screens", "y", "3"],
    ["adam-patrick-grant-mourning-dance", "Mourning Dance", "2024-03-01", "2024-04-15", "Adam Patrick Grant", "Adam Patrick Grant", "y", "4"],
    ["racheal-crowther-managed-decline", "Managed Decline", "2024-04-20", "2024-05-30", "Racheal Crowther", "Racheal Crowther Managed Decline", "y", "5"],
    ["kevin-lowenthal-honeymoon", "Honeymoon", "2024-06-01", "2024-07-15", "Kevin Lowenthal", "Kevin Lowenthal Honeymoon", "y", "6"],
    ["thirza-smith-all-together-now", "All Together Now", "2024-07-20", "2024-09-01", "Thirza Smith", "243_Luz - Thirza Smith - All Together Now", "y", "7"],
    ["iw-payne-lie-down", "Lie Down I Think I Love You", "2024-09-15", "2024-10-30", "I.W. Payne", "I.W. Payne  Lie down I think I love you", "y", "8"],
    ["shola-von-reinhold-rebis", "REBIS", "2025-01-01", "2025-02-15", "Shola Von Reinhold", "Shola Von Reinhold", "y", "9"],
    ["marlie-mul-opening-up", "Opening Up", "2025-02-20", "2025-04-01", "Marlie Mul", "Marlie Mul Opening up", "y", "10"],
    ["august-boch-elia-munoz-perfect-vacuum", "A Perfect Vacuum", "2025-04-15", "2025-05-30", "August Boch & Elia Munoz", "August Boch - Elia Munoz - A Perfect Vacuum", "y", "11"],
    ["nasir-mazhar-i-always-wanted", "I Always Wanted To Show You", "2025-06-01", "2025-07-15", "Nasir Mazhar", "Nasir Mazhar", "y", "12"],
    ["aidan-duffy-after-the-function", "After the Function", "2025-07-20", "2025-09-01", "Aidan Duffy", "Aidan Duffy After the Function", "y", "13"],
    ["sunset-beach", "Sunset Beach", "2025-09-15", "2025-10-30", "Solomon Garçon", "sunset beach", "y", "14"],
    ["ben-gomes-outside", "Outside", "2025-11-01", "2025-11-30", "Ben Gomes", "Ben Gomes Outisde", "y", "15"],
    ["misty-the-fox", "Misty The Fox", "2025-12-01", "2025-12-20", "", "Misty The Fox", "y", "16"],
    ["prossecco-wisdom", "Prossecco Wisdom", "2026-01-15", "2026-02-28", "", "Prossecco Wisdom", "y", "17"],
  ];

  exhSheet.getRange(2, 1, exhibitions.length, 8).setValues(exhibitions);
  exhSheet.setFrozenRows(1);
  exhSheet.autoResizeColumns(1, 8);

  // === ARTISTS ===
  var artSheet = ss.getSheetByName("Artists");
  artSheet.getRange(1, 1, 1, 5).setValues([[
    "id", "name", "sort_name", "biography", "show"
  ]]);

  var artists = [
    ["iw-payne", "I.W. Payne", "I.W. Payne", "", "y"],
    ["salomon-garcon", "Solomon Garçon", "Solomon Garçon", "Exhibitions\n\nStedelijk, Amsterdam\nManosphere (group)\nApril – May 2026\n\nKunstverein für die Rheinlande und Westfalen, Düsseldorf\nClosing act\n8 – 15 March 2026\nhttps://kunstverein-duesseldorf.de/ausstellungen/bravo/\n\n243Luz at Liste, Basel\nsolo presentation\n15 June – 21 June 2025\nhttps://www.instagram.com/p/DLE1qtho_yL/\n\nRaven Row, UK\nFake Barn Country (group)\n8 May – 6 July 2025\nhttps://ravenrow.org/exhibitions/fake-barn-country\n\nGalerie Buchholz, NY\nan exhibition organized by Samuel Hindolo (group)\n14 March – 17 May 2025\n\nGalerina, London\nuntitled (group)\n31.12.2024\n\n243Luz, Margate, UK\nsunset beach (solo)\n6 October – 10 November 2024\n\nTetro Grottesco at Basel Social Club, CH\nMug & zeusnetwork (solo)\n6 June – 16 June 2024\n\nStudio Voltaire, London\nARMS (solo)\n4 October 2022 – 14 January 2024\n\nArcadia Missa x 243Luz\nonline viewing (group)\nDec 2023\n\nGalerie Buchholz (Fasanenstr. 31 space), Berlin\nsolomon's knock (collaboration with Samuel Hindolo)\n28 April – 17 June 2023\n\nRose Easton, London\nSNITCH (solo)\n7 October – 5 November 2022\n\nAuto Italia, London\nWords Fail Me\nApril 2018\nsound installation in collaboration with Adam Gallagher\n\nPerformances\n\nRaven Row, UK (Jaguar Shoes)\nJog Mode, 2025\nCollaboration with Adam Gallagher\n\nVolksbuehne (Roter Salon)\nDO U WANT TO MOVE BACK TO LDN\ncollaboration with John T. Gast\n\nHaus der Kunst, Munich\nAnansi's Web – Dimanche\n1 February 2025\n\n243Luz, Margate\nsunset beach (pilot), 2024\ncollaboration with Josiane H. Pozi\n5 November 2024\n\nHours and Hours, 2024\ncollaboration with Hilary Lloyd\n\nRoskilde Festival\nAnansi's Web – Dimanche\nJuly 2024\n\nCafé OTO, London\nDO U WANT TO MOVE BACK TO LDN\nFeb 2024\n\nSant' Andrea de Scaphis (Gavin Brown), Rome\nJune 2022\ncollaboration, invited by the artist Klein\n\nKunstverein München\nJune 2022\nsolo performance (as Jah Umbrella)\n\nFOAM, Amsterdam\nJan 2022\nsolo performance\n\nCentre Pompidou, Paris\nJuly 2021\ncollaboration with Nkisi\n\nSouth London Gallery, London\nAugust 2019\nsolo performance during Liz Johnson Artur\n\nExhibitions/Broadcasts\n\nAuto Italia, London\nOctober 2020\nAxis Arkestra mix (collaboration with Nkisi)\n\nResidencies\n\nAkademie der Künste, Berlin\nBerlin Fellowship\n01.10. – 31.12.2025\n\nInstitute of Interconnected Realities, Copenhagen\nMay 2022 with S. Rieser\n\nGrants\n\nArts Council – Developing Your Own Creative Practice 2020 (£10k)\nArts Council – National Lottery Project grant 2021 (£15k)\nArts Council – National Lottery Project grant 2023 (£23k)\nLOEWE FOUNDATION / Studio Voltaire Award 2021\n\nEducation\n\nUniversity of the Arts London\n2010 – 2014 BA Art Direction\nBachelors degree 2:1", "y"],
    ["lizzy-deacon", "Lizzy Deacon", "Lizzy Deacon", "", "y"],
    ["juliette-lena-hager", "Juliette Lena Hager", "Juliette Lena Hager", "", "y"],
  ];

  artSheet.getRange(2, 1, artists.length, 5).setValues(artists);
  artSheet.setFrozenRows(1);
  artSheet.autoResizeColumns(1, 5);

  // === EXHIBITION_ARTISTS ===
  var linkSheet = ss.getSheetByName("Exhibition_Artists");
  linkSheet.getRange(1, 1, 1, 2).setValues([[
    "exhibition_id", "artist_id"
  ]]);

  var links = [
    ["iw-payne-lie-down", "iw-payne"],
    ["sunset-beach", "salomon-garcon"],
    ["august-boch-elia-munoz-perfect-vacuum", "salomon-garcon"],
  ];

  linkSheet.getRange(2, 1, links.length, 2).setValues(links);
  linkSheet.setFrozenRows(1);
  linkSheet.autoResizeColumns(1, 2);

  // Move tabs to correct order
  ss.setActiveSheet(ss.getSheetByName("Exhibitions"));
  ss.moveActiveSheet(1);
  ss.setActiveSheet(ss.getSheetByName("Artists"));
  ss.moveActiveSheet(2);
  ss.setActiveSheet(ss.getSheetByName("Exhibition_Artists"));
  ss.moveActiveSheet(3);

  SpreadsheetApp.getUi().alert("Done! Sheets populated with 18 exhibitions, 4 artists, and 3 links.");
}
