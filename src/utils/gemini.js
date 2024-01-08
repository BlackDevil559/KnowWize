import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';

const genAI = new GoogleGenerativeAI("AIzaSyDFoLv1BqP1JNcSXva94WetS6UCP4YJepI");

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

export async function run(prompt,image) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });


  const imageParts = [
    fileToGenerativePart('rohit.png', 'image/png'),
  ];
  console.log(imageParts);
  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run("who is this",'rohit.png')