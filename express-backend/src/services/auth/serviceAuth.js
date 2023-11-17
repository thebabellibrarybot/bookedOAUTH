const { jwtSecret } = require('../../config');
const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const { google } = require('googleapis');

// eventually i want to replace this with a sercrets manager function...
/*
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getSecret() {
  const secretName = 'your-secret-name';

  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secret = JSON.parse(data.SecretString);

    // Use the extracted credentials from the secret in your application
    const clientId = secret.clientId;
    const clientSecret = secret.clientSecret;

    return { clientId, clientSecret };
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

// Example usage
const secretValues = await getSecret();
console.log(secretValues);
*/

function getOAuth2ServiceClient() {
  // Load the credentials from the service account key file
  const serviceAccountKey = require('/path/to/service-account-key.json');

  // Create a new JWT client using the service account credentials
  const auth = new JWT({
    email: serviceAccountKey.client_email,
    key: serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'], // Example scope
  });

  return auth;
}

module.exports = {
    getOAuth2ServiceClient,
    };