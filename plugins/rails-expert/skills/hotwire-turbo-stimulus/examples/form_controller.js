// Form Submission Controller with Loading State
//
// app/javascript/controllers/form_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submit"]

  submit(event) {
    this.disableSubmit()
  }

  // Turbo event listeners
  connect() {
    this.element.addEventListener("turbo:submit-start", this.disableSubmit.bind(this))
    this.element.addEventListener("turbo:submit-end", this.enableSubmit.bind(this))
  }

  disableSubmit() {
    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = true
      this.originalText = this.submitTarget.textContent
      this.submitTarget.textContent = "Submitting..."
    }
  }

  enableSubmit() {
    if (this.hasSubmitTarget) {
      this.submitTarget.disabled = false
      this.submitTarget.textContent = this.originalText
    }
  }
}

// Usage:
// <%= form_with model: @product, data: { controller: "form" } do |f| %>
//   <%= f.text_field :name %>
//   <%= f.submit data: { form_target: "submit" } %>
// <% end %>
