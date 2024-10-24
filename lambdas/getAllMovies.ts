import { Handler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

// Initialization
const ddbDocClient = createDDbDocClient();

export const handler: Handler = async (event) => {
    try {
        const data = await ddbDocClient.send(
            new ScanCommand({
                TableName: process.env.TABLE_NAME!,
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error }),
        };
    }
};

function createDDbDocClient() {
    const ddbDocClient = DynamoDBDocumentClient.from(
        new DynamoDBClient({ region: process.env.AWS_REGION })
    );
    const marshallOptions = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
        wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbDocClient, translateConfig);
}
