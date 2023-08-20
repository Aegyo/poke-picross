import { LitElement, PropertyValueMap, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

type Puzzle = {
  name: string;
  type: string;
  matrix: number[][];
};

@customElement("picross-board")
export class PicrossBoard extends LitElement {
  @property() puzzle?: Puzzle;

  private alpha?: number[][];
  private rowHints?: number[][];
  private columnHints?: number[][];

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (_changedProperties.has("puzzle")) {
      const matrix = this.puzzle?.matrix;
      this.alpha = matrix?.map((row) =>
        row.map(() => Math.random() * 0.4 + 0.1),
      );

      this.rowHints = PicrossBoard.createHints(matrix);
      const transposed = matrix?.[0].map((col, i) =>
        matrix.map((row) => row[i]),
      );
      this.columnHints = PicrossBoard.createHints(transposed);
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

  private renderRowHints() {
    return html`
      <div class="rowHints">
        ${this.rowHints?.map(
          (row, idx) =>
            html`<div
              style="background: rgba(255, 255, 255, ${this.alpha?.[idx][0]})"
            >
              ${row.map((hint) => html`<span>${hint}</span>`)}
            </div>`,
        )}
      </div>
    `;
  }

  private renderColumnHints() {
    return html`
      <div class="columnHints">
        ${this.columnHints?.map(
          (row, idx) =>
            html`<div
              style="background: rgba(255, 255, 255, ${this.alpha?.[0][idx]})"
            >
              ${row.map((hint) => html`<span>${hint}</span>`)}
            </div>`,
        )}
      </div>
    `;
  }

  render() {
    console.log(this.puzzle);
    return html` <style>
        .board {
          --rows: ${this.puzzle?.matrix.length};
          --cols: ${this.puzzle?.matrix[0].length};
        }
      </style>
      ${this.renderRowHints()} ${this.renderColumnHints()}
      <div class="board">
        ${this.puzzle?.matrix.map((row, y) =>
          row.map(
            (cell, x) =>
              html`<div
                class="square"
                style="background: ${cell
                  ? "black"
                  : `rgba(255, 255, 255, ${this.alpha?.[y][x]})`}"
              ></div>`,
          ),
        )}
      </div>`;
  }

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: 1fr auto 1fr;
    }
    .board {
      grid-column: 2;
      grid-row: 2;

      display: grid;
      grid-template-columns: repeat(var(--cols), 20px);
      grid-template-rows: repeat(var(--rows), 20px);
      gap: 1px;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "picross-board": PicrossBoard;
  }
}
