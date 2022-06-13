<template>
  <div class="edit-song-pane" :class="{ shown: songs.editSongPaneShown }">
    <div class="edit-song-header">
      <h1>Edit Song Details</h1>
      <button class="close" title="Close" @click="close">🠆</button>
    </div>
    <div class="field">
      <label for="songName">Song Name</label>
      <input id="song-name" v-model="songName" placeholder="The song name" />
    </div>
    <div class="field">
      <label for="songAuthor">Composer / Arranger</label>
      <input id="songAuthor" v-model="songAuthor" placeholder="Song composer or author" />
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { computed, defineComponent } from "vue";
import { useSettingsStore } from "../store/settings-store";
import { useSongStore } from "../store/song-store";

export default defineComponent({
  name: "EditSongPane",

  setup: function () {
    const songs = useSongStore();

    const songName = computed({
      get(): string {
        return songs.selectedSong?.name ?? "";
      },
      set(newValue: string) {
        songs.selectedSong!!.name = newValue;
      },
    });

    const songAuthor = computed({
      get(): string {
        return songs.selectedSong?.author ?? "";
      },
      set(newValue: string) {
        songs.selectedSong!!.author = newValue;
      },
    });

    const close = () => {
      const settings = useSettingsStore();
      ipcRenderer.sendSync("save-songs", settings.dataFilesPath, JSON.stringify(songs.songList));
      songs.setEditSongPaneShown(false);
    };

    return {
      songs,
      songName,
      songAuthor,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.edit-song-pane {
  display: block;
  position: fixed;
  top: -25em;
  left: 2em;
  right: 2em;
  bottom: 0;
  height: 22em;
  background-color: rgb(249, 250, 255);
  z-index: 10;
  box-shadow: 0px 0px 20px 0px black;
  transition: top 0.2s;
  text-align: left;
  padding: 2em;
  box-sizing: border-box;

  &.shown {
    top: 0;
  }

  .edit-song-header {
    display: flex;
    margin-bottom: 2em;

    h1 {
      margin: 0;
      flex-grow: 1;
    }

    .close {
      @include pressable;
      flex-shrink: 0;
      border: none;
      background: none;
      font-size: 2em;
      width: 1.4em;
      height: 1.4em;
      line-height: 1.4em;
      border-radius: 50%;
      transition: color 0.2s, background-color 0.2s;
      cursor: pointer;

      &:hover {
        background-color: #80c4dd;
        color: white;
      }
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 2em;

    label {
      margin-bottom: 0.5em;
    }

    input {
      padding: 0.5em;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      flex-grow: 1;
    }
  }
}
</style>
