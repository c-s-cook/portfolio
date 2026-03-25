import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import type { Project, Certification } from "../../frontend/lib/types"

// DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME || "portfolio-items";

export const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);



export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    // get the Action-Type header value that this AWS Lambda function is processing
    // the lambda integration seems to automatically convert header keys to lowercase, 
    // so we check for both 'action-type' and 'Action-Type'...
    const actionType = event.headers['action-type'] || event.headers['Action-Type'];

    console.log("Action-Type: ", actionType);
    if (!actionType || (actionType !== 'add') || (actionType !== 'edit')) {
      console.log('Action-Type error. Headers: ', JSON.stringify(event.headers, null, 2));

      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Invalid Action-Type: '${actionType}'` }),
      };
    }

    // console.log("body: ", event.body);
    const portfolioitem: Project | Certification = (typeof (event.body) == 'object') ? event.body : JSON.parse(event.body);

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
      body: JSON.stringify({ message: `${type} ${portfolioitem.id} ${actionType === 'add' ? 'added' : 'updated'}: ${portfolioitem}`}),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};