// Modal Dialog Controller
//
// app/javascript/controllers/modal_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container"]

  open() {
    this.containerTarget.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")
  }

  close(event) {
    if (event) {
      event.preventDefault()
    }

    this.containerTarget.classList.add("hidden")
    document.body.classList.remove("overflow-hidden")
  }

  // Close on background click
  closeBackground(event) {
    if (event.target === this.containerTarget) {
      this.close()
    }
  }

  // Close on escape key
  closeWithKeyboard(event) {
    if (event.key === "Escape") {
      this.close()
    }
  }

  disconnect() {
    document.body.classList.remove("overflow-hidden")
  }
}

// Usage:
// <%= turbo_frame_tag "modal",
//                     data: {
//                       controller: "modal",
//                       action: "keyup@window->modal#closeWithKeyboard"
//                     } do %>
//   <div data-modal-target="container"
//        data-action="click->modal#closeBackground"
//        class="hidden">
//     <div class="modal-content">
//       <%= yield %>
//       <button data-action="modal#close">Close</button>
//     </div>
//   </div>
// <% end %>
