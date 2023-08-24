# AutoMealer 🍽️

AutoMealer is an automated meal suggestion and planning tool that sends text messages with meal suggestions and generates grocery lists. The application uses OpenAI's GPT-3 API for generating meal ideas and Twilio for sending text messages.

## Features

- 🍲 Automatically suggests meals from different cuisines every 2 days.
- 📲 Sends meal suggestions as text messages.
- 🛒 Generates grocery lists based on selected meals.

## Installation & Setup

### Prerequisites

- Docker & Docker Compose
- Node.js and npm (if running outside Docker)

### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/automealer.git
cd automealer
```

2. **Environment Variables:**

Copy the provided `.env.sample` to a new file named `.env`. Fill out the necessary details:

```
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
MY_PHONE_NUMBER=YOUR_PHONE_NUMBER
WIFE_PHONE_NUMBER=WIFE_PHONE_NUMBER
```

Note: You can add more phone numbers in the `meal-planner.ts` file as needed.

3. **Docker Setup:**

To start the application using Docker and Docker Compose, navigate to the project's root directory and run:

```bash
docker-compose up -d
```

This will start the services in detached mode. The application will run on `http://localhost:6666`.

To stop the services:

```bash
docker-compose down
```

## Usage

Once the application is up and running, it will automatically schedule tasks to send meal suggestions every 2 days at a specified time. The recipients of these messages are defined in the environment variables and can be adjusted as necessary.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

---

Feel free to adjust this template as needed, especially the repository URL, features, and other details specific to your project!