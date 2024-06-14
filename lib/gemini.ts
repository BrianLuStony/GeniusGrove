import { GoogleGenerativeAI } from '@google/generative-ai';

const key = process.env.GEMINI_API_KEY;
if(!key){
    throw Error("No API Key provided");
}

export const genAI = new GoogleGenerativeAI(key);