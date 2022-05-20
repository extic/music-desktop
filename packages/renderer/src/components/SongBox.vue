<template>
  <div class="song-box" @click="playSong(song)">
    <div class="song-list-box" :class="{ locked: false /*song.locked*/ }">
      <div class="song-title">{{ song.name }}</div>
      <div class="song-author">{{ song.author }}</div>
      <div
        v-if="song.incomplete"
        class="incomplete"
        title="Incomplete score (Work in progress...)"
      ></div>
      <div class="lock" title="Available for pro users"></div>
      <div
        class="favorite"
        :class="{ selected: isFavorite(song) }"
        title="Mark as favorite"
        @click.stop="markFavorite(song)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { useRouter } from "vue-router";
import { Song, useSongStore } from "../store/song-store";

export default defineComponent({
  name: "SongBox",

  props: {
    song: {
      type: Object as PropType<Song>,
      required: true,
    },
  },

  setup() {
    const router = useRouter();
    // const store = useStore();

    const playSong = (song: Song) => {
      // router.push({ name: "Song", params: { songId: song.uuid } });
    };

    const isFavorite = (song: Song) => {
      return true;
      // return songs(store).favoriteSongs.find((it) => it === song.uuid) != null;
    };

    const markFavorite = (song: Song) => {
      // store.dispatch("toggleSongFavorite", song.uuid);
    };

    return { playSong, isFavorite, markFavorite };
  },
});
</script>

<style lang="scss" scoped>
@import "../styles/variables";

.song-box {
  .song-list-box {
    width: 16.5em;
    height: 12.5em;
    border: 1px solid gray;
    border-radius: 1em;
    box-shadow: 0 0 10px -2px black, inset 0 0 10px 2px #69ccef;
    background-color: white;
    padding: 1em;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;

    &.locked {
      cursor: inherit;

      .lock {
        position: absolute;
        bottom: 0.8em;
        right: 0.6em;
        width: 1.5em;
        height: 1.5em;
        background-image: url("../assets/images/lock.svg");
        background-size: cover;
        opacity: 0.3;
        transition: all 0.2s ease-in-out;
      }

      &:hover {
        background-color: white;

        .lock {
          width: 3em;
          height: 3em;
          transform: rotateZ(-15deg);
        }
      }
    }

    .favorite {
      position: absolute;
      top: 0.8em;
      left: 0.8em;
      width: 1.5em;
      height: 1.5em;
      transition: all 0.2s ease-in-out;
      display: block;

      &.selected {
        background-image: url("../assets/images/star.svg");
        background-size: cover;
      }
    }

    &:hover {
      background-color: #69ccef;
      transform: scale(1.03);

      .favorite {
        position: absolute;
        top: 0.8em;
        left: 0.8em;
        width: 1.5em;
        height: 1.5em;
        transition: all 0.2s ease-in-out;
        background-image: url("../assets/images/star-empty.svg");
        background-size: cover;

        &.selected {
          background-image: url("../assets/images/star.svg");
          background-size: cover;
        }
      }
    }

    .song-title {
      font-size: 1.8em;
      margin: 1em 0 0.5em 0;
      font-weight: bold;
      text-shadow: 0 0 1em #87d8ff;
    }

    .song-author {
      font-size: 1.3em;
    }

    .incomplete {
      position: absolute;
      top: 0;
      right: 0;
      width: 2em;
      height: 2em;
      background-color: #69ccef95;
      border-radius: 0 0 0 100%;
    }
  }
}
</style>
