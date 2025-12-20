// Infinite Scroll Controller
//
// app/javascript/controllers/infinite_scroll_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["entries", "pagination"]
  static values = { page: Number }

  scroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    // Near bottom?
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      this.loadMore()
    }
  }

  async loadMore() {
    if (this.loading) return

    this.loading = true
    this.pageValue += 1

    const url = new URL(window.location)
    url.searchParams.set("page", this.pageValue)

    try {
      const response = await fetch(url, {
        headers: { "Accept": "text/html" }
      })

      const html = await response.text()
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      const newEntries = doc.querySelector("#entries").innerHTML
      this.entriesTarget.insertAdjacentHTML("beforeend", newEntries)

      // Hide pagination if no more results
      if (!newEntries.trim()) {
        this.paginationTarget.remove()
      }
    } finally {
      this.loading = false
    }
  }
}

// Usage:
// <div data-controller="infinite-scroll"
//      data-infinite-scroll-page-value="1"
//      data-action="scroll@window->infinite-scroll#scroll:throttle(200)">
//   <div id="entries" data-infinite-scroll-target="entries">
//     <%= render @products %>
//   </div>
//   <div data-infinite-scroll-target="pagination">Loading more...</div>
// </div>
