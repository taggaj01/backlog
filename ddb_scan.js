const { DynamoDBClient, ScanCommand, BatchWriteItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient({});

var tableName = 'LiveFbdPackTrackResources-PackTrackDynamoDBTable-VZ5SB2LZNZLF';

const run = async () => {
    const params = new ScanCommand({
        TableName: tableName
    });
    var itemArray = [];
    var proccessingArray = [];
    var batchNo = 0;
    var batchRes = 'good';

    const res = await client.send(params);
    for (let i = 0; i < res.Items.length; i++) {
        var item = res.Items[i];
        deleteReq = {
            DeleteRequest: {
                // Key: item
                Key: { mediastore: res.Items[i].mediastore, package_id: res.Items[i].package_id }
            }
        };
        itemArray.push(deleteReq);
    }

    while (itemArray.length > 0 && batchRes === 'good') {
        proccessingArray = itemArray.splice(0, 25);
        console.log('Current Processsing', proccessingArray.length);
        console.log('Items Remaining', itemArray.length);
        console.log('Batch Number', batchNo);
        const command = new BatchWriteItemCommand({
            RequestItems: {
                tableName: proccessingArray
            }
        });
        const response = client.send(command, function (err, data) {
            if (err) {
                batchRes = 'Error';
                console.log('Error', err);
            } else {
                console.log('Success', data);
                console.log(response);
            }
        });
        batchNo++;
        if (batchNo === 100) {
            batchRes = 'check';
            console.log('2500 items should have been deleted. Rerun if your batch is bigger than this');
        }
    }

    console.log('Process Ended');
};

run();
