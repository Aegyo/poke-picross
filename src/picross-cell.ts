import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export enum CellState {
  empty = "empty",
  checked = "checked",
  crossed = "crossed",
}

const lastMovedThrough = null;
function handlePointerMove(e: PointerEvent, cell: PicrossCell) {
  console.log(e, cell);
}

@customElement("picross-cell")
export class PicrossCell extends LitElement {
  @property() state = CellState.empty;
  @property() alpha = 0;
  @property() onChange?: (state: CellState) => void;
  @property({ type: Boolean }) completed = false;

  click() {
    if (this.completed) return;

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
      @pointerdown=${(e: PointerEvent) => {
        if (e.pointerType !== "touch") {
          this.click();
        }
      }}
      @pointerenter=${(e: PointerEvent) => {
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
      touch-action: none;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-cell": PicrossCell;
  }
}
