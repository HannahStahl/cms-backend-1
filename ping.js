import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  try {
    return success("pong");
  } catch (e) {
    return failure({ status: false });
  }
}
