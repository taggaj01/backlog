const { DynamoDBClient, ScanCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({});

// testtable var tableName = 'url-presigner';
var tableName = 'LiveFbdPackTrackResources-PackTrackDynamoDBTable-VZ5SB2LZNZLF';

const run = async () => {
    const params = new ScanCommand({
        TableName: tableName
    });
    var itemArray = [];

    const res = await client.send(params);
    for (let i = 0; i < res.Items.length; i++) {
        var item = res.Items[i];

        deleteReq = {
            DeleteRequest: {
                Key: item
            }
        };

        itemArray.push(deleteReq);
    }

    const command = new BatchWriteItemCommand({
        RequestItems: {
            // 'url-presigner': itemArray
            'LiveFbdPackTrackResources-PackTrackDynamoDBTable-VZ5SB2LZNZLF': itemArray
        }
    });

    const response = await client.send(command);
    console.log(response);
    return response;
};

run();
