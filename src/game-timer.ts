import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("game-timer")
export class GameTimer extends LitElement {
  @property({ type: Number }) startTime?: number;
  @property({ type: Number }) endTime?: number;
  @property({ type: Number }) bestTime?: number;

  private intervalID?: number;

  connectedCallback(): void {
    super.connectedCallback();

    this.intervalID = setInterval(() => {
      if (this.startTime && !this.endTime) {
        this.requestUpdate();
      }
    }, 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    clearInterval(this.intervalID);
  }

  padTime(num: number, decimals = 0) {
    const fixed = num.toFixed(decimals);
    return `${fixed.split(".")[0].length < 2 ? "0" : ""}${fixed}`;
  }
  renderTime(start: number, end: number, decimals = 0, text = "") {
    const totalSeconds = (end - start) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return html`<p>
      ${text} ${this.padTime(minutes)}:${this.padTime(seconds, decimals)}
    </p>`;
  }
  renderBestTime() {
    if (this.bestTime) {
      return this.renderTime(0, this.bestTime, 2, "Best time: ");
    }
  }

  render() {
    if (!this.startTime) return this.renderBestTime();
    return html`${this.endTime
      ? html`${this.renderTime(this.startTime, this.endTime, 2)}
          <p>Solved!</p>`
      : this.renderTime(this.startTime, Date.now())}
    ${this.renderBestTime()}`;
  }

  static styles = css`
    p {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "game-timer": GameTimer;
  }
}
