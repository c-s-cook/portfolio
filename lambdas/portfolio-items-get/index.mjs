import { DynamoDBClient, ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
const dynamoDbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
export const handler = async (event) => {
    try {
        // Set table name...
        const tableName = process.env.TABLE_NAME;
        if (!tableName) {
            throw new Error("TABLE_NAME environment variable is not set.");
        }
        // Check for query params. Means this is a call from a specific content page...
        const params = event.queryStringParameters || null;
        if (params && params.type && params.slug) {
            // ...then I guess I need to find the specific slug...
            console.log('Got these params in the req: ', params.type, params.slug);
            const queryCommand = new QueryCommand({
                TableName: tableName,
                IndexName: 'SlugIndex',
                KeyConditionExpression: '#type = :typeVal AND slug = :slug',
                ExpressionAttributeNames: { '#type': 'type' },
                ExpressionAttributeValues: marshall({
                    ':typeVal': params.type,
                    ':slug': params.slug
                }),
                Limit: 1
            });
            const response = await dynamoDbClient.send(queryCommand);
            const item = (response && response.Items && response.Items[0]) ? unmarshall(response.Items?.[0]) : null;
            if (!item)
                throw new Error('empty stringParams item returned?');
            else {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        projects: item.type === 'PROJ' ? [item] : [],
                        certifications: item.type === 'CERT' ? [item] : [],
                        uniqueTags: []
                    })
                };
            }
        }
        // Query all items from the DynamoDB table
        const scanCommand = new ScanCommand({ TableName: tableName });
        const result = await dynamoDbClient.send(scanCommand);
        const items = result.Items?.map(item => unmarshall(item)) || [];
        // Filter items by type
        const projects = items.filter(item => item.type === "PROJ");
        const certifications = items.filter(item => item.type === "CERT");
        // Extract unique tags with counts
        const allTags = items.flatMap(item => item.tags || []);
        const tagCounts = {};
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
    }
    catch (error) {
        console.error("Error fetching items:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch items." })
        };
    }
};
