const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb');

const TableName =
  'IntMasPcmsDataSharedResources-PCMSApiDynamoDBTable-AYKAJ75H6R4Y';

const pk = ['producerInterface', 'registrationInterface'];

const queryInterfaceItems = async (pk, dynamodbClient, startKey) => {
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

const updatingItems = async (pk, updateItems, dynamodbClient) => {
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
  for (let i = 0; i < pk.length; i++) {
    const rawClient = new DynamoDBClient();
    const dynamodbClient = DynamoDBDocumentClient.from(rawClient);

    const interfaces = await queryInterfaceItems(pk[i], dynamodbClient);
    const updateItems = interfaces.Items;
    updatingItems(pk[i], updateItems, dynamodbClient);
  }
};

run();
