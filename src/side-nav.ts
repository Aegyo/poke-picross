import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import menu from "./assets/menu.svg";
import close from "./assets/close.svg";

@customElement("side-nav")
export class SideNav extends LitElement {
  @property() open = false;

  toggleNav() {
    this.open = !this.open;
  }

  render() {
    return html`<div id="menu-wrapper" class="${this.open ? "open" : "closed"}">
      <ul class="menu-items">
        <slot></slot>
      </ul>
      <button class="toggle-nav" @click=${this.toggleNav}>
        <img src="${this.open ? close : menu}" width="14" />
      </button>
    </div>`;
  }

  static styles = css`
    #menu-wrapper {
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      transition: transform 0.4s ease-in-out;
      z-index: 100;
    }

    #menu-wrapper.closed {
      transform: translateX(-250px);
    }

    .menu-items {
      height: 100%;
      width: 250px;
      overflow-y: scroll;
      float: left;
      margin-top: 0;
      padding-top: 16px;
      background: rgba(255, 255, 255, 0.5);
    }

    .toggle-nav {
      float: left;
      width: 26px;
      margin-left: 4px;
    }

    .toggle-nav > img {
      margin-top: 4px;
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
