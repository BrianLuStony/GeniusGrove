import { genAI } from '@/lib/gemini';
import { NextResponse } from 'next/server';
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "When responding with code, do not use ```html or ```. Just provide plain HTML code." }],
    },
    {
      role: "model",
      parts: [{ text: "Understood. I'll provide plain HTML code without using code fences." }],
    },
  ],
  generationConfig: {
    maxOutputTokens: 2000,
  },
});


export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ message: 'Invalid prompt' }, { status: 400 });
    }
    const result = await chat.sendMessage(prompt);
    const text = await result.response.text();
    // console.log("Post response is:", text);
    return NextResponse.json({ response: text });
  } catch (e) {
    console.log({ e });
    return NextResponse.json({ message: 'Failed to generate content' }, { status: 500 });
  }
}

// async function parseRequestBody(req: NextApiRequest): Promise<{ prompt: string }> {
//   return new Promise((resolve, reject) => {
//     let body = '';
//     req.on('data', (chunk) => {
//       body += chunk.toString();
//     });
//     req.on('end', () => {
//       try {
//         resolve(JSON.parse(body));
//       } catch (error) {
//         reject(error);
//       }
//     });
//     req.on('error', reject);
//   });
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { prompt } = await parseRequestBody(req);

//       res.status(200).json({ status: 'Prompt received' });
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ error: 'Something went wrong' });
//     }
//   } else if (req.method === 'GET') {
//     try {
//       const prompt = Array.isArray(req.query.prompt) ? req.query.prompt[0] : req.query.prompt;
//       if (!prompt) {
//         return res.status(400).json({ error: 'Prompt is required' });
//       }
//       const chat = model.startChat({
//         history: [
//           { role: 'user', parts: [{ text: "Don't return any markdown format" }] },
//           { role: 'model', parts: [{ text: 'Okay will do so' }] },
//         ],
//         generationConfig: { maxOutputTokens: 1000 },
//       });

//       const responseStream = await chat.sendMessageStream(prompt);

//       res.setHeader('Content-Type', 'text/event-stream');
//       res.setHeader('Cache-Control', 'no-cache');
//       res.setHeader('Connection', 'keep-alive');
//       res.flushHeaders();

//       const passThrough = new PassThrough();
//       passThrough.pipe(res);

//       let responseText = '';

//       for await (const chunk of responseStream.stream) {
//         const chunkText = chunk.text();
//         responseText += chunkText;
//         passThrough.write(`data: ${chunkText}\n\n`);
//       }

//       passThrough.write('data: [DONE]\n\n');
//       passThrough.end();
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Error generating response' });
//     }
//   }
// }
