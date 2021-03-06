import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.postsTableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'blogPostId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      blogPostId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET title = :title, content = :content, image = :image, blogPostState = :blogPostState, publishedDate = :publishedDate",
    ExpressionAttributeValues: {
      ":publishedDate": data.publishedDate || null,
      ":blogPostState": data.blogPostState || null,
      ":image": data.image || null,
      ":content": data.content || null,
      ":title": data.title || null
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const result = await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
