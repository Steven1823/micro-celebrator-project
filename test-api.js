// Simple API test script
// Run with: node test-api.js

const testNotificationAPI = async () => {
  console.log("🧪 Testing Micro Celebrator API...\n")

  // Test data
  const testData = {
    text: "🎉 Completed: Test Task from API Test",
    email: "test@example.com",
    slackWebhook: "https://hooks.slack.com/services/TEST/TEST/TEST",
  }

  try {
    console.log("📡 Sending test notification...")

    const response = await fetch("http://localhost:3000/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    console.log("📊 Response Status:", response.status)
    console.log("📋 Response Body:", JSON.stringify(result, null, 2))

    if (response.ok) {
      console.log("\n✅ API test completed successfully!")
      console.log("📧 Email sent:", result.emailSent ? "✅" : "❌")
      console.log("💬 Slack sent:", result.slackSent ? "✅" : "❌")
    } else {
      console.log("\n❌ API test failed!")
      console.log("Error:", result.error)
    }
  } catch (error) {
    console.error("\n💥 Test failed with error:")
    console.error(error.message)
    console.log("\n🔍 Make sure the server is running on http://localhost:3000")
  }
}

// Check if server is running first
const checkServer = async () => {
  try {
    const response = await fetch("http://localhost:3000")
    if (response.ok) {
      console.log("🚀 Server is running!")
      await testNotificationAPI()
    }
  } catch (error) {
    console.log("❌ Server is not running!")
    console.log("Please start the server with: npm start")
  }
}

checkServer()
