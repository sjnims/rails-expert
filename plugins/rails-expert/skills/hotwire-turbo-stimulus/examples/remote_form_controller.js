// Ajax Form Submission Controller
//
// app/javascript/controllers/remote_form_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submit", "errors"]
  static values = { url: String }

  async submit(event) {
    event.preventDefault()

    const formData = new FormData(this.element)
    this.disableSubmit()
    this.clearErrors()

    try {
      const response = await fetch(this.urlValue, {
        method: this.element.method,
        body: formData,
        headers: {
          "X-CSRF-Token": this.csrfToken,
          "Accept": "application/json"
        }
      })

      const data = await response.json()

      if (response.ok) {
        this.handleSuccess(data)
      } else {
        this.handleErrors(data.errors)
      }
    } catch (error) {
      this.handleError(error)
    } finally {
      this.enableSubmit()
    }
  }

  handleSuccess(data) {
    // Reset form or redirect
    this.element.reset()
    this.dispatch("success", { detail: data })
  }

  handleErrors(errors) {
    if (this.hasErrorsTarget) {
      const html = Object.entries(errors)
        .map(([field, messages]) => `<li>${field}: ${messages.join(", ")}</li>`)
        .join("")
      this.errorsTarget.innerHTML = `<ul>${html}</ul>`
    }
  }

  handleError(error) {
    console.error("Form submission failed:", error)
    alert("An error occurred. Please try again.")
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

  clearErrors() {
    if (this.hasErrorsTarget) {
      this.errorsTarget.innerHTML = ""
    }
  }

  get csrfToken() {
    return document.querySelector("[name='csrf-token']").content
  }
}

// Usage:
// <%= form_with url: products_path,
//               data: {
//                 controller: "remote-form",
//                 remote_form_url_value: products_path,
//                 action: "submit->remote-form#submit"
//               } do |f| %>
//   <div data-remote-form-target="errors"></div>
//   <%= f.text_field :name %>
//   <%= f.submit data: { remote_form_target: "submit" } %>
// <% end %>
