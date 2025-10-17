const express = require("express")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// API route for notifications
app.post("/api/notify", async (req, res) => {
  const { text, email, slackWebhook, whatsappNumber } = req.body

  if (!text || !email) {
    return res.status(400).json({ error: "Missing required fields: text, email" })
  }

  try {
    let slackSent = false
    let emailSent = false
    let whatsappQueued = false

    // Send Slack notification (if webhook provided)
    if (slackWebhook) {
      const slackResponse = await fetch(slackWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      slackSent = slackResponse.ok
      if (!slackResponse.ok) {
        console.error("Slack notification failed:", slackResponse.statusText)
      }
    }

    // Send email notification
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Micro Celebrator <onboarding@resend.dev>",
        to: [email],
        subject: "Congratulations on completing your task!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4f46e5; text-align: center;">🎉 Congratulations!</h1>
            <p style="font-size: 18px; line-height: 1.6; color: #374151;">
              You've successfully completed a task and deserve to celebrate this micro-milestone!
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1f2937;">${text}</p>
            </div>
            <p style="color: #6b7280;">
              Keep up the great work! Every small step counts towards your bigger goals.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 14px; color: #9ca3af; text-align: center;">
              Sent with ❤️ from Micro Celebrator
            </p>
          </div>
        `,
      }),
    })

    emailSent = emailResponse.ok
    if (!emailResponse.ok) {
      console.error("Email notification failed:", emailResponse.statusText)
    }

    if (whatsappNumber) {
      console.log(`[WhatsApp Coming Soon] Would send to: ${whatsappNumber}`)
      whatsappQueued = true
    }

    res.json({
      success: true,
      message: "Notifications sent successfully!",
      slackSent,
      emailSent,
      whatsappQueued,
    })
  } catch (error) {
    console.error("Notification error:", error)
    res.status(500).json({ error: "Failed to send notifications" })
  }
})

app.listen(PORT, () => {
  console.log(`🎉 Micro Celebrator server running at http://localhost:${PORT}`)
})
