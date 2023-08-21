import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

export enum CellState {
  empty = "empty",
  checked = "checked",
  crossed = "crossed",
}

const next: Record<CellState, CellState> = {
  [CellState.empty]: CellState.checked,
  [CellState.checked]: CellState.crossed,
  [CellState.crossed]: CellState.empty,
};

const prev = Object.entries(next).reduce(
  (obj, [from, to]) => Object.assign(obj, { [to]: from }),
  {},
) as Record<CellState, CellState>;
@customElement("picross-cell")
export class PicrossCell extends LitElement {
  @property() state = CellState.empty;
  @property() alpha = 0;
  @property() onChange?: (state: CellState) => void;
  @property({ type: Boolean }) completed = false;

  cycleState(forward = true) {
    if (this.completed) return;

    this.state = forward ? next[this.state] : prev[this.state];
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
          this.cycleState(e.buttons !== 2);
        }
      }}
      @pointerenter=${(e: PointerEvent) => {
        if (e.buttons) {
          this.cycleState(e.buttons !== 2);
        }
      }}
      @contextmenu=${(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
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
