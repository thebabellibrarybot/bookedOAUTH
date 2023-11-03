require('dotenv').config();
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

function AuthController(database, logger) {

    this.database = database
    this.logger = logger

    const CONST = require("../utils/constants")
    const bcrypt = require("bcrypt")
    const DuplicatedEmailError = require("../utils/customErrors")
    const jwtUtil = require("../utils/jwt")

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

    const toEmail = 'jtucker0110@gmail.com';
    const emailSubject = 'Hello World';
    const emailBody = 'This is a test email sent from my chatbot!';
    const emailContent = `To: ${toEmail}\r\nSubject: ${emailSubject}\r\n\r\n${emailBody}`;
    const base64EncodedEmail = Buffer.from(emailContent).toString('base64');


            

    // this will create a calendarevent and then also send an email to accept or decline the calendar event
    this.postBookingByUserID = async(request, response) => { 

        console.log(request.session.passport.user, "request.session.passport.user from postBookingByUserID") 
        try {

            const oauth2Client = new google.auth.OAuth2(
                `${process.env.GOOGLE_AUTH_CLIENT_ID}`,
                `${process.env.GOOGLE_AUTH_CLIENT_SECRET}`
              );
            oauth2Client.setCredentials({
                access_token: request.session.passport.user.accessToken,
                refresh_token: request.session.passport.user.refreshToken
            })


            if (request.session.passport.user.accessToken) {

                const calendar = google.calendar(
                    { 
                        version: 'v3',
                        auth: oauth2Client 
                    }
                )
                const gmail = google.gmail({
                    version: 'v1',
                    auth: oauth2Client,
                  }
                )
            
                calendar.events.insert({
                    calendarId: 'primary',
                    resource: event
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err)

                    console.log('Event created: %s', res.data.htmlLink)
                    console.log('sending follow up email')

                    gmail.users.messages.send({
                        userId: 'me',
                        resource: {
                          raw: base64EncodedEmail,
                        },
                      })
                    
                })
                console.log('sent email succ')

            } else {
                response.status(401).json({ error: 'Unauthorized no access token' })
            }
        }
        catch(error) {
            const message = `Imposible to login user for sched: ${error}`
            this.logger.error(message)
            response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: message })
        }
    }

    const createEvent = (eventData, auth) => {
        console.log(eventData, "eventData from createEvent")
        const { google } = require('googleapis')
        const calendar = google.calendar({ version: 'v3', auth: auth})
        calendar.events.insert({
            calendarId: 'primary',
            resource: eventData
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err)
            console.log(res.data, "res.data from createEvent")
            console.log('Event created: %s', res.data.htmlLink)
        })
    }

}

const logger = require("../services/log")
const database = require("../services/database")
const authController = new AuthController(database, logger)

module.exports = authController