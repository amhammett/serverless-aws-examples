'use strict';

const AWS = require('aws-sdk');

const dynamo_db = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.DYNAMODB_TABLE;

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.data !== 'string' || typeof data.id !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the record.',
    });
    return;
  }

  const params = {
    TableName: table_name,
    Key: {
      uuid: event.pathParameters.uuid,
    },
    ExpressionAttributeNames: {
      '#d': 'data',
    },
    ExpressionAttributeValues: {
      ':data': data.data,
      ':id': data.id,
      ':updatedAt': timestamp,
    },
    UpdateExpression:
      'SET #d = :data, id = :id, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  dynamo_db.update(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the record.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };

    callback(null, response);
  });
};
