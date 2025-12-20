// Dropdown Menu Controller with Outside Click Detection
//
// app/javascript/controllers/dropdown_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  static classes = ["open", "closed"]

  toggle(event) {
    event.stopPropagation()

    if (this.menuTarget.classList.contains(this.openClass)) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.menuTarget.classList.remove(this.closedClass)
    this.menuTarget.classList.add(this.openClass)
  }

  close() {
    this.menuTarget.classList.remove(this.openClass)
    this.menuTarget.classList.add(this.closedClass)
  }

  // Close when clicking outside
  closeOnClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }
}

// Usage in ERB:
// <div data-controller="dropdown" data-action="click@window->dropdown#closeOnClickOutside">
//   <button data-action="dropdown#toggle">Menu</button>
//   <div data-dropdown-target="menu"
//        data-dropdown-class="open=block"
//        data-dropdown-class="closed=hidden"
//        class="hidden">
//     <a href="/products">Products</a>
//   </div>
// </div>
