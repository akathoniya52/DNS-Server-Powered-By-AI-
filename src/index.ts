import { GoogleGenerativeAI } from '@google/generative-ai';
import { createResponse, createTxtAnswer, DnsQueryMessage, DnsResponseMessage, QueryHandler, QuerySource, startUdpServer } from 'denamed'
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY! as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

console.log("Working started...!")
startUdpServer(async(query: DnsQueryMessage, source: QuerySource):Promise<DnsResponseMessage> => {
    // console.log(query);
    const question = query.questions![0];
    console.log(question)
    const prompt = `Answer the question in one word or sentence.
        Questions - ${question.name.split(".").join(" ")}?`;
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    // Handle the source if needed

    // Create and return a response
    // const response: DnsResponseMessage = {
        // Populate the response as needed
    // };
    // return response; // Ensure to return a DnsResponseMessage
    return createResponse(query, [createTxtAnswer(question as any, result.response.text())])
}, { port: 53 });

    
    
   
