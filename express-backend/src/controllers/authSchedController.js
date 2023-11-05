require('dotenv').config();
const { google } = require('googleapis');

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
          'dateTime': '2023-11-06T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles',
        },
        'end': {
          'dateTime': '2023-11-06T10:00:00-08:00',
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

    this.sendBookingEmail = async(request, response) => {

        const adminSched = jwtUtil.decodeJWT(request.cookies.adminSched)
        const refreshToken = jwtUtil.decodeJWT(request.cookies.adminSched).id.providers[0].refreshToken

        console.log(adminSched, 'adminSched from sendBookingEmail', refreshToken, 'refreshToken from sendBookingEmail')

        try {

          const oauth2Client = new google.auth.OAuth2(
              `${process.env.GOOGLE_AUTH_CLIENT_ID}`,
              `${process.env.GOOGLE_AUTH_CLIENT_SECRET}`
            );
          oauth2Client.setCredentials({
              refresh_token: refreshToken
          })


          if (refreshToken) {

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

      response.status(200).json({ message: 'email sent' })
    
    }

}

const logger = require("../services/log")
const database = require("../services/database")
const authController = new AuthController(database, logger)

module.exports = authController