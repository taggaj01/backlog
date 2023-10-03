# backlogScript

Updating Dynamo database table with update script

## How to Run

Set your Dynamo db table name as the tableName variable.
Set your Partition key as the pk variable.

Within the updateItem function you can set the value. [aws-documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/example_dynamodb_UpdateItem_section.html)

WormHole into the AWS

```
wormhole-mfa --duration-seconds=43200 <aws-Account-Alias> --console
eval <aws-Account-Alias>
wormhole-mfa <aws-Account-Alias>
```

Once all set up run the backlogScript.js

```
node backlogScript.js
```
