import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("picross-hint")
export class PicrossHint extends LitElement {
  @property() length?: number;
  @state() marked = false;

  render() {
    return html`<span
      @pointerdown=${() => (this.marked = !this.marked)}
      class="${this.marked && "marked"}"
      >${this.length}</span
    >`;
  }

  static styles = css`
    span {
      cursor: pointer;
      user-select: none;
      display: block;
      height: 100%;
      width: 100%;
    }

    span.marked {
      opacity: 0.4;
      text-decoration: line-through;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-hint": PicrossHint;
  }
}
