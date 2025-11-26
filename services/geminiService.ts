import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProgressReport = async (student: Student): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot generate report.";

  try {
    const prompt = `
      Act as a senior academic advisor. Analyze the following student performance data and provide a concise, constructive progress report for their parents.
      Focus on strengths and areas for improvement. Keep it under 150 words.
      
      Student: ${student.firstName} ${student.lastName}
      Grade: ${student.grade}
      Attendance: ${student.attendance}%
      Grades: ${JSON.stringify(student.performance)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate report due to AI service error.";
  }
};

export const draftSMS = async (recipient: string, topic: string, studentName: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Cannot draft message.";

  try {
    const prompt = `
      Draft a professional, polite, and short SMS message (max 160 characters) to a parent named ${recipient}.
      The message is regarding their child, ${studentName}, about the following topic: "${topic}".
      Do not include placeholders.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating message.";
  }
};
