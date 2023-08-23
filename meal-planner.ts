import axios from "axios";
import { config } from "dotenv";
import { Twilio } from "twilio";
import cron from "node-cron";

config();

const OPENAI_API_URL = "https://api.openai.com/v1/engines/davinci/completions";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
export const MY_PHONE_NUMBER = process.env.MY_PHONE_NUMBER!;
export const WIFE_PHONE_NUMBER = process.env.WIFE_PHONE_NUMBER!;
export const RECIPIENT_PHONE_NUMBERS = [
  process.env.MY_PHONE_NUMBER!,
  // process.env.WIFE_PHONE_NUMBER!,
  // Add any other numbers you want here
];

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const OPENAI_CHAT_API_URL = "https://api.openai.com/v1/chat/completions";

const cuisines = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "American",
  "Mediterranean",
  "Thai",
  "French",
];

function getRandomCuisine(): string {
  const randomIndex = Math.floor(Math.random() * cuisines.length);
  return cuisines[randomIndex];
}

export async function getMealSuggestion(): Promise<string> {
  const currentCuisine = getRandomCuisine();

  const response = await axios.post(
    OPENAI_CHAT_API_URL,
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that provides meal suggestions. 
          Format your response as 
          "What would you like to eat for the next few days? Here are some suggestions... 
          Breakfast: 
            1. Option 1 Name: Description 
            2. Option 2 Name: Description
            3. Option 3 Name: Description 

          Lunch:
            1. Option 1 Name: Description 
            2. Option 2 Name: Description
            3. Option 3 Name: Description
            
          Dinner:
            1. Option 1 Name: Description
            2. Option 2 Name: Description 
            3. Option 3 Name: Description"
          Keep the menu short. short 5 word descriptions.`,
        },
        {
          role: "user",
          content: `Provide three healthy, quick and easy-to-cook ${currentCuisine} meal suggestions. 3 for breakfast, 3 for lunch, 3 for and dinner.`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

export async function sendText(message: string) {
  for (const phone of RECIPIENT_PHONE_NUMBERS) {
    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phone,
    });
  }
}

export async function sendMealSuggestions() {
  const mealSuggestions = await getMealSuggestion();
  await sendText(mealSuggestions);
}

export async function generateGroceryList(meals: string[]): Promise<string> {
  const response = await axios.post(
    OPENAI_CHAT_API_URL,
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides grocery lists based on meal suggestions.",
        },
        {
          role: "user",
          content: `Generate a grocery list for these meal requests: ${meals.join(
            ", "
          )}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}
