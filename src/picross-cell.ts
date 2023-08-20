import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export enum CellState {
  empty = "empty",
  checked = "checked",
  crossed = "crossed",
}

@customElement("picross-cell")
export class PicrossCell extends LitElement {
  @property() state = CellState.empty;
  @property() alpha = 0;
  @property() onChange?: (state: CellState) => void;

  click() {
    const next: Record<CellState, CellState> = {
      [CellState.empty]: CellState.checked,
      [CellState.checked]: CellState.crossed,
      [CellState.crossed]: CellState.empty,
    };

    this.state = next[this.state];
    this.onChange?.(this.state);
  }

  render() {
    let background;
    switch (this.state) {
      case CellState.empty:
        background = `rgba(255, 255, 255, ${this.alpha})`;
        break;

      case CellState.checked:
        background = "black";
        break;

      case CellState.crossed:
        background = "red";
        break;
    }
    return html`<div
      @mousedown=${this.click}
      @mouseover=${(e: MouseEvent) => {
        if (e.buttons) {
          this.click();
        }
      }}
      class="square"
      style="background: ${background}"
    ></div>`;
  }

  static styles = css`
    div {
      width: 100%;
      height: 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-cell": PicrossCell;
  }
}
