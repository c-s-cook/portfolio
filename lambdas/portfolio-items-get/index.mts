import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" });

export const handler = async () => {
    try {
        // Query all items from the DynamoDB table
        const tableName = process.env.TABLE_NAME;
        if (!tableName) {
            throw new Error("TABLE_NAME environment variable is not set.");
        }

        const scanCommand = new ScanCommand({ TableName: tableName });
        const result = await dynamoDbClient.send(scanCommand);

        const items = result.Items?.map(item => unmarshall(item)) || [];

        // Filter items by type
        const projects = items.filter(item => item.type === "PROJ");
        const certifications = items.filter(item => item.type === "CERT");

        // Extract unique tags with counts
        const allTags = items.flatMap(item => item.tags || []);
        const tagCounts: Record<string, number> = {};
        allTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
        const uniqueTags = Object.entries(tagCounts).map(([tag, count]) => ({ tag, count }));

        // Return the response
        return {
            statusCode: 200,
            body: JSON.stringify({
                projects,
                certifications,
                uniqueTags
            })
        };
    } catch (error) {
        console.error("Error fetching items:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch items." })
        };
    }
};
