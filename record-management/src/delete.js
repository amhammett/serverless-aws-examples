'use strict';

const AWS = require('aws-sdk');

const dynamo_db = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.DYNAMODB_TABLE;

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: table_name,
    Key: {
      uuid: event.pathParameters.uuid,
    },
  };

  dynamo_db.delete(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the record item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({}),
    };

    callback(null, response);
  });
};
