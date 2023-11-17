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
          console.log(err, 'err from createCalendarEvent')
          console.log(data.error, 'data.errors from createCalendarEvent')
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

function composeEvent(userEntry, bookingFormInfo) {

    const description = `Tattoo appointment req for ${userEntry.name}`
   
    const event = {
        'summary': `New Booking Request from ${userEntry.name}`,
        'description': `${description}`,
        'start': {
          'dateTime': `${userEntry.startTime}`,
          'timeZone': `${userEntry.timeZone}`,
        },
        'end': {
          'dateTime': `${userEntry.endTime}`,
          'timeZone': `${userEntry.timeZone}`,
        },
        'attendees': [
          {
            'email': `${bookingFormInfo.adminInfo.contact.email}`,
            'responseStatus': 'needsAction',
            'displayName': `${bookingFormInfo.adminInfo.displayName}`,
            'organizer': true,  // Set to true for the event organizer
          }
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

function composeGmail(userEntry, bookingFormInfo, eventId) {

    const toEmail = bookingFormInfo.adminInfo.contact.email;
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
          <p>Hello ${bookingFormInfo.adminInfo.displayName},</p>
          <p>You have a new booking request from ${userEntry.name}:</p>
          
          <ul>
            <li><strong>Name:</strong> ${userEntry.name}</li>
            <li><strong>Email:</strong> ${userEntry.email}</li>
            <li><strong>Phone:</strong> ${userEntry.phone}</li>
            <!-- Add more details as needed -->
            <p>Booking Details: ${userEntry.message}</p>
            <p>Booking Requested for: ${userEntry.date} at ${userEntry.time}</p>
            <p>Booking Date: ${userEntry.date}</p>
            <p>Booking Time: ${userEntry.time}</p>
            <p>Booking Time Zone: ${userEntry.timeZone}</p>
            <p>Booking Image: ${userEntry.image}</p>
            <p>Booking Size: ${userEntry.size}</p>
            <p>Booking Waiver: ${userEntry.waiver}</p>            
          </ul>
          
          <p>To approve this appointment, please follow the <a href="http://localhost:3000/bookedevent/accept/${eventId}">link here</a>.</p>
          <p>To decline this appointment, please follow the <a href="http://localhost:3000/bookedevent/decline/${eventId}">link here</a>.</p>

          <p>Alternatively, you can also copy and paste the following link into your browser:</p>
          <p>link-to-your-booking-page</p>
          <p>Thank you!</p>
          
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



              /* i was getting 


              body: 
              '{"summary":
              "New Booking Request from jack",
              "description":"Tattoo of  on med size in inches by jack",
              "start":{"dateTime":"2023-11-16T05:00:00.000ZT9:0:00-undefined}",
              "timeZone":"America/New_York"},
              "end":{"dateTime":"2023-12-10T10:00:00-08:00",
              "timeZone":"America/Los_Angeles"},
              "attendees":[{"email":"jtucker0110@gmail.com",
              "responseStatus":"needsAction","displayName":"name","organizer":true}],
              "guestsCanModify":true,
              "reminders":{"useDefault":false,"overrides":[{"method":"email","minutes":30},{"method":"popup","minutes":10}]}}


               const event = {
        'summary': 'Meeting with Clients',
        'description': 'Discussing project updates',
        'start': {
          'dateTime': '2023-11-04T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'dateTime': '2023-11-04T10:00:00-08:00',
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
              */