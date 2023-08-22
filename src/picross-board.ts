import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CellState } from "./picross-cell";
import { repeat } from "lit/directives/repeat.js";
import "./picross-cell";
import "./game-timer";
import { Puzzle } from "./my-app";

@customElement("picross-board")
export class PicrossBoard extends LitElement {
  @property() puzzle?: Puzzle;
  @property({ type: Number }) bestTime?: number;
  @property() bgColor?: string;

  private alpha?: number[][];
  private rowHints?: number[][];
  private columnHints?: number[][];
  private guesses?: number[][];
  @state() startTime?: number;
  @state() endTime?: number;

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (_changedProperties.has("puzzle")) {
      const matrix = this.puzzle?.matrix;
      this.alpha = matrix?.map((row) =>
        row.map(() => Math.random() * 0.4 + 0.1),
      );

      this.rowHints = PicrossBoard.createHints(matrix);
      const transposed = matrix?.[0].map((_, i) => matrix.map((row) => row[i]));
      this.columnHints = PicrossBoard.createHints(transposed);

      this.guesses = matrix?.map((row) => row.map(() => 0));

      this.startTime = undefined;
      this.endTime = undefined;
    }
  }

  onCellChange(x: number, y: number, val: CellState) {
    if (!this.guesses || !this.puzzle?.matrix) {
      return;
    }
    this.guesses[y][x] = Number(val === CellState.checked);

    if (!this.startTime) {
      this.startTime = Date.now();
    }

    if (
      this.guesses.every((row, y) =>
        row.every((cell, x) => cell === this.puzzle?.matrix[y][x]),
      )
    ) {
      this.endTime = Date.now();
      this.dispatchEvent(
        new CustomEvent("puzzle.solved", {
          detail: { time: this.endTime - this.startTime },
        }),
      );
    }
  }

  private static createHints(matrix?: number[][]) {
    return matrix?.map((row) => {
      let tmp = 0;
      let hints = [];
      for (const cell of row) {
        if (!cell && tmp) {
          hints.push(tmp);
          tmp = 0;
        } else if (cell) {
          tmp++;
        }
      }
      if (tmp) {
        hints.push(tmp);
      }
      return hints;
    });
  }

  movedOver = new Set();
  movingToState = CellState.empty;
  startedSwipe(e: CustomEvent<CellState>) {
    this.movedOver.clear();
    this.movedOver.add(e.target);
    this.movingToState = e.detail;
  }
  pointerMove(e: PointerEvent) {
    if (!e.buttons) return;

    const el = this.shadowRoot?.elementFromPoint(e.clientX, e.clientY);
    if (el && !this.movedOver.has(el)) {
      this.movedOver.add(el);
      if (this.movedOver.size > 0) {
        el.dispatchEvent(
          new CustomEvent("custom.swipedOver", {
            detail: { changeTo: this.movingToState },
          }),
        );
      }
    }
  }

  private renderRowHints() {
    return html`
      <div class="rowHints ${this.endTime && "hide-text"}">
        ${this.rowHints?.map(
          (row, idx) =>
            html`<div
              style="background: rgba(255, 255, 255, ${this.endTime
                ? 0
                : this.alpha?.[idx][0]})"
            >
              ${row.map((hint) => html`<span>${hint}</span>`)}
            </div>`,
        )}
      </div>
    `;
  }

  private renderColumnHints() {
    return html`
      <div class="columnHints ${this.endTime && "hide-text hide-background"}">
        ${this.columnHints?.map(
          (row, idx) =>
            html`<div
              style="background: rgba(255, 255, 255, ${this.endTime
                ? 0
                : this.alpha?.[0][idx]})"
            >
              ${row.map((hint) => html`<span>${hint}</span>`)}
            </div>`,
        )}
      </div>
    `;
  }

  render() {
    return html` <style>
        .board {
          --rows: ${this.puzzle?.matrix.length};
          --cols: ${this.puzzle?.matrix[0].length};
        }
        .guidelines {
          --rows: ${(this.puzzle?.matrix.length ?? 0) / 5};
          --cols: ${(this.puzzle?.matrix[0].length ?? 0) / 5};
          --bg: ${this.bgColor};
        }
      </style>
      ${this.renderRowHints()} ${this.renderColumnHints()}
      <div class="guidelines ${this.endTime && "hide-background"}">
        ${this.puzzle &&
        Array((this.puzzle?.matrix.length * this.puzzle?.matrix[0].length) / 25)
          .fill(null)
          .map(() => html`<div class="guideline-cell"></div>`)}
      </div>
      <div
        class="board"
        @pointermove=${this.pointerMove}
        @puzzle.clicked=${this.startedSwipe}
      >
        ${this.puzzle?.matrix.map((row, y) =>
          repeat(
            row,
            (_, x) => `${this.puzzle?.name}-${x}-${y}`,
            (_, x) =>
              html`<picross-cell
                ?completed=${this.endTime !== undefined}
                .onChange=${(state: CellState) =>
                  this.onCellChange(x, y, state)}
                .alpha=${this.alpha?.[y][x]}
              ></picross-cell>`,
          ),
        )}
      </div>
      <div id="puzzle-info">
        <p>
          ${this.puzzle?.name} -
          ${this.puzzle?.matrix[0].length}x${this.puzzle?.matrix.length}
        </p>
      </div>
      <game-timer
        startTime=${this.startTime}
        endTime=${this.endTime}
        bestTime=${this.bestTime}
      ></game-timer>`;
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: 1fr auto auto auto;
    }
    .guidelines {
      z-index: 1;

      grid-column: 2;
      grid-row: 2;

      display: grid;
      grid-template-columns: repeat(var(--cols), 104px);
      grid-template-rows: repeat(var(--rows), 104px);
      gap: 1px;

      background: white;
      opacity: 1;
    }
    .guidelines .guideline-cell {
      background: var(--bg);
      width: 100%;
      height: 100%;
    }
    .board {
      z-index: 2;

      grid-column: 2;
      grid-row: 2;

      display: grid;
      grid-template-columns: repeat(var(--cols), 20px);
      grid-template-rows: repeat(var(--rows), 20px);
      gap: 1px;

      touch-action: none;
    }
    #puzzle-info {
      grid-column: span 3;
      grid-row: 3;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
    }
    game-timer {
      grid-column: span 3;
      grid-row: 4;
    }

    .columnHints {
      grid-column: 2;
      grid-row: 1;

      display: flex;
      gap: 1px;
      margin-bottom: 3px;
    }
    .columnHints > div {
      display: flex;
      flex-direction: column;
      gap: 1px;
      width: 20px;
      text-align: center;
      justify-content: flex-end;
    }

    .rowHints {
      grid-column: 1;
      grid-row: 2;

      display: flex;
      flex-direction: column;
      gap: 1px;
      margin-right: 3px;
    }
    .rowHints > div {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      gap: 1px;
      height: 20px;
      width: 100%;
    }
    .rowHints > div > span {
      width: 20px;
      text-align: center;
      line-height: 25px;
    }

    .hide-text {
      color: transparent;
    }
    .hide-background {
      background: transparent;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-board": PicrossBoard;
  }
}
