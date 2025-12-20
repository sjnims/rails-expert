// Auto-Save Form Controller
//
// app/javascript/controllers/autosave_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]
  static values = {
    url: String,
    delay: { type: Number, default: 1000 }
  }

  connect() {
    this.timeout = null
  }

  save() {
    clearTimeout(this.timeout)

    this.showStatus("Waiting...")

    this.timeout = setTimeout(() => {
      this.performSave()
    }, this.delayValue)
  }

  async performSave() {
    this.showStatus("Saving...")

    const formData = new FormData(this.element)

    try {
      const response = await fetch(this.urlValue, {
        method: "PATCH",
        body: formData,
        headers: {
          "X-CSRF-Token": this.csrfToken,
          "Accept": "text/vnd.turbo-stream.html"
        }
      })

      if (response.ok) {
        this.showStatus("Saved!", "success")
      } else {
        this.showStatus("Error saving", "error")
      }
    } catch (error) {
      this.showStatus("Network error", "error")
    }
  }

  showStatus(message, type = "info") {
    if (this.hasStatusTarget) {
      this.statusTarget.textContent = message
      this.statusTarget.className = `status-${type}`

      if (type === "success") {
        setTimeout(() => {
          this.statusTarget.textContent = ""
        }, 2000)
      }
    }
  }

  get csrfToken() {
    return document.querySelector("[name='csrf-token']").content
  }

  disconnect() {
    clearTimeout(this.timeout)
  }
}

// Usage:
// <%= form_with model: @product,
//               data: {
//                 controller: "autosave",
//                 autosave_url_value: product_path(@product),
//                 action: "input->autosave#save"
//               } do |f| %>
//   <%= f.text_field :name %>
//   <span data-autosave-target="status"></span>
// <% end %>
