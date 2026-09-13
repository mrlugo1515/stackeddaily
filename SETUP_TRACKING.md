# StackedDaily — Sales Tracking Setup (5 minutes)

## What this does
Every completed PayPal sale and every PDF download gets logged to a
private Google Sheet automatically. You can view everything at:

  https://stackeddaily.org/admin  (PIN: stacked2026)

---

## Step 1 — Create the Google Sheet

1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it: **StackedDaily Sales Log**
3. In Row 1, add these column headers (copy exactly):
   ```
   Type | Product | Price | Customer | Date | Time | Page | IP
   ```

---

## Step 2 — Create the Apps Script Web App

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete the default `myFunction` code
3. Paste this entire script:

```javascript
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data  = JSON.parse(e.postData.contents);
    const date  = new Date(data.serverTime || data.clientTime || new Date());

    sheet.appendRow([
      data.type        || '',
      data.product     || '',
      data.price       || '',
      data.customerName|| '',
      Utilities.formatDate(date, 'America/New_York', 'yyyy-MM-dd'),
      Utilities.formatDate(date, 'America/New_York', 'HH:mm:ss'),
      data.page        || '',
      data.ip          || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e.parameter.read !== '1') {
    return ContentService.createTextOutput('{}').setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
  }
  const [headers, ...data] = rows;
  const events = data.map(row => ({
    type:         row[0],
    product:      row[1],
    price:        row[2],
    customerName: row[3],
    serverTime:   row[4] + 'T' + row[5],
    page:         row[6],
    ip:           row[7]
  }));
  return ContentService
    .createTextOutput(JSON.stringify(events))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Save** (floppy disk icon), name the project **StackedDaily Tracker**
5. Click **Deploy → New deployment**
6. Click the gear icon next to "Type" → select **Web app**
7. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** → click **Authorize access** → choose your Google account → Allow
9. **Copy the Web app URL** (looks like `https://script.google.com/macros/s/ABC.../exec`)

---

## Step 3 — Add the URL to Vercel

1. Go to https://vercel.com/dashboard
2. Click your **stackeddaily** project
3. Go to **Settings → Environment Variables**
4. Add a new variable:
   - **Name:** `GOOGLE_SHEET_URL`
   - **Value:** paste the URL you copied
   - **Environment:** Production (and Preview)
5. Click **Save**
6. Go to **Deployments** → click the **⋯** next to your latest deploy → **Redeploy**

---

## Step 4 — Test It

1. Open your store: https://stackeddaily.org/store
2. Make a test purchase (you can refund it from your PayPal dashboard)
3. Check your Google Sheet — a new row should appear within seconds
4. Open https://stackeddaily.org/admin and enter PIN: **stacked2026**
5. You should see the sale logged

---

## Your Admin Dashboard

**URL:** https://stackeddaily.org/admin  
**PIN:** stacked2026  

Change the PIN any time by editing `admin.html` line ~152:
```javascript
const PIN = 'stacked2026';
```

---

## Troubleshooting

- **No rows in sheet:** Make sure you deployed as "Anyone can access" not "Only myself"
- **CORS error:** Normal during local testing — works fine on the live Vercel domain
- **Old data shows:** The dashboard caches locally — hit Refresh to pull latest from the sheet
