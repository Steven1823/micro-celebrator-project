# 🎉 Micro-Milestone Celebrator

A fullstack application that celebrates your small wins with confetti animations, Slack notifications, congratulatory emails, and WhatsApp messages!

## Features

- ✨ Dark-themed task management interface
- 🎊 Confetti animations on task completion
- 📧 Congratulatory emails via Resend API
- 💬 Slack notifications via webhooks
- 📱 WhatsApp messages via Twilio
- 📱 Mobile-responsive design
- 💾 Local storage for persistence

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup

Create a \`.env\` file in the root directory:

\`\`\`bash
EMAIL_API_KEY=your_resend_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
\`\`\`

**Getting your Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy it to your \`.env\` file

### 3. Slack Webhook Setup

**Getting your Slack Webhook URL:**
1. Go to your Slack workspace
2. Visit [api.slack.com/apps](https://api.slack.com/apps)
3. Click "Create New App" → "From scratch"
4. Name your app and select your workspace
5. Go to "Incoming Webhooks" → Toggle "On"
6. Click "Add New Webhook to Workspace"
7. Select a channel and authorize
8. Copy the webhook URL (starts with \`https://hooks.slack.com/services/...\`)

### 4. WhatsApp Setup (via Twilio)

**Getting Twilio Credentials:**
1. Sign up at [twilio.com](https://www.twilio.com)
2. Go to the Console Dashboard
3. Find your Account SID and Auth Token
4. Copy both to your \`.env\` file as \`TWILIO_ACCOUNT_SID\` and \`TWILIO_AUTH_TOKEN\`

**Setting up WhatsApp:**
1. In Twilio Console, go to "Messaging" → "Try it out" → "Send a WhatsApp message"
2. Click "Get started with WhatsApp"
3. Follow the setup wizard to enable WhatsApp messaging
4. You'll get a Twilio WhatsApp number (e.g., +1234567890)
5. Copy this number to your \`.env\` file as \`TWILIO_WHATSAPP_NUMBER\`
6. Add your personal WhatsApp number to the sandbox (you'll receive a code to confirm)

**Important:** In sandbox mode, you can only send messages to numbers you've approved. To go live, you'll need to request WhatsApp Business Account approval from Twilio.

### 5. Start the Server

\`\`\`bash
npm start
\`\`\`

The app will be available at: http://localhost:3000

## Testing the Complete Flow

### Step 1: Initial Setup
1. Open http://localhost:3000
2. Enter your email address
3. Enter your Slack webhook URL (optional)
4. Enter your WhatsApp number (optional)
5. Click "Start Celebrating!"

### Step 2: Create and Complete Tasks
1. Add a new task with title and optional due date
2. Click "Add Task"
3. Mark the task as "Done"
4. Verify:
   - ✅ Confetti animation appears
   - ✅ "Done today" counter increases
   - ✅ Slack message is sent to your channel (if configured)
   - ✅ WhatsApp message is received (if configured)
   - ✅ Congratulatory email is received

### Step 3: Test Filters and Persistence
1. Create multiple tasks
2. Mark some as done
3. Test filters: All | Todo | Done
4. Refresh the page - data should persist
5. Test undo functionality

## API Endpoints

### POST /api/notify
Sends notifications when a task is completed.

**Request Body:**
\`\`\`json
{
  "text": "🎉 Completed: Your task title",
  "email": "your@email.com",
  "slackWebhook": "https://hooks.slack.com/services/...",
  "whatsappNumber": "+1234567890"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Notifications sent successfully!",
  "slackSent": true,
  "emailSent": true,
  "whatsappSent": true
}
\`\`\`

## Troubleshooting

### Email not sending?
- Check your Resend API key in \`.env\`
- Verify the API key has send permissions
- Check server console for error messages

### Slack notifications not working?
- Verify your webhook URL is correct
- Test the webhook URL with a simple curl command:
\`\`\`bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Test message"}' \
YOUR_WEBHOOK_URL
\`\`\`

### WhatsApp messages not sending?
- Verify \`TWILIO_ACCOUNT_SID\`, \`TWILIO_AUTH_TOKEN\`, and \`TWILIO_WHATSAPP_NUMBER\` are in \`.env\`
- Ensure your personal WhatsApp number is approved in Twilio sandbox
- Check that the phone number format is correct (include country code, e.g., +1234567890)
- Check server console for Twilio error messages
- In sandbox mode, you can only send to approved numbers

### Confetti not showing?
- Check browser console for JavaScript errors
- Ensure canvas-confetti CDN is loading properly

## File Structure

\`\`\`
micro-celebrator/
├── public/
│   ├── index.html      # Main HTML file
│   ├── style.css       # Dark theme styles
│   └── script.js       # Frontend JavaScript
├── server.js           # Express server
├── package.json        # Dependencies
├── .env               # Environment variables (create this)
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
└── README.md          # This file
\`\`\`

## Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express
- **Animations:** canvas-confetti
- **Email:** Resend API
- **Notifications:** Slack Webhooks
- **WhatsApp:** Twilio API
- **Storage:** LocalStorage

## License

MIT License - feel free to use this for your own celebration needs!
