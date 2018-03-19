'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamo_db = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.DYNAMODB_TABLE;

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  if (typeof data.data !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the record item.',
    });
    return;
  }

  const params = {
    TableName: table_name,
    Item: {
      uuid: uuid.v1(),
      record: data.data,
      id: data.id,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamo_db.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: '¯\\_(ツ)_/¯ Couldn\'t create the record item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
