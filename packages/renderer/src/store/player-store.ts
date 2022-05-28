import { STATEMENT_OR_BLOCK_KEYS } from "@babel/types";
import { defineStore } from "pinia";
import { Instrument } from "../utils/SongParser";

export type PlayerType = "computer" | "human";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    _player: "human" as PlayerType,
    _instruments: [] as Instrument[],
    _selectedInstrument: null as Instrument | null,
    _practiceLeftHand: true,
    _practiceRightHand: true,
    _autoAccompany: true,
  }),

  getters: {
    player(state): PlayerType {
      return state._player;
    },

    instruments(state): Instrument[] {
      return state._instruments;
    },

    selectedInstrument(state): Instrument | null {
      return state._selectedInstrument;
    },

    practiceLeftHand(state): boolean {
      return state._practiceLeftHand;
    },

    practiceRightHand(state): boolean {
      return state._practiceRightHand;
    },

    autoAccompany(state): boolean {
      return state._autoAccompany;
    },
  },

  actions: {
    setPlayer(player: PlayerType): void {
      this._player = player;
    },

    setInstruments(instruments: Instrument[]): void {
      this._instruments = instruments;
    },

    setSelectedInstrument(instrument: Instrument | null): void {
      this._selectedInstrument = instrument;
    },

    setPracticeLeftHand(practiceLeftHand: boolean): void {
      this._practiceLeftHand = practiceLeftHand;
    },

    setPracticeRightHand(practiceRightHand: boolean): void {
      this._practiceRightHand = practiceRightHand;
    },

    setAutoAccompany(autoAccompany: boolean): void {
      this._autoAccompany = autoAccompany;
    },
  },
});
