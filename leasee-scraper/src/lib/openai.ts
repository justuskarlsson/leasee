import 'dotenv/config'
import { 
  Configuration, OpenAIApi,
  type CreateCompletionResponse, ChatCompletionRequestMessageRoleEnum 
} from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
export const openai = new OpenAIApi(configuration);
const model="gpt-3.5-turbo-16k"


export async function askGpt(instructions: string){
  try {
    const apiResponse = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: "system",
          content: instructions
        }
      ],
      temperature: 0.7,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    })
    return apiResponse.data.choices[0].message?.content || "";
  } catch (e) {
    console.error("ERROR: ", e);
    return "";
  }
}

