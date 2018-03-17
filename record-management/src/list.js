'use strict';

const AWS = require('aws-sdk');

const aws_default_region = process.env.AWS_DEFAULT_REGION;

if (!AWS.config.region && aws_default_region) {
  AWS.config.update({
    region: aws_default_region
  });
}

const dynamo_db = new AWS.DynamoDB.DocumentClient();
const table_name = process.env.DYNAMODB_TABLE;

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: table_name
  };

  dynamo_db.scan(params, (error, result) => {
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result.Items),
    };

    callback(null, response);
  });
};
