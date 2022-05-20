<template>
  <div class="song-list-page">
    <div class="filter-container">
      <label for="filter">Filter:</label>
      <div class="filter-input-container">
        <input id="filter" v-model="filter" />
        <button title="Clear filter" @click="filter = ''"></button>
      </div>
    </div>
    <section class="song-list-container">
      <transition-group class="song-list" name="flip-list" tag="div">
        <div
          v-for="song in filteredSongList"
          :key="song.uuid"
          class="song-list-box-container"
        >
          <div @click="selectSong(song)">
            <song-box :song="song" />
          </div>
        </div>
      </transition-group>
      <div v-if="filteredSongList.length === 0" class="no-match">
        No song matches your filter
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Song, useSongStore } from "../store/song-store";
import SongBox from "../components/SongBox.vue";

export default defineComponent({
  name: "SongListPage",

  components: { SongBox },

  setup() {
    const store = useSongStore();

    const filter = ref("");
    const songs = ref([] as Song[]);

    const filteredSongList = computed(() => {
      return songs.value
        .filter(
          (it) =>
            filter.value === "" ||
            it.name.toLowerCase().includes(filter.value) ||
            it.author.toLowerCase().includes(filter.value)
        )
        .sort((s1: Song, s2: Song) => s1.name.localeCompare(s2.name));
    });

    const selectSong = (song: Song) => {
      // router.push({ name: "Song", params: { songId: song.uuid } });
    };

    onMounted(() => {
      songs.value = store.songList;
      // store.commit("setKeyboardButtonShown", false);
      // store.dispatch("fetchSongList");
    });

    return { filter, selectSong, filteredSongList, songs };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.song-list-page {
  display: flex;
  flex-direction: column;
  //gap: 2em;
  height: calc(100% - #{$header-height});
  overflow: hidden;

  .filter-container {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 2em 3em 2em 3em;
    border-bottom: 1px solid lightgray;

    label {
      font-size: 1.2em;
    }

    .filter-input-container {
      border: 1px solid lightgray;
      border-radius: 0.5em;
      overflow: hidden;
      background-color: white;
      width: 100%;
      display: flex;
      align-items: center;

      input {
        padding: 0.5em;
        border: none;
        flex-grow: 1;
        outline: none;
        font-size: 1.2em;
      }

      button {
        flex-shrink: 0;
        width: 2em;
        height: 2em;
        border: none;
        background-image: url("../assets/images/clear.svg");
        background-size: 1.2em;
        background-color: transparent;
        background-repeat: no-repeat;
        background-position: 50%;
        margin-right: 0.5em;
        outline: none;
        transform: scale(1);
        transition: transform 0.2s;
        cursor: pointer;

        &:hover {
          transform: scale(1.3);
        }
      }
    }
  }

  .song-section-title {
    text-align: left;
    font-weight: normal;
    padding: 0;
    margin: 0;
  }

  .song-list-container {
    padding: 1em 3em;
    overflow: auto;

    .song-list {
      display: flex;
      flex-wrap: wrap;
      column-gap: 3em;
      row-gap: 3em;
      padding: 1em 3em;
      overflow: auto;

      .song-list-box-container {
        display: inline-block;
        position: relative;
        opacity: 1;
        transform: scale(1);
        transition: transform 0.3s, opacity 0.3s;
        font-size: 0.7em;
      }
    }

    hr {
      height: 1px;
      border: 0;
      border-bottom: 1px solid lightgray;
      margin: 1em 0;
    }
  }

  .flip-list-move {
  }

  .flip-list-enter,
  .flip-list-leave-to {
    opacity: 0;
    transform: scale(0.1);
  }

  .flip-list-leave-active {
    position: absolute;
  }

  .no-match {
    font-size: 2em;
    margin-top: 4em;
  }

  //a {
  //    font-weight: bold;
  //    color: #2c3e50;
  //
  //    &.router-link-exact-active {
  //        color: #42b983;
  //    }
  //}
}
</style>
