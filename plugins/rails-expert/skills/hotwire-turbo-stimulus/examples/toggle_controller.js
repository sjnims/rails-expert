// Toggle Visibility Controller
//
// app/javascript/controllers/toggle_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggleable"]
  static classes = ["hidden"]

  toggle() {
    this.toggleableTargets.forEach(target => {
      target.classList.toggle(this.hiddenClass)
    })
  }

  show() {
    this.toggleableTargets.forEach(target => {
      target.classList.remove(this.hiddenClass)
    })
  }

  hide() {
    this.toggleableTargets.forEach(target => {
      target.classList.add(this.hiddenClass)
    })
  }
}

// Usage:
// <div data-controller="toggle" data-toggle-hidden-class="hidden">
//   <button data-action="toggle#toggle">Toggle Content</button>
//   <div data-toggle-target="toggleable">
//     This content can be toggled
//   </div>
// </div>
