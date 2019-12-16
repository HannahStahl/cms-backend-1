import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.postsTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      blogPostId: uuid.v1(),
      title: data.title,
      content: data.content,
      image: data.image,
      blogPostState: data.blogPostState,
      publishedDate: data.publishedDate,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
