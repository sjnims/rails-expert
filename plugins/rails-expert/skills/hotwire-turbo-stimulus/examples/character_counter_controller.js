// Form Character Counter Controller with Limit
//
// app/javascript/controllers/character_counter_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "count", "remaining"]
  static values = { max: Number }
  static classes = ["warning", "danger"]

  update() {
    const length = this.inputTarget.value.length
    const remaining = this.maxValue - length

    this.countTarget.textContent = length
    this.remainingTarget.textContent = remaining

    // Color coding
    if (remaining < 0) {
      this.remainingTarget.classList.add(this.dangerClass)
      this.remainingTarget.classList.remove(this.warningClass)
    } else if (remaining < 20) {
      this.remainingTarget.classList.add(this.warningClass)
      this.remainingTarget.classList.remove(this.dangerClass)
    } else {
      this.remainingTarget.classList.remove(this.warningClass, this.dangerClass)
    }

    // Disable submit if over limit
    const submitButton = this.element.querySelector('[type="submit"]')
    if (submitButton) {
      submitButton.disabled = remaining < 0
    }
  }
}

// Usage:
// <div data-controller="character-counter"
//      data-character-counter-max-value="280"
//      data-character-counter-warning-class="text-yellow-500"
//      data-character-counter-danger-class="text-red-500">
//   <textarea data-character-counter-target="input"
//             data-action="input->character-counter#update"></textarea>
//   <span data-character-counter-target="count">0</span> /
//   <span data-character-counter-target="remaining">280</span> remaining
// </div>
