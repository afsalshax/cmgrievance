import { GoogleGenAI } from "@google/genai";
import Department from "../models/Department.js";

const getAIClient = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is missing");
    }

    return new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
};

const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (ai, request, maxRetries = 1) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await ai.models.generateContent(request);
        } catch (error) {
            const isTemporaryError = [429, 500, 502, 503, 504].includes(
                Number(error.status)
            );

            if (!isTemporaryError || attempt === maxRetries) {
                throw error;
            }

            console.log(
                `Gemini temporarily unavailable. Retrying ${attempt}/${maxRetries}...`
            );

            await delay(attempt * 2000);
        }
    }
};

export const analyzeGrievance = async ({
    subject,
    description,
    district
}) => {
    try {
        const ai = getAIClient();

        // Get available departments
        const departments = await Department.find({
            isActive: true
        })
            .select("name category")
            .lean();

        if (!departments.length) {
            throw new Error("No active departments found");
        }

        const departmentNames = departments.map(d => d.name);

        const prompt = `
You are an AI assistant for a public grievance management portal.

Analyze the following complaint.

SUBJECT:
${subject}

DESCRIPTION:
${description}

DISTRICT:
${district}

AVAILABLE DEPARTMENTS:
${departmentNames.join(", ")}

Return the following information:

1. suggestedDepartment: Select one department from the available list.
2. suggestedCategory: Suitable complaint category.
3. priority: Low, Medium, or High.
4. summary: Short summary for the CMO.
5. possibleDuplicate: Boolean indicating whether the complaint content suggests a possible duplicate.

RULES:
- Select only from available departments.
- Never invent facts.
- High priority should indicate potentially serious or urgent public impact.
- Do not make official decisions.
- Duplicate detection is preliminary and not verified against existing grievances.
- If uncertain about department selection, return an empty string.
`;

        const response = await generateWithRetry(ai, {
            model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json",
                responseJsonSchema: {
                    type: "OBJECT",
                    properties: {
                        suggestedDepartment: {
                            type: "STRING"
                        },
                        suggestedCategory: {
                            type: "STRING"
                        },
                        priority: {
                            type: "STRING",
                            enum: ["Low", "Medium", "High"]
                        },
                        summary: {
                            type: "STRING"
                        },
                        possibleDuplicate: {
                            type: "BOOLEAN"
                        }
                    },
                    required: [
                        "suggestedDepartment",
                        "suggestedCategory",
                        "priority",
                        "summary",
                        "possibleDuplicate"
                    ]
                }
            }
        });

        if (!response.text) {
            throw new Error("Gemini returned an empty response");
        }

        const result = JSON.parse(response.text);

        // Validate department
        const validDepartment = departments.find(
            department =>
                department.name.toLowerCase() ===
                String(result.suggestedDepartment || "")
                    .trim()
                    .toLowerCase()
        );

        // Validate priority
        const allowedPriorities = ["Low", "Medium", "High"];

        const priority = allowedPriorities.includes(result.priority)
            ? result.priority
            : "Medium";

        return {
            suggestedDepartment: validDepartment
                ? validDepartment.name
                : "Needs manual review",

            suggestedCategory: String(
                result.suggestedCategory || "General"
            ).trim(),

            priority,

            summary: String(result.summary || "").trim(),

            possibleDuplicate:
                result.possibleDuplicate === true
        };

    } catch (error) {
        console.error("========== GEMINI API ERROR ==========");
        console.error("Message:", error.message);
        console.error("Status:", error.status);
        console.error("Name:", error.name);
        console.error("Details:", error);
        console.error("======================================");

        throw error;
    }
};