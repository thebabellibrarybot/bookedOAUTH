const { JWT } = require('google-auth-library');
const { getSecret } = require('../../utils/secretAWS');
const { google } = require('googleapis');

async function getOAuth2ServiceClient() {
  try {

    const serviceAccountKey = await getSecret('secret-service-json');

    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.send",
      ],
    });

    auth.subject = "info@bokted.com";

    return auth;

  } catch (error) {
    console.error('Error getting OAuth2 service client:');
    throw error;

  }
}

module.exports = {
    getOAuth2ServiceClient,
    }