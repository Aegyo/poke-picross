import { LitElement, TemplateResult, css, html } from "lit";
import solutions from "./data/solutions.json";
import "./picross-board";
import { customElement, property } from "lit/decorators.js";
import "./side-nav";

const colors = {
  Bug: "#8cb521",
  Dark: "#4a6b84",
  Dragon: "#8c424a",
  Electric: "#b57b31",
  Fairy: "#d694ce",
  Fighting: "#b54a4a",
  Fire: "#b10818",
  Flying: "#218cb5",
  Ghost: "#605a72",
  Grass: "#4a944a",
  Ground: "#946b4a",
  Ice: "#42a59c",
  Normal: "#595c3b",
  Poison: "#7b42c6",
  Psychic: "#ce6363",
  Rock: "#a58c4a",
  Steel: "#737373",
  Water: "#294a94",
} as Record<string, string>;

export type PuzzleGroup = {
  name: string;
  groups?: PuzzleGroup[];
  levels?: Puzzle[];
};

export type Puzzle = {
  name: string;
  type: string;
  matrix: number[][];
};

const officialPuzzles: PuzzleGroup = solutions;

function getPuzzle(group: number, level: number) {
  return officialPuzzles.groups?.[group].levels?.[level];
}

@customElement("my-app")
export class MyApp extends LitElement {
  @property() area: number;
  @property() level: number;

  constructor() {
    super();
    const params = new URLSearchParams(window.location.search);
    this.area = Number(params.get("area") ?? 0);
    this.level = Number(params.get("level") ?? 0);
  }

  renderGroupNav(group: PuzzleGroup, groupIdx?: number): TemplateResult<1> {
    return html`<li class="group-header">${group.name}</li>
      ${group.groups?.map((subGroup, i) =>
        this.renderGroupNav(subGroup, i),
      )}${group.levels?.map((level, i) =>
        this.renderLevelNav(level, groupIdx ?? 0, i),
      )}`;
  }

  renderLevelNav(level: Puzzle, groupIdx: number, levelIdx: number) {
    return html`<li
      class="${this.area === groupIdx && this.level === levelIdx
        ? "selected"
        : ""}"
      @click=${() => {
        this.area = groupIdx;
        this.level = levelIdx;
      }}
    >
      ${levelIdx + 1} - ${level.name}
    </li>`;
  }

  render() {
    console.group(this.area, this.level);
    const puzzle = getPuzzle(this.area, this.level);
    return html`
      <style>
        :host {
          background: ${colors[puzzle?.type ?? "Normal"]};
        }
      </style>
      <side-nav> ${this.renderGroupNav(officialPuzzles)} </side-nav>
      <picross-board .puzzle=${puzzle}></picross-board>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;

      padding: 10% 0 0 0;
      margin: 0;
      width: 100%;
      height: 100%;
      min-width: 100vw;
      min-height: 100vh;
      max-height: 100vh;
    }

    side-nav > li {
      cursor: pointer;
      padding: 5px;
    }

    side-nav > li:hover:not(.group-header),
    side-nav > li.selected {
      background: rgba(255, 255, 255, 0.5);
    }

    side-nav > li.group-header {
      cursor: inherit;
      padding-top: 10px;
      font-weight: bold;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
