import * as functions from "firebase-functions";
import fetch from "node-fetch";

// Зберігаємо API ключ у конфігурації
const OPENAI_API_KEY = functions.config().openai.key;

// Оголошення типу для OpenAI відповіді
interface OpenAIResponse {
  choices: { text: string }[];
}

export const checkLetterForProfanity = functions.https.onCall(
  async (data: { text: string }, context: functions.https.CallableContext) => {
    const letterText = data.text; // текст листа, отриманий з клієнта

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4", // Модель GPT для перевірки
          prompt: `Перевір цей текст на наявність нецензурної лексики та реклами: ${letterText}`,
          max_tokens: 100,
          temperature: 0,
        }),
      });

      // Використовуємо "as OpenAIResponse" для явного ствердження типу
      const result = await response.json() as OpenAIResponse;

      return {status: "success", result: result.choices[0].text.trim()};
    } catch (error) {
      console.error(error);
      return {status: "error", message: "Failed to check the letter"};
    }
  }
);
