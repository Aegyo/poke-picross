import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("game-timer")
export class GameTimer extends LitElement {
  @property({ type: Number }) startTime?: number;
  @property({ type: Number }) endTime?: number;

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
  renderTime(start: number, end: number, decimals = 0) {
    const totalSeconds = (end - start) / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return html`<p>
      ${this.padTime(minutes)}:${this.padTime(seconds, decimals)}
    </p>`;
  }

  render() {
    if (!this.startTime) return;
    return this.endTime
      ? html`${this.renderTime(this.startTime, this.endTime, 2)}
          <p>Solved!</p>`
      : html`${this.renderTime(this.startTime, Date.now())}`;
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
