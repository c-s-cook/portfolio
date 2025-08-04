import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME || "portfolio-items";

export const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export interface Project {
  type: string;
  id: number;
  title: string;
  body: string;
  tags: string[];
  thumbnails: any[];
  [key: string]: any;
}

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

    // console.log("body: ", event.body);
    const project: Project = (typeof(event.body) == 'object') ? event.body : JSON.parse(event.body);

    // If id is 0, find the highest id for this type and increment
    if (project.id === 0) {
      const queryCmd = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#type = :typeVal",
        ExpressionAttributeNames: { "#type": "type", "#id": "id" },
        ExpressionAttributeValues: { ":typeVal": project.type },
        ProjectionExpression: "#id",
        ScanIndexForward: false, // descending order
        Limit: 1,
      });

      const queryResult = await ddbDocClient.send(queryCmd);
      const highestId = queryResult.Items && queryResult.Items.length > 0
        ? queryResult.Items[0].id
        : 0;
      project.id = highestId + 1;
    }

    // Put the new project into the table
    const putCmd = new PutCommand({
      TableName: TABLE_NAME,
      Item: project,
    });

    await ddbDocClient.send(putCmd);

    console.log("Succes: Proj Saved");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Project saved", project }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal server error" }),
    };
  }
};