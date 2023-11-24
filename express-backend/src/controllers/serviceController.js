require("dotenv").config();
const { google } = require("googleapis");
const { createCalendarEvent, sendEmail, composeEvent, composeGmail, composeConfirmationEmail } = require("../services/auth/googleAPI");
const { getOAuth2ServiceClient } = require("../services/auth/serviceAuth");


function ServiceController(database, logger) {

    this.database = database
    this.logger = logger

    const CONST = require("../utils/constants")

    // create a new auth object with the service account keys
    // create a email and calendar object
    // send the calendar and email object to the client
    // update the db with the client's calendar and email object

    this.postSchedule = async (request, response) => {
        this.logger.info(`Received request to postSchedule: ${request.body}`);
        try {
            const oauth2Client = await getOAuth2ServiceClient();
            const bookingFormInfo = request.body.bookingFormInfo;
            const userEntry = request.body.userEntry;
            const booking = {
                userOrgin: bookingFormInfo.adminId,
                name: userEntry.name,
                email: userEntry.email,
                phone: userEntry.phone,
                date: userEntry.date,
                time: userEntry.time,
                message: userEntry.message,
                image: userEntry.image,
                size: userEntry.size,
                waiver: userEntry.waiver,
                timeZone: userEntry.timeZone,
            }
            const newScheduleObject = await this.database.addBookingSchedById(booking);
            const eventId = newScheduleObject._id;
            if (newScheduleObject) {
                const event = composeEvent(userEntry, bookingFormInfo);
                const base64EncodedEmail = composeGmail(userEntry, bookingFormInfo, eventId);
                const base64EncodedConfirmationEmail = composeConfirmationEmail(userEntry, bookingFormInfo, eventId);
                const sentGmail = await sendEmail(oauth2Client, base64EncodedEmail);
                const sentConfirmationEmail = await sendEmail(oauth2Client, base64EncodedConfirmationEmail);
                const calendarEventLink = await createCalendarEvent(oauth2Client, event);

                const sentGmailAuth = sentGmail.headers.Authorization;
                const sentGmailResUrl = sentGmail.request.reqponseURL;

                if (calendarEventLink && sentGmail && sentConfirmationEmail) {

                    this.logger.info(`Event created: %s ${calendarEventLink}`);
                    this.logger.info(`Email sent: %s ${sentGmail}`);
        
                    const addToBookingSchedule = {
                    eventLink: calendarEventLink,
                    sentGmailResUrl: sentGmailResUrl,
                    }
                    const updatedBookingSchedule = await this.database.updateBookingSchedById(eventId, addToBookingSchedule);
                    this.logger.info(`updatedBookingSchedule added to db: ${updatedBookingSchedule}`);
        
                    response.status(200).json({
                    message: 'successfully added new schedule entry',
                    updatedBookingSchedule,
                    eventLink: calendarEventLink,
                    });

                } else {
                    this.logger.error('Failed to create event or send email');
                    response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: 'Failed to process the request.' });
                }
            } else {
                this.logger.error('Failed to create event or send email');
                response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: 'Failed to process the request.' });
            }
            } catch (error) {
                this.logger.error(`Error during postBookingByUserID: ${error}`);
                response.status(CONST.httpStatus.INTERNAL_ERROR).json({ error: 'Failed to process the request.' });
            }
        };

}

const logger = require("../services/log")
const database = require("../services/database")
const serviceController = new ServiceController(database, logger)

module.exports = serviceController