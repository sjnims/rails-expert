// Nested Form Controller (Dynamic Fields)
//
// app/javascript/controllers/nested_form_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "template"]

  add(event) {
    event.preventDefault()

    const content = this.templateTarget.innerHTML.replace(/NEW_RECORD/g, new Date().getTime())
    this.containerTarget.insertAdjacentHTML("beforeend", content)
  }

  remove(event) {
    event.preventDefault()

    const item = event.target.closest(".nested-fields")

    // Mark for destruction if persisted
    const destroyInput = item.querySelector("input[name*='_destroy']")
    if (destroyInput) {
      destroyInput.value = "1"
      item.style.display = "none"
    } else {
      item.remove()
    }
  }
}

// Usage:
// <div data-controller="nested-form">
//   <div data-nested-form-target="container">
//     <%= f.fields_for :line_items do |ff| %>
//       <div class="nested-fields">
//         <%= ff.text_field :product_id %>
//         <%= ff.number_field :quantity %>
//         <%= ff.hidden_field :_destroy %>
//         <button data-action="nested-form#remove">Remove</button>
//       </div>
//     <% end %>
//   </div>
//
//   <template data-nested-form-target="template">
//     <div class="nested-fields">
//       <input name="order[line_items_attributes][NEW_RECORD][product_id]">
//       <input name="order[line_items_attributes][NEW_RECORD][quantity]">
//       <button data-action="nested-form#remove">Remove</button>
//     </div>
//   </template>
//
//   <button data-action="nested-form#add">Add Line Item</button>
// </div>
