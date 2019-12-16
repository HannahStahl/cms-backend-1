import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.commentsTableName,
    KeyConditionExpression: "blogPostId = :blogPostId",
    ExpressionAttributeValues: {
      ":blogPostId": event.pathParameters.id
    }
  };
  try {
    const result = await dynamoDbLib.call("query", params);
    return success(result.Items);
  } catch (e) {
    return failure({ error: e });
  }
}
