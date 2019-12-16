import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context) {
  const params = {
    TableName: process.env.postsTableName,
    // 'KeyConditionExpression' defines the condition for the query
    // - 'userId = :userId': only return items with matching 'userId'
    //   partition key
    // 'FilterExpression' defines the additional condition for the query
    // - 'blogPostState' = :blogPostState: only return published items
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': path parameter
    // - ':blogPostState': "Published"
    KeyConditionExpression: "userId = :userId",
    FilterExpression: "blogPostState = :blogPostState",
    ExpressionAttributeValues: {
      ":userId": event.pathParameters.userId,
      ":blogPostState": "Published"
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Sort blog posts by published date
    const blogPosts = result.Items;
    blogPosts.sort(function(a, b) {
      return new Date(b.publishedDate) - new Date(a.publishedDate);
    });
    // Return the blog posts in response body
    return success(blogPosts);
  } catch (e) {
    return failure({ status: false });
  }
}
