// Slideshow/Carousel Controller
//
// app/javascript/controllers/slideshow_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slide"]
  static values = {
    index: { type: Number, default: 0 },
    autoplay: { type: Boolean, default: false },
    interval: { type: Number, default: 5000 }
  }

  connect() {
    this.showSlide()

    if (this.autoplayValue) {
      this.startAutoplay()
    }
  }

  next() {
    this.indexValue = (this.indexValue + 1) % this.slideTargets.length
  }

  previous() {
    this.indexValue = (this.indexValue - 1 + this.slideTargets.length) % this.slideTargets.length
  }

  showSlide() {
    this.slideTargets.forEach((slide, index) => {
      slide.classList.toggle("hidden", index !== this.indexValue)
    })
  }

  indexValueChanged() {
    this.showSlide()
  }

  startAutoplay() {
    this.autoplayTimer = setInterval(() => {
      this.next()
    }, this.intervalValue)
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
    }
  }

  disconnect() {
    this.stopAutoplay()
  }
}

// Usage:
// <div data-controller="slideshow"
//      data-slideshow-autoplay-value="true"
//      data-slideshow-interval-value="3000">
//   <button data-action="slideshow#previous">Previous</button>
//   <div data-slideshow-target="slide">Slide 1</div>
//   <div data-slideshow-target="slide" class="hidden">Slide 2</div>
//   <div data-slideshow-target="slide" class="hidden">Slide 3</div>
//   <button data-action="slideshow#next">Next</button>
// </div>
