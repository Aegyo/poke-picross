import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("side-nav")
export class SideNav extends LitElement {
  render() {
    return html`<div>
      <ul>
        <slot></slot>
      </ul>
    </div>`;
  }

  static styles = css`
    :host {
      height: 100vh;
      width: 250px;
      position: absolute;
      top: 0;
      left: 0;
      overflow-y: scroll;
    }

    ul {
      list-style: none;
      padding: 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "side-nav": SideNav;
  }
}
