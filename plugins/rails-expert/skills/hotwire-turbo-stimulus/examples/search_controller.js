// Live Search Controller with Debounce
//
// app/javascript/controllers/search_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]
  static values = { url: String }

  search() {
    clearTimeout(this.timeout)

    const query = this.inputTarget.value

    if (query.length < 2) {
      this.clearResults()
      return
    }

    this.timeout = setTimeout(() => {
      this.performSearch(query)
    }, 300)  // Debounce 300ms
  }

  async performSearch(query) {
    const url = new URL(this.urlValue, window.location.origin)
    url.searchParams.append("q", query)

    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "text/html",
          "X-Requested-With": "XMLHttpRequest"
        }
      })

      const html = await response.text()
      this.resultsTarget.innerHTML = html
    } catch (error) {
      console.error("Search failed:", error)
    }
  }

  clearResults() {
    this.resultsTarget.innerHTML = ""
  }

  disconnect() {
    clearTimeout(this.timeout)
  }
}

// Usage:
// <div data-controller="search" data-search-url-value="<%= search_products_path %>">
//   <input type="search" data-search-target="input" data-action="input->search#search">
//   <div data-search-target="results"></div>
// </div>
