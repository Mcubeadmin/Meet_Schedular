import puppeteer, { executablePath } from "puppeteer";

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
    const browser = await puppeteer.launch({ headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage",
        "--single-process"
    ],
    });
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
        </style>
      </head>
      <body>
        <div class="header">
          <p class="event-title">${event.eventname}</p>
          <p class="event-details">Date: ${event.date} | Time: ${displayTime(event.start)} ${event.end? `to ${displayTime(event.end)}` : ""}</p>
        </div>

        <table>
          <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "50%" }} />
              <col style={{ width: "10%" }} />
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
      </body>
    </html>`;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer; 
};
export default generateEventPDF;
