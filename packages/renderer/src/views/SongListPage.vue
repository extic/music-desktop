<template>
  <div class="song-list-page">
    <div class="filter-container">
      <button class="filter-button" :class="{ selected: showAllSongs }" @click="showAllSongs = true">
        <img src="../assets/images/all.svg" />
        <span>All Songs</span>
      </button>
      <button class="filter-button" :class="{ selected: !showAllSongs }" @click="showAllSongs = false">
        <img src="../assets/images/star.svg" />
        <span>Favorite Songs</span>
      </button>
      <label for="filter">Filter:</label>
      <div class="filter-input-container">
        <input id="filter" v-model="filter" />
        <button title="Clear filter" @click="filter = ''"></button>
      </div>
    </div>
    <section class="song-list-container">
      <transition-group class="song-list" name="list" tag="div">
        <song-box :song="song" v-for="song in filteredSongList" :key="song.name" @click="selectSong(song)" />
      </transition-group>
      <div v-if="filteredSongList.length === 0" class="no-match">No song matches your filter</div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { Song, useSongStore } from "../store/song-store";
import SongBox from "../components/SongBox.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SongListPage",

  components: { SongBox },

  setup() {
    const router = useRouter();
    const store = useSongStore();

    const filter = computed({
      get(): string {
        return store.filter;
      },
      set(newValue: string): void {
        store.setFilter(newValue);
      },
    });

    const showAllSongs = computed({
      get(): boolean {
        return !store.showFavorites;
      },
      set(newValue: boolean): void {
        store.setShowFavorites(!newValue);
      },
    });

    const songs = ref([] as Song[]);

    const filteredSongList = computed(() => {
      let filteredSongs = songs.value;
      if (!showAllSongs.value) {
        filteredSongs = filteredSongs.filter((it) => it.favorite);
      }

      return filteredSongs
        .filter((it) => filter.value === "" || it.name.toLowerCase().includes(filter.value) || it.author.toLowerCase().includes(filter.value))
        .sort((s1: Song, s2: Song) => s1.name.localeCompare(s2.name));
    });

    const selectSong = (song: Song) => {
      router.push({ name: "Song", params: { songId: song.id } });
    };

    onMounted(() => {
      songs.value = store.songList;
      // store.commit("setKeyboardButtonShown", false);
      // store.dispatch("fetchSongList");
    });

    return { showAllSongs, filter, selectSong, filteredSongList, songs };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables.scss";

.song-list-page {
  display: flex;
  flex-direction: column;
  height: calc(100% - #{$header-height});
  overflow: hidden;

  .filter-container {
    display: flex;
    align-items: center;
    gap: 1em;
    padding: 2em 3em 2em 3em;
    border-bottom: 1px solid lightgray;

    .filter-button {
      @include pressable;
      border: 1px solid lightgray;
      border-radius: 4px;
      display: flex;
      flex-direction: row;
      align-items: center;
      align-self: stretch;
      padding: 0.4em 1em;
      gap: 0.5em;
      background-color: white;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 1.2em;

      &.selected {
        background-color: #69ccef;
      }

      img {
        width: 1em;
      }

      span {
        white-space: nowrap;
      }
    }

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
        @include pressable;
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
        cursor: pointer;
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
    font-size: 0.7em;

    .song-list {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      flex-wrap: wrap;
      gap: 3em;
      padding: 1em 3em;
      overflow: hidden;
      justify-content: space-between;

      @media (max-width: 1780px) {
        grid-template-columns: repeat(5, 1fr);
      }

      @media (max-width: 1520px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 1240px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 1200px) {
        grid-template-columns: repeat(5, 1fr);
      }

      @media (max-width: 1050px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media (max-width: 850px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 780px) {
        grid-template-columns: repeat(5, 1fr);
      }

      .list-enter-from,
      .list-leave-to {
        opacity: 0;
        transform: scale(0.01) translate(30px, 0);
      }

      .list-move,
      .list-enter-active,
      .list-leave-active {
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
      }

      .list-leave-active {
        position: absolute;
      }
    }

    hr {
      height: 1px;
      border: 0;
      border-bottom: 1px solid lightgray;
      margin: 1em 0;
    }
  }
  .no-match {
    font-size: 2em;
    margin-top: 4em;
  }
}
</style>
