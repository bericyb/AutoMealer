import express from "express";
import cron from "node-cron";
import {
  sendMealSuggestions,
  generateGroceryList,
  sendText,
} from "./meal-planner";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse";

const app = express();
const PORT = process.env.PORT || 6666;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allResponses: string[] = [];

app.get("/", (req, res) => {
  const preppedMeals = [...new Set(allResponses)];
  res.send(preppedMeals.join(" ,"));
});

app.get("/send-menu", (req, res) => {
  sendMealSuggestions();
});

app.post("/sms-response", (req, res) => {
  const senderMessage = req.body.Body;
  allResponses.push(senderMessage);
  sendText(`"${senderMessage}" was added to the grocery list.`);

  // If you want to process the responses immediately after all recipients respond:
  if (allResponses.length === 3) {
    processResponses();
  }

  const twiml = new MessagingResponse();

  res.type("text/xml").send(twiml.toString());
});

function processResponses() {
  // Ensure no duplicates
  const selectedMeals = [...new Set(allResponses)];

  // Generate and send grocery list
  (async () => {
    const groceryList = await generateGroceryList(selectedMeals);
    await sendText(`Grocery List: ${groceryList}`);

    // Clear the responses to start fresh next time
    allResponses = [];
  })();
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log("Server Timezone:", timeZone);

// Setting up the cron job
// This will send meal suggestions every 2 days at 9 AM
cron.schedule("0 9 */2 * *", async () => {
  try {
    await sendMealSuggestions();
    console.log("Meal suggestions sent!");
  } catch (error) {
    console.error("Error occurred while sending meal suggestions:", error);
  }
});
