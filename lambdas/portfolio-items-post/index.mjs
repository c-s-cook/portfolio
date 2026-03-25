import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
// DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME || "portfolio-items";
export const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);
export const handler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing request body" }),
            };
        }
        // get the Action-Type header value that this AWS Lambda function is processing
        const actionType = event.headers['Action-Type'];
        console.log("Action-Type: ", actionType);
        if (!actionType || (actionType !== 'add') || (actionType !== 'edit')) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: `Invalid Action-Type: '${actionType}'` }),
            };
        }
        // console.log("body: ", event.body);
        const portfolioitem = (typeof (event.body) == 'object') ? event.body : JSON.parse(event.body);
        // If adding a new item, find the highest id for this type, increment, and set item.id
        if (actionType === 'add') {
            const queryCmd = new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "#type = :typeVal",
                ExpressionAttributeNames: { "#type": "type", "#id": "id" },
                ExpressionAttributeValues: { ":typeVal": portfolioitem.type },
                ProjectionExpression: "#id",
                ScanIndexForward: false, // descending order
                Limit: 1,
            });
            const queryResult = await ddbDocClient.send(queryCmd);
            const highestId = queryResult.Items && queryResult.Items.length > 0
                ? queryResult.Items[0].id
                : 0;
            portfolioitem.id = highestId + 1;
        }
        // Put the new project into the table
        // or update an existing project by overwriting
        const putCmd = new PutCommand({
            TableName: TABLE_NAME,
            Item: portfolioitem,
        });
        await ddbDocClient.send(putCmd);
        let type = portfolioitem.type == 'PROJ' ? 'Project' : 'Certification';
        // console.log(`Succes: ${type} Saved`);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: `${type} ${portfolioitem.id} ${actionType === 'add' ? 'added' : 'updated'}: ${portfolioitem}` }),
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Internal server error" }),
        };
    }
};
