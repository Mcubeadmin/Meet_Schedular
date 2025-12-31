import puppeteer, { executablePath } from "puppeteer";
import fs from 'fs';

function displayTime(eventTime) {
    // console.log(eventTime);
    let [hours, minutes]  = eventTime.split(':').map(Number);
    const ampm = hours >= 12? "PM" : "AM";
    hours = String(hours % 12 || 12).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    return `${hours} : ${minutes} ${ampm}`;
}

function displayDuration(duration) {
    const Hours = Math.floor(Number(duration) / 60);
    const minutes = Number(duration) % 60;
    return Hours? `${Hours} hr ${minutes} mins` : `${minutes} mins`;
}



const generateEventPDF = async (event) => {
  const launchOptions = {
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process"
    ],
  };

  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath && fs.existsSync(envPath)) {
    launchOptions.executablePath = envPath;
  } else {
    console.log("Using default local Chromium (No valid executablePath found)");
  }
  const browser = await puppeteer.launch(launchOptions);
  
  try {
    
    const talksLength = event.talks.length
    const endtimeExact = event.talks[talksLength-1]["talkend"];
    const page = await browser.newPage();
  
    const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
          
          /* Header Styling matching your image */
          .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
          .event-title { font-size: 18pt; font-weight: bold; margin: 0; }
          .event-details { font-size: 12pt; color: #555; margin-top: 5px; }
  
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          
          /* Table Header matching the grey style in image */
          th { 
            background-color: #d1d5db; 
            color: #374151; 
            font-weight: bold; 
            padding: 12px; 
            border: 1px solid #9ca3af;
            text-align: center;
            font-size: 10pt;
          }
  
          td { 
            padding: 15px; 
            border: 1px solid #d1d5db; 
            text-align: center; 
            font-size: 10pt;
          }
  
          .title-cell { text-align: left; padding-left: 20px; }

          .event-header-text {
            margin-top: 15px;
            font-size: 11pt;
            color: #374151;
          }

          .event-footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #9ca3af;
            font-size: 10pt;
            color: #4b5563;
          }

        </style>
      </head>
      <body>
        <div class="header">
          <p class="event-title">${event.eventname}</p>
          <p class="event-details">Date: ${event.date} | Time: ${displayTime(event.start)} ${endtimeExact? `to ${displayTime(endtimeExact)}` : ""}</p>
          ${event.eventheader ? `
            <div class="event-header-text">
              ${event.eventheader}
            </div>
          ` : ""}
        </div>

        <table>
          <colgroup>
              <col style="width:30%" />
              <col style="width:15%" />
              <col style="width:40%" />
              <col style="width:15%" />
          </colgroup>
          <thead>
            <tr>
              <th>Start Time - End Time</th>
              <th>Duration</th>
              <th>Title</th>
              <th>Presenter</th>
            </tr>
          </thead>
          <tbody>
            ${event.talks.map(talk => `
              <tr>
                <td>${displayTime(talk.talkstart)} - ${displayTime(talk.talkend)}</td>
                <td>${displayDuration(talk.duration)}</td>
                <td class="title-cell">${talk.title}</td>
                <td>${talk.presenter}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${event.eventfooter ? `
        <div class="event-footer">
          ${event.eventfooter}
        </div>
`       : ""}
      </body>
    </html>`;
  
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    return pdfBuffer; 
  } finally {
    await browser.close();
  }
};
export default generateEventPDF;
