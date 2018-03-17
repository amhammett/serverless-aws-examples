Serverless AWS Examples
=======================

A collection of examples using Serverless to manage AWS resources.


## Record Management

A Lambda api function that accepts rest request working with a DynamoDB backend to manage records.

Resources:

- API Gateway
- DynamoDB
- Lambda


## Message Queue Service

A Lambda api function that accepts get requests to add to a Kinesis queue for downstream processing.

Resources:

- API Gateway
- Kinesis
- Lambda


## Queue Send Service

A Lambda function that reads from a Kinesis queue for processing.

Resources:

- Lambda
- Kinesis
