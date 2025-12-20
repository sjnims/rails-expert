// Clipboard Copy Controller with Feedback
//
// app/javascript/controllers/clipboard_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["source", "button"]
  static values = {
    successMessage: { type: String, default: "Copied!" },
    successDuration: { type: Number, default: 2000 }
  }

  copy(event) {
    event.preventDefault()

    const text = this.sourceTarget.value || this.sourceTarget.textContent
    navigator.clipboard.writeText(text).then(() => {
      this.showSuccess()
    }).catch(() => {
      this.showError()
    })
  }

  showSuccess() {
    if (this.hasButtonTarget) {
      const originalText = this.buttonTarget.textContent
      this.buttonTarget.textContent = this.successMessageValue
      this.buttonTarget.classList.add("success")

      setTimeout(() => {
        this.buttonTarget.textContent = originalText
        this.buttonTarget.classList.remove("success")
      }, this.successDurationValue)
    }
  }

  showError() {
    if (this.hasButtonTarget) {
      this.buttonTarget.textContent = "Failed!"
      this.buttonTarget.classList.add("error")
    }
  }
}

// Usage:
// <div data-controller="clipboard">
//   <input type="text" data-clipboard-target="source" value="Text to copy">
//   <button data-clipboard-target="button" data-action="clipboard#copy">Copy</button>
// </div>
