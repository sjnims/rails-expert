// Tabs Controller
//
// app/javascript/controllers/tabs_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["tab", "panel"]
  static classes = ["active", "inactive"]
  static values = { index: { type: Number, default: 0 } }

  connect() {
    this.showTab(this.indexValue)
  }

  select(event) {
    const index = this.tabTargets.indexOf(event.currentTarget)
    this.showTab(index)
  }

  showTab(index) {
    this.indexValue = index

    // Update tabs
    this.tabTargets.forEach((tab, i) => {
      tab.classList.toggle(this.activeClass, i === index)
      tab.classList.toggle(this.inactiveClass, i !== index)
    })

    // Update panels
    this.panelTargets.forEach((panel, i) => {
      panel.classList.toggle("hidden", i !== index)
    })
  }

  indexValueChanged(value, previousValue) {
    // Optionally update URL
    const url = new URL(window.location)
    url.searchParams.set("tab", value)
    history.replaceState({}, "", url)
  }
}

// Usage:
// <div data-controller="tabs"
//      data-tabs-active-class="border-blue-500"
//      data-tabs-inactive-class="border-gray-200">
//   <div class="tabs">
//     <button data-tabs-target="tab" data-action="tabs#select">Tab 1</button>
//     <button data-tabs-target="tab" data-action="tabs#select">Tab 2</button>
//   </div>
//   <div data-tabs-target="panel">Content 1</div>
//   <div data-tabs-target="panel" class="hidden">Content 2</div>
// </div>
