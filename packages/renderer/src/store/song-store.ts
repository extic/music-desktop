import { defineStore } from "pinia";
import { ipcRenderer } from "electron";
import { useSettingsStore } from "./settings-store";

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

    setFavorite(songId: string, favorite: boolean) {
      const song = this._songList.find((it) => it.id === songId);
      if (song) {
        song.favorite = favorite;

        const settings = useSettingsStore();
        ipcRenderer.sendSync("save-songs", settings.dataFilesPath, JSON.stringify(this._songList));
      }
    },

    loadSongs() {
      const settings = useSettingsStore();
      this._songList = <Song[]>ipcRenderer.sendSync("load-songs", settings.dataFilesPath).songs;
    },
  },
});

export type Song = {
  id: string;
  name: string;
  author: string;
  file: string;
  favorite: boolean;
};
