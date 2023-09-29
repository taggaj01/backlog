const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');
const rawClient = new DynamoDBClient();
const dynamodbClient = DynamoDBDocumentClient.from(rawClient);

const TableName =
  'IntMasPcmsDataSharedResources-PCMSApiDynamoDBTable-AYKAJ75H6R4Y';

const pk = 'producerInterface';
//const pk = 'registrationInterface';

const queryInterfaceItems = async (pk, startKey) => {
  let ExclusiveStartKey;
  if (startKey) {
    ExclusiveStartKey = {
      pk,
      sk: startKey,
      status: 'provisioned',
    };
  }
  const dynamoDBParams = {
    TableName: TableName,
    IndexName: 'status',
    ExclusiveStartKey,
    KeyConditionExpression: 'pk = :pk  and #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':pk': pk,
      ':status': 'provisioned',
    },
  };
  return dynamodbClient.send(new QueryCommand(dynamoDBParams));
};

const updatingItems = async (updateItems) => {
  skArray = [];

  for (let i = 0; i < updateItems.length; i++) {
    skArray.push(updateItems[i].sk);
  }

  skArray.forEach((sk) => {
    const command = {
      TableName: TableName,
      Key: {
        pk,
        sk,
      },
      ExpressionAttributeValues: {
        ':hashTrustScore': 100,
      },
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'set hashTrustScore = :hashTrustScore',
    };
    return dynamodbClient.send(new UpdateCommand(command));
  });
};

const run = async () => {
  const interfaces = await queryInterfaceItems(pk);
  const updateItems = interfaces.Items;
  updatingItems(updateItems);
};

run();
