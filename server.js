const express = require("express")
const path = require("path")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

const twilio = require("twilio")

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// API route for notifications
app.post("/api/notify", async (req, res) => {
  const { text, companyName, userName, email, slackWebhook, whatsappNumber, teamMembers } = req.body

  if (!text || !email || !whatsappNumber) {
    return res.status(400).json({ error: "Missing required fields: text, email, whatsappNumber" })
  }

  try {
    let slackSent = false
    let emailSent = false
    let whatsappSent = false
    let teamWhatsappSent = 0

    // Send Slack notification (if webhook provided)
    if (slackWebhook) {
      const slackResponse = await fetch(slackWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: `${companyName} - ${userName}: ${text}` }),
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
        from: "Real Biz Digital <onboarding@resend.dev>",
        to: [email],
        subject: `Congratulations on completing your task - ${companyName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4f46e5; text-align: center;">🎉 Congratulations, ${userName}!</h1>
            <p style="font-size: 18px; line-height: 1.6; color: #374151;">
              You've successfully completed a task and deserve to celebrate this micro-milestone!
            </p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold; color: #1f2937;">Company: ${companyName}</p>
              <p style="margin: 8px 0 0 0; font-weight: bold; color: #1f2937;">${text}</p>
            </div>
            <p style="color: #6b7280;">
              Keep up the great work! Every small step counts towards your bigger goals.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="font-size: 14px; color: #9ca3af; text-align: center;">
              Sent with ❤️ from Real Biz Digital
            </p>
          </div>
        `,
      }),
    })

    emailSent = emailResponse.ok
    if (!emailResponse.ok) {
      console.error("Email notification failed:", emailResponse.statusText)
    }

    if (whatsappNumber && twilioClient) {
      try {
        await twilioClient.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${whatsappNumber}`,
          body: `🎉 Congratulations, ${userName}! You've completed a task at ${companyName}:\n\n"${text}"\n\nKeep up the great work! Every small step counts towards your bigger goals.\n\n- Real Biz Digital`,
        })
        whatsappSent = true
        console.log(`WhatsApp message sent to ${whatsappNumber}`)
      } catch (error) {
        console.error("WhatsApp notification failed:", error.message)
      }
    }

    if (teamMembers && teamMembers.length > 0 && twilioClient) {
      for (const member of teamMembers) {
        try {
          await twilioClient.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${member.whatsapp}`,
            body: `🎉 Team Celebration! ${userName} from ${companyName} just completed a task:\n\n"${text}"\n\nLet's celebrate this milestone together!\n\n- Real Biz Digital`,
          })
          teamWhatsappSent++
          console.log(`WhatsApp message sent to team member ${member.name}`)
        } catch (error) {
          console.error(`WhatsApp notification to ${member.name} failed:`, error.message)
        }
      }
    }

    res.json({
      success: true,
      message: "Notifications sent successfully!",
      slackSent,
      emailSent,
      whatsappSent,
      teamWhatsappSent,
    })
  } catch (error) {
    console.error("Notification error:", error)
    res.status(500).json({ error: "Failed to send notifications" })
  }
})

app.listen(PORT, () => {
  console.log(`🎉 Real Biz Digital server running at http://localhost:${PORT}`)
})
