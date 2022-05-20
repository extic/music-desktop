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
      <!-- <h2 class="song-section-title" v-if="favoriteSongList.length !== 0">Favorite Songs</h2>
      <song-list :song-list="favoriteSongList"></song-list>
      <hr v-if="favoriteSongList.length !== 0 && registeredSongList.length !== 0" />
      <h2 class="song-section-title" v-if="allSongList.length !== 0">All Songs</h2>
      <song-list :song-list="allSongList"></song-list>
      <hr v-if="allSongList.length !== 0" />
      <div v-if="allSongList.length === 0" class="no-match">No song matches your filter</div> -->
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
// import { songs } from "@/store/song-module";
// import { useStore } from "@/store";
// import SongList from "@/components/SongList.vue";
// import { Song } from "@/services/music-files/song-serializer.service";

export default defineComponent({
  name: "SongListPage",

  // components: { SongList },

  setup() {
    // const store = useStore();

    const filter = ref("");

    const allSongList = computed(() => {
      // return songs(store)
      //   .songList.filter((it) => filter.value === "" || it.name.toLowerCase().includes(filter.value) || it.author.toLowerCase().includes(filter.value))
      //   .sort((s1: Song, s2: Song) => s1.name.localeCompare(s2.name));
    });

    const favoriteSongList = computed(() => {
      // const favorites = songs(store).favoriteSongs;
      // return allSongList.value.filter((it) => favorites.includes(it.uuid));
    });

    onMounted(() => {
      // store.commit("setKeyboardButtonShown", false);
      // store.dispatch("fetchSongList");
    });

    return { filter, favoriteSongList, allSongList };
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
        background-image: url("/static/assets/images/clear.svg");
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
