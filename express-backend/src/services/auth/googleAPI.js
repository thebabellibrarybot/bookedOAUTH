// calendarFunctions.js

const { google } = require('googleapis');
require('dotenv').config();

function getOAuth2Client(request) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID,
    process.env.GOOGLE_AUTH_CLIENT_SECRET
  );
  
  oauth2Client.setCredentials({
    access_token: request.session.passport.user.accessToken,
    refresh_token: request.session.passport.user.refreshToken,
  });

  return oauth2Client;
}

async function createCalendarEvent(oauth2Client, event) {
  return new Promise((resolve, reject) => {
    const calendar = google.calendar({
      version: 'v3',
      auth: oauth2Client,
    })

    calendar.events.insert(
      {
        calendarId: 'primary',
        resource: event,
      },
      (err, res) => {
        if (err) {
          reject(`The calendar API returned an error: ${err}`);
        } else {
          resolve(res.data.htmlLink);
        }
      }
    )
  })
}

async function sendEmail(oauth2Client, base64EncodedEmail) {
    return new Promise((resolve, reject) => {
      const gmail = google.gmail({
        version: 'v1',
        auth: oauth2Client,
      });
  
      gmail.users.messages.send(
        {
          userId: 'me',
          resource: {
            raw: base64EncodedEmail,
          },
        },
        (err, res) => {
          if (err) {
            reject(`Failed to send email: ${err}`);
          } else {
            resolve(res);
          }
        }
      );
    });
  }

function getTimeRange(timeRange, time) {
    
    const startTime = timeRange[time].startTime;
    const endTime = timeRange[time].endTime;

    return {startTime, endTime};
}

function composeEvent(userEntry, bookingFormInfo) {

    const description = userEntry.image ? `Tattoo of ${userEntry.image} on ${userEntry.size} by ${userEntry.name}` : `Tattoo by ${userEntry.name}`;
    const {startTime, endTime} = getTimeRange(bookingFormInfo.CalendarInfo.timeRange, userEntry.time)

    const event = {
        'summary': `New Booking Request from ${userEntry.name}`,
        'description': `${description}`,
        'start': {
          'dateTime': `${userEntry.date}T${userEntry.time}:00-08:00`,
          'timeZone': `${userEntry.timeZone}`,
        },
        'end': {
          'dateTime': '2023-12-10T10:00:00-08:00',
          'timeZone': 'America/Los_Angeles',
        },
        'attendees': [
          {
            'email': 'client1@example.com',
            'responseStatus': 'needsAction',
            'displayName': 'Client 1',
            'organizer': true,  // Set to true for the event organizer
          },
          {
            'email': 'client2@example.com',
            'responseStatus': 'needsAction',
            'displayName': 'Client 2',
          },
        ],
        'guestsCanModify': true,  // Guests can modify the event
        'reminders': {
          'useDefault': false,
          'overrides': [
            { 'method': 'email', 'minutes': 30 },
            { 'method': 'popup', 'minutes': 10 },
          ],
        },
      };

    return event;
}

function composeGmail(userEntry, bookingFormInfo) {

    const toEmail = bookingFormInfo.adminInfo.email;
    const emailSubject = `New Booking Request from ${userEntry.name}`;
    // const styles = bookingFormInfo.themesInfo.styles;
  
    // Construct HTML-formatted email body with styles
    const emailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              color: #333;
            }
            p {
              margin: 10px 0;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 5px;
            }
            a {
              color: #007BFF;
              text-decoration: none;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <p>Hello ${bookingFormInfo.adminInfo.name},</p>
          <p>You have a new booking request from ${userEntry.name}:</p>
          
          <ul>
            <li><strong>Name:</strong> ${userEntry.name}</li>
            <li><strong>Email:</strong> ${userEntry.email}</li>
            <!-- Add more details as needed -->
          </ul>
          
          <p>For more details, please check the <a href="link-to-your-booking-page">booking page</a>.</p>
          
          <p>Best regards,</p>
          <p>Your Booking System</p>
        </body>
      </html>
    `;
  
    // Convert to base64-encoded email content
    const emailContent = `To: ${toEmail}\r\nSubject: ${emailSubject}\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=utf-8\r\n\r\n${emailBody}`;
    const base64EncodedEmail = Buffer.from(emailContent).toString('base64');
  
    return base64EncodedEmail;
  }
  


module.exports = {
    getOAuth2Client,
    createCalendarEvent,
    sendEmail,
    composeEvent,
    composeGmail,
};



/*const calendarEventLink = await calendar.events.insert({
                calendarId: 'primary',
                resource: event
            }, (err, res) => {
                if (err) return this.logger.error('The calendar API returned an error: ' + err)
                else {
                  this.logger.info('Event created: %s', res.data.htmlLink)
                  return res.data.htmlLink
                }
            })

            const sentGmail = await gmail.users.messages.send({
                userId: 'me',
                resource: {
                  raw: base64EncodedEmail,
                },
              })
            */