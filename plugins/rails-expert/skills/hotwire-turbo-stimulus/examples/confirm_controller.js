// Confirm Dialog Controller
//
// app/javascript/controllers/confirm_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { message: String }

  confirm(event) {
    if (!window.confirm(this.messageValue)) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }
}

// Usage:
// <%= button_to "Delete",
//               product_path(@product),
//               method: :delete,
//               data: {
//                 controller: "confirm",
//                 confirm_message_value: "Are you sure?",
//                 action: "confirm#confirm"
//               } %>
