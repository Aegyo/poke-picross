import { LitElement, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import close from "./assets/close.svg";

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

  constructor() {
    super();
    this.addEventListener("custom.swipedOver", (e) =>
      this.changeState((e as CustomEvent).detail.changeTo),
    );
  }
  cycleState(forward = true) {
    if (this.completed) return;

    const state = forward ? next[this.state] : prev[this.state];
    this.changeState(state);
  }

  changeState(state: CellState) {
    this.state = state;
    this.onChange?.(this.state);
  }

  pointerDown(e: PointerEvent) {
    this.cycleState(e.buttons !== 2);
    this.dispatchEvent(
      new CustomEvent("puzzle.clicked", { bubbles: true, detail: this.state }),
    );
  }

  render() {
    let background;
    let content;
    const transparent = `rgba(255, 255, 255, ${this.alpha})`;
    switch (this.state) {
      case CellState.empty:
        background = transparent;
        break;

      case CellState.checked:
        background = "black";
        break;

      case CellState.crossed:
        background = transparent;
        content = this.completed ? null : html`<div class="cross"></div>`;
        break;
    }
    return html`<div
      @pointerdown=${this.pointerDown}
      @contextmenu=${(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      class="square"
      style="background: ${background};"
    >
      ${content}
    </div>`;
  }

  static styles = css`
    div {
      width: 100%;
      height: 100%;
      touch-action: none;
    }

    .cross {
      background-color: rgba(0, 0, 0, 0.6);
      mask-image: url(${unsafeCSS(close)});
      -webkit-mask-image: url(${unsafeCSS(close)});
      mask-size: 100% 100%;
      -webkit-mask-size: 100% 100%;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-cell": PicrossCell;
  }
}
