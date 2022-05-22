import { defineStore } from "pinia";
import { ipcRenderer } from "electron";

export const useSongStore = defineStore("song", {
  state: () => ({
    _songList: [] as Song[],
    _selectedSong: null as Song | null,
  }),

  getters: {
    songList(state): Song[] {
      return state._songList;
    },

    selectedSong(state): Song | null {
      return state._selectedSong;
    },
  },

  actions: {
    setSongList(songList: Song[]) {
      this._songList = songList;
    },

    setSelectedSong(selectedSong: Song | null) {
      this._selectedSong = selectedSong;
    },

    loadSongs() {
      this._songList = <Song[]>[]; //ipcRenderer.sendSync("load-songs");
    },
  },
});

export interface Song {
  readonly uuid: string;
  readonly name: string;
  readonly folder: string;
  readonly musicXmlFile: string;
  readonly author: string;
  readonly incomplete: boolean;
  readonly admin: boolean;
}
