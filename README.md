# 🎉 Micro-Milestone Celebrator

A fullstack application that celebrates your small wins with confetti animations, Slack notifications, and congratulatory emails!

## Features

- ✨ Dark-themed task management interface
- 🎊 Confetti animations on task completion
- 📧 Congratulatory emails via Resend API
- 💬 Slack notifications via webhooks
- 📱 Mobile-responsive design
- 💾 Local storage for persistence

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Setup

Create a `.env` file in the root directory:

\`\`\`bash
EMAIL_API_KEY=your_resend_api_key_here
\`\`\`

**Getting your Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy it to your `.env` file

### 3. Slack Webhook Setup

**Getting your Slack Webhook URL:**
1. Go to your Slack workspace
2. Visit [api.slack.com/apps](https://api.slack.com/apps)
3. Click "Create New App" → "From scratch"
4. Name your app and select your workspace
5. Go to "Incoming Webhooks" → Toggle "On"
6. Click "Add New Webhook to Workspace"
7. Select a channel and authorize
8. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

### 4. Start the Server

\`\`\`bash
npm start
\`\`\`

The app will be available at: http://localhost:3000

## Testing the Complete Flow

### Step 1: Initial Setup
1. Open http://localhost:3000
2. Enter your email address
3. Enter your Slack webhook URL
4. Click "Start Celebrating!"

### Step 2: Create and Complete Tasks
1. Add a new task with title and optional due date
2. Click "Add Task"
3. Mark the task as "Done"
4. Verify:
   - ✅ Confetti animation appears
   - ✅ "Done today" counter increases
   - ✅ Slack message is sent to your channel
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
  "slackWebhook": "https://hooks.slack.com/services/..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Notifications sent successfully!",
  "slackSent": true,
  "emailSent": true
}
\`\`\`

## Troubleshooting

### Email not sending?
- Check your Resend API key in `.env`
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
- **Storage:** LocalStorage

## License

MIT License - feel free to use this for your own celebration needs!
