import { defineStore } from "pinia";
import { Instrument, VerticalGroup } from "../utils/SongParser";

export type PlayerType = "computer" | "human";

export type PressedKeys = { [key: string]: number };

export const usePlayerStore = defineStore("player", {
  state: () => ({
    _player: "human" as PlayerType,
    _instruments: [] as Instrument[],
    _selectedInstrument: null as Instrument | null,
    _practiceLeftHand: true,
    _practiceRightHand: true,
    _autoAccompany: true,
    _groups: [] as VerticalGroup[],
    _position: 0,
    _playing: false,
    _pressedKeys: {} as PressedKeys,
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

    groups(state): VerticalGroup[] {
      return state._groups;
    },

    position(state): number {
      return state._position;
    },

    playing(state): boolean {
      return state._playing;
    },

    pressedKeys(state): PressedKeys {
      return state._pressedKeys;
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

    setGroups(groups: VerticalGroup[]): void {
      this._groups = groups;
    },

    setPosition(position: number): void {
      this._position = position;
    },

    setPlaying(playing: boolean): void {
      this._playing = playing;
    },

    clearPressedKeys(): void {
      this._pressedKeys = {};
    },

    setPressedKey(key: string, time: number) {
      this._pressedKeys[key] = time;
    },

    removePressedKey(key: string) {
      delete this._pressedKeys[key];
    },
  },
});
