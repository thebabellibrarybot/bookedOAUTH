const AWS = require('aws-sdk');

// Set the AWS region
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

// Function to retrieve the secret
async function getSecret(secretName) {
  const secretsManager = new AWS.SecretsManager();

  try {
    const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secretValue = JSON.parse(data.SecretString);
    return secretValue;
  } catch (error) {
    console.error(`Error retrieving secret ${secretName}: ${error}`);
    throw error;
  }
}

module.exports = {
    getSecret,
    };