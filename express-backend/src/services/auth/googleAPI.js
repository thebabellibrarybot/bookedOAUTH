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

module.exports = {
    getOAuth2Client,
    createCalendarEvent,
    sendEmail
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