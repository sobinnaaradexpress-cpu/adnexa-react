// Google Apps Script (Code.gs)
// Paste this into your Google Apps Script editor attached to your Google Sheet

const SHEET_NAMES = ["Products", "Vendors", "Orders"];

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SHEET_NAMES.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      if (name === "Products") {
        sheet.appendRow(["id", "name", "vendor", "price", "category", "image", "stock", "sales"]);
      } else if (name === "Vendors") {
        sheet.appendRow(["id", "name", "status", "products", "revenue"]);
      } else if (name === "Orders") {
        sheet.appendRow(["id", "customer", "total", "status", "date"]);
      }
    }
  });
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (!action) {
    return createJsonResponse({ error: "No action specified" });
  }

  try {
    const data = getSheetData(action);
    return createJsonResponse({ data: data });
  } catch (err) {
    return createJsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    
    if (action === "addOrder") {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
      const order = body.data;
      sheet.appendRow([order.id, order.customer, order.total, order.status, order.date]);
      return createJsonResponse({ success: true, message: "Order added" });
    }
    
    if (action === "addProduct") {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
      const p = body.data;
      sheet.appendRow([p.id, p.name, p.vendor, p.price, p.category, p.image, p.stock, p.sales]);
      return createJsonResponse({ success: true, message: "Product added" });
    }

    if (action === "updateOrderStatus") {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
      const orderId = body.data.id;
      const newStatus = body.data.status;
      
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] == orderId) { // Column 0 is ID
          sheet.getRange(i + 1, 4).setValue(newStatus); // Column 4 is Status
          return createJsonResponse({ success: true, message: "Status updated" });
        }
      }
      return createJsonResponse({ error: "Order not found" });
    }

    return createJsonResponse({ error: "Unknown action" });
  } catch (err) {
    return createJsonResponse({ error: err.message });
  }
}

function getSheetData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) throw new Error("Sheet not found");
  
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return []; // Empty or only headers
  
  const headers = rows[0];
  const data = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const item = {};
    for (let j = 0; j < headers.length; j++) {
      item[headers[j]] = row[j];
    }
    data.push(item);
  }
  
  return data;
}

function createJsonResponse(responseObject) {
  return ContentService.createTextOutput(JSON.stringify(responseObject))
    .setMimeType(ContentService.MimeType.JSON);
}
