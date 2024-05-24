'use strict';

const Hubspot = require('@hubspot/api-client');

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify(
      {
        message: 'Hello, Serverless!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.addContact = async (event) => {
  const hubspotClient = new Hubspot.Client({ accessToken: process.env.HUBSPOT_PRIVATE_APP_TOKEN });

  const contactData = JSON.parse(event.body);
  const properties = {
    firstname: contactData.properties.firstname,
    lastname: contactData.properties.lastname,
    email: contactData.properties.email,
    phone: contactData.properties.phone,
    message: contactData.properties.message,
  };

  try {
    const createContactResponse = await hubspotClient.crm.contacts.basicApi.create({ properties });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Contact added successfully', contact: createContactResponse.body }),
    };
  } catch (error) {
    console.error('Error adding contact to HubSpot:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
      },
      body: JSON.stringify({ message: 'Error adding contact to HubSpot', error: error.message }),
    };
  }
};
