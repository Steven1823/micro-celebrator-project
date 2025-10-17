class RealBizDigital {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || []
    this.companyName = localStorage.getItem("companyName") || ""
    this.userName = localStorage.getItem("userName") || ""
    this.userEmail = localStorage.getItem("userEmail") || ""
    this.slackWebhook = localStorage.getItem("slackWebhook") || ""
    this.whatsappNumber = localStorage.getItem("whatsappNumber") || ""
    this.teamMembers = JSON.parse(localStorage.getItem("teamMembers")) || []
    this.currentFilter = "all"

    this.init()
  }

  init() {
    this.bindEvents()
    this.checkSetup()
    this.renderTasks()
    this.updateStats()
  }

  checkSetup() {
    const setupForm = document.getElementById("setupForm")
    const mainApp = document.getElementById("mainApp")
    const userProfile = document.getElementById("userProfile")

    if (this.userEmail) {
      setupForm.style.display = "none"
      mainApp.style.display = "block"
      userProfile.style.display = "flex"
      document.getElementById("companyName").textContent = `${this.companyName} -`
      document.getElementById("userName").textContent = `Welcome, ${this.userName}!`
    } else {
      setupForm.style.display = "block"
      mainApp.style.display = "none"
      userProfile.style.display = "none"
    }
  }

  bindEvents() {
    document.getElementById("userSetupForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSetup()
    })

    document.getElementById("logoutBtn").addEventListener("click", () => {
      this.logout()
    })

    document.getElementById("taskForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.addTask()
    })

    document.getElementById("addTeamMemberBtn").addEventListener("click", (e) => {
      e.preventDefault()
      this.addTeamMemberInput()
    })

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.filter)
      })
    })
  }

  addTeamMemberInput() {
    const container = document.getElementById("teamMembersContainer")
    const newMember = document.createElement("div")
    newMember.className = "team-member-input"
    newMember.innerHTML = `
      <input type="text" class="team-member-name" placeholder="Team member name">
      <input type="tel" class="team-member-whatsapp" placeholder="+1234567890">
      <button type="button" class="btn btn-small btn-remove-member">Remove</button>
    `

    newMember.querySelector(".btn-remove-member").addEventListener("click", (e) => {
      e.preventDefault()
      newMember.remove()
    })

    container.appendChild(newMember)
  }

  handleSetup() {
    const companyName = document.getElementById("companyName").value.trim()
    const name = document.getElementById("userName").value.trim()
    const email = document.getElementById("userEmail").value.trim()
    const webhook = document.getElementById("slackWebhook").value.trim()
    const whatsapp = document.getElementById("whatsappNumber").value.trim()

    if (!companyName || !name || !email || !whatsapp) {
      alert("Please fill in company name, your name, email, and WhatsApp number")
      return
    }

    const teamMembers = []
    document.querySelectorAll(".team-member-input").forEach((input) => {
      const memberName = input.querySelector(".team-member-name").value.trim()
      const memberWhatsapp = input.querySelector(".team-member-whatsapp").value.trim()
      if (memberName && memberWhatsapp) {
        teamMembers.push({ name: memberName, whatsapp: memberWhatsapp })
      }
    })

    this.companyName = companyName
    this.userName = name
    this.userEmail = email
    this.slackWebhook = webhook
    this.whatsappNumber = whatsapp
    this.teamMembers = teamMembers

    localStorage.setItem("companyName", companyName)
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)
    localStorage.setItem("slackWebhook", webhook)
    localStorage.setItem("whatsappNumber", whatsapp)
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers))

    this.checkSetup()
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("companyName")
      localStorage.removeItem("userName")
      localStorage.removeItem("userEmail")
      localStorage.removeItem("slackWebhook")
      localStorage.removeItem("whatsappNumber")
      localStorage.removeItem("teamMembers")

      this.companyName = ""
      this.userName = ""
      this.userEmail = ""
      this.slackWebhook = ""
      this.whatsappNumber = ""
      this.teamMembers = []

      document.getElementById("userSetupForm").reset()
      this.checkSetup()
    }
  }

  addTask() {
    const title = document.getElementById("taskTitle").value.trim()
    const dueDate = document.getElementById("taskDueDate").value

    if (!title) return

    const task = {
      id: Date.now(),
      title,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }

    this.tasks.push(task)
    this.saveTasks()
    this.renderTasks()
    this.updateStats()

    document.getElementById("taskTitle").value = ""
    document.getElementById("taskDueDate").value = ""
  }

  async toggleTask(id) {
    const task = this.tasks.find((t) => t.id === id)
    if (!task) return

    task.completed = !task.completed
    task.completedAt = task.completed ? new Date().toISOString() : null

    if (task.completed) {
      this.celebrate(task)
      await this.sendNotification(task)
    }

    this.saveTasks()
    this.renderTasks()
    this.updateStats()
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((t) => t.id !== id)
    this.saveTasks()
    this.renderTasks()
    this.updateStats()
  }

  celebrate(task) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    setTimeout(() => {
      window.confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      })
      window.confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      })
    }, 200)
  }

  async sendNotification(task) {
    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `🎉 Completed: ${task.title}`,
          companyName: this.companyName,
          userName: this.userName,
          email: this.userEmail,
          slackWebhook: this.slackWebhook,
          whatsappNumber: this.whatsappNumber,
          teamMembers: this.teamMembers,
        }),
      })

      const result = await response.json()

      if (result.success) {
        console.log("Notifications sent successfully!")
      } else {
        console.error("Failed to send notifications:", result.error)
      }
    } catch (error) {
      console.error("Error sending notifications:", error)
    }
  }

  setFilter(filter) {
    this.currentFilter = filter

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter)
    })

    this.renderTasks()
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case "todo":
        return this.tasks.filter((t) => !t.completed)
      case "done":
        return this.tasks.filter((t) => t.completed)
      default:
        return this.tasks
    }
  }

  renderTasks() {
    const taskList = document.getElementById("taskList")
    const filteredTasks = this.getFilteredTasks()

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    ${
                      this.currentFilter === "todo"
                        ? "No pending tasks!"
                        : this.currentFilter === "done"
                          ? "No completed tasks yet!"
                          : "No tasks yet. Add one above!"
                    }
                </div>
            `
      return
    }

    taskList.innerHTML = filteredTasks
      .map(
        (task) => `
            <div class="task-item ${task.completed ? "done" : ""}">
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    ${task.dueDate ? `<div class="task-due">Due: ${new Date(task.dueDate).toLocaleDateString()}</div>` : ""}
                </div>
                <div class="task-actions">
                    ${
                      task.completed
                        ? `<button class="btn btn-small btn-undo" onclick="app.toggleTask(${task.id})">Undo</button>`
                        : `<button class="btn btn-small btn-done" onclick="app.toggleTask(${task.id})">Done</button>`
                    }
                    <button class="btn btn-small btn-delete" onclick="app.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `,
      )
      .join("")
  }

  updateStats() {
    const today = new Date().toDateString()
    const doneToday = this.tasks.filter(
      (task) => task.completed && task.completedAt && new Date(task.completedAt).toDateString() === today,
    ).length

    document.getElementById("doneToday").textContent = `Done today: ${doneToday}`
  }

  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks))
  }
}

const app = new RealBizDigital()
