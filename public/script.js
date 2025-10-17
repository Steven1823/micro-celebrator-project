class MicroCelebrator {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || []
    this.userEmail = localStorage.getItem("userEmail") || ""
    this.slackWebhook = localStorage.getItem("slackWebhook") || ""
    this.whatsappNumber = localStorage.getItem("whatsappNumber") || ""
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

    if (this.userEmail) {
      setupForm.style.display = "none"
      mainApp.style.display = "block"
    } else {
      setupForm.style.display = "block"
      mainApp.style.display = "none"
    }
  }

  bindEvents() {
    document.getElementById("userSetupForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleSetup()
    })

    document.getElementById("taskForm").addEventListener("submit", (e) => {
      e.preventDefault()
      this.addTask()
    })

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.setFilter(e.target.dataset.filter)
      })
    })
  }

  handleSetup() {
    const email = document.getElementById("userEmail").value.trim()
    const webhook = document.getElementById("slackWebhook").value.trim()
    const whatsapp = document.getElementById("whatsappNumber").value.trim()

    if (!email) {
      alert("Please fill in your email address")
      return
    }

    this.userEmail = email
    this.slackWebhook = webhook
    this.whatsappNumber = whatsapp

    localStorage.setItem("userEmail", email)
    localStorage.setItem("slackWebhook", webhook)
    localStorage.setItem("whatsappNumber", whatsapp)

    this.checkSetup()
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
          email: this.userEmail,
          slackWebhook: this.slackWebhook,
          whatsappNumber: this.whatsappNumber,
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

const app = new MicroCelebrator()
