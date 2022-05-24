<template>
  <div class="song-page">
    <div class="score-container">
      <div v-if="showLoading" class="loading">
        <img src="../assets/images/loading.gif" />
      </div>
      <div style="position: relative">
        <div id="osmdContainer"></div>
        <div
          v-for="group in groups"
          :key="group.id"
          class="group"
          :style="{ left: `${group.left}px`, width: `${group.width}px`, top: `${group.top}px`, height: `${group.height}px` }"
        ></div>
      </div>

      <!-- <div ref="container" class="score-inner-container" @click.right.prevent="openNoteGroupContextMenu($event, -1)">
        <!-d-        <img v-for="page in pageNumbers" :key="`page-${page}`" :src="'/api/score/' + songData.songId + '/' + (page + 1) + '/image'" width="100%" @load="scoreLoaded"/>-f->
        <img v-for="(page, index) in pageImages" :key="`page-${index}`" :src="page" width="100%" />
        <canvas id="score"></canvas>
        <div ref="marker" :style="{ top: `${markerPosY}px`, left: `${markerPosX}px`, width: `${markerWidth}px`, height: `${markerHeight}px` }" class="marker">
          <div class="marker-highlight"></div>
        </div>

        <div
          v-for="(group, index) in groupPositions"
          :key="group.index"
          :class="{ 'start-block': index === startBlock, 'end-block': index === endBlock, selected: group.index === selectedGroup, unselected: selectedGroup !== -1 && group.index !== selectedGroup }"
          :style="{ left: `${group.posX}px`, width: `${group.width}px`, top: `${group.posY}px`, height: `${group.height}px` }"
          class="hover-trap"
          @click.left="setCurrentPosition(index)"
          @click.right.stop.prevent="openNoteGroupContextMenu($event, index)"
        ></div>

        <ContextMenu ref="noteGroupContextMenu" @contextMenuClosed="contextMenuClosed()">
          <ContextMenuItem :enabled="selectedGroup !== -1" :text="setLoopStartText()" @select="setLoopStart()"></ContextMenuItem>
          <ContextMenuItem :enabled="selectedGroup !== -1" :text="setLoopEndText()" @select="setLoopEnd()"></ContextMenuItem>
          <ContextMenuItemSeparator />
          <ContextMenuItem text="Clear loop" @select="clearLoop()"></ContextMenuItem>
        </ContextMenu>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron";
import { defineComponent, onMounted, ref } from "vue";
// import ContextMenuItemSeparator from "@/components/menu/ContextMenuItemSeparator.vue";
// import ContextMenuItem from "@/components/menu/ContextMenuItem.vue";
// import ContextMenu from "@/components/menu/ContextMenu.vue";
// import songService from "@/services/song-service";
// import { player } from "@/store/player-module";
// import { midi } from "@/store/midi-module";
import { useRoute, useRouter } from "vue-router";
// import { useStore } from "@/store";
import { EngravingRules, IOSMDOptions, OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import { useSongStore } from "../store/song-store";

// interface GroupPosition {
//   readonly index: number;
//   readonly posX: number;
//   readonly posY: number;
//   readonly width: number;
//   readonly height: number;
// }

export default defineComponent({
  name: "SongPage",
  // components: { ContextMenu, ContextMenuItem, ContextMenuItemSeparator },

  setup() {
    // const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const songs = useSongStore();

    const showLoading = ref(true);
    const osmdDiv = ref("osmdContainer");

    const options: IOSMDOptions = {
      backend: "svg",
      drawTitle: true,
      // drawingParameters: "compacttight" // don't display title, composer etc., smaller margins
    };

    const groups: { id: number; left: number; top: number; width: number; height: number }[] = [];
    console.log("1");

    onMounted(async () => {
      //   try {
      // const songId = route.params.songId as string;
      // await store.dispatch("fetchSong", songId);
      ipcRenderer.send("get-music-xml", songs.selectedSong?.file);
      ipcRenderer.once("music-xml-loaded", async (_event, ...args) => {
        showLoading.value = false;

        const osmd = new OSMD(osmdDiv.value, options);
        // // // osmd.EngravingRules.RenderSingleHorizontalStaffline = true;
        await osmd.load(args[0]);
        osmd.render();
      });

      // osmd.enableOrDisableCursors(true);

      // const horizMargin = 5;
      // osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.forEach((containerEntry) => {
      //   let left = Number.MAX_VALUE;
      //   let top = Number.MAX_VALUE;
      //   let right = Number.MIN_VALUE;
      //   let bottom = Number.MIN_VALUE;
      //   containerEntry.StaffEntries.forEach((staffEntry) => {
      //     const containsOnlyRests = staffEntry.graphicalVoiceEntries.every((entry) => entry.notes.every((note) => !note.sourceNote.isRest()));
      //     if (containsOnlyRests) {
      //       const box = staffEntry.PositionAndShape;
      //       const measureBox = staffEntry.parentMeasure.ParentMusicSystem.StaffLines[0].PositionAndShape;
      //       const measureBox1 = staffEntry.parentMeasure.ParentMusicSystem.StaffLines[1].PositionAndShape;
      //       // const measureBox = staffEntry.parentMeasure.PositionAndShape;
      //       const entryLeft = (box.AbsolutePosition.x + box.BoundingRectangle.x) * 10 - 3;
      //       // const entryTop = (box.AbsolutePosition.y + box.BoundingRectangle.y) * 10;
      //       const entryRight = entryLeft + box.BoundingRectangle.width * 10;
      //       // const entryBottom = entryTop + box.BoundingRectangle.height * 10;

      //       // const entryTop = (measureBox.AbsolutePosition.y + measureBox.BoundingRectangle.y) * 10;
      //       // const entryBottom = (measureBox1.AbsolutePosition.y + measureBox1.BoundingRectangle.y) * 10 + measureBox1.BoundingRectangle.height * 10;
      //       const entryTop = staffEntry.parentMeasure.ParentMusicSystem.StaffLines[0].PositionAndShape.AbsolutePosition.y * 10;
      //       const entryBottom =
      //         staffEntry.parentMeasure.ParentMusicSystem.StaffLines[1].PositionAndShape.AbsolutePosition.y * 10 + staffEntry.parentMeasure.ParentMusicSystem.StaffLines[1].StaffHeight * 10;
      //       // const entryBottom = entryTop + 20;

      //       left = Math.min(left, entryLeft);
      //       top = Math.min(top, entryTop);
      //       right = Math.max(right, entryRight);
      //       bottom = Math.max(bottom, entryBottom);
      //     }
      //   });
      //   groups.push({ id: groups.length, left, top, width: right - left, height: bottom - top });
    });

    // const cursor = osmd.cursor;
    // cursor.reset();
    // cursor.show();

    // const horizMargin = 5;
    // osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.forEach((containerEntry) => {
    //   console.log(`Entry: ${containerEntry.Index}, time=${containerEntry.AbsoluteTimestamp.RealValue}`);
    //   containerEntry.StaffEntries.forEach((staffEntry, staffIndex) => {
    //     // console.log(`    Staff: ${staffIndex}`);
    //     staffEntry.graphicalVoiceEntries.forEach((voiceEntry) => {
    //       const box = staffEntry.PositionAndShape;
    //       console.log(box.BorderLeft);
    //       const left = (box.AbsolutePosition.x + box.BoundingRectangle.x) * 10 - 3 - horizMargin;
    //       const top = (box.AbsolutePosition.y + box.BoundingRectangle.y) * 10;
    //       const width = box.BoundingRectangle.width * 10 + horizMargin * 2;
    //       const height = box.BoundingRectangle.height * 10;

    //       groups.push({ left, top, width, height });
    //       voiceEntry.notes.forEach((note) => {
    //         const sourceNote = note.sourceNote;
    //         // console.log(`        Note: ${sourceNote.isRest() ? "Rest" : sourceNote.halfTone}, Length: ${sourceNote.Length.RealValue}`);
    //       });
    //     });
    //   });
    // });
    // } catch {
    //   await router.push("/song-list");
    // }
    //});

    return { showLoading, groups };
  },

  // mounted() {
  //   const router = useRouter();

  //   route.params currentRoute.value.params
  //   try {
  //     const songId = this.$route.params.songId as string;
  //     await this.$store.dispatch("fetchSong", songId);
  //     this.songData = await songService.getSongData(songId);
  //   } catch {
  //     await this.$router.push("/song-list");
  //   }
  // },

  //data() {
  //     songData: {} as ApiSongData,
  //     ctx: {} as CanvasRenderingContext2D,
  //     markerPosX: 0,
  //     markerPosY: 0,
  //     markerWidth: 0,
  //     markerHeight: 0,
  //     pressedKeysWatchHandler: null as (() => void) | null,
  //     positionHandler: null as (() => void) | null,
  //     marker: null as HTMLDivElement | null,
  //     groupPositions: [] as GroupPosition[],
  //     selectedGroup: -1,
  //     pageImages: [] as string[],
  //    showLoading: true,
  //     resizeObserver: null as ResizeObserver | null,
  //  };
  // },

  // async mounted() {
  //   this.showLoading = true;

  //   try {
  //     const songId = this.$route.params.songId as string;
  //     await this.$store.dispatch("fetchSong", songId);
  //     this.songData = await songService.getSongData(songId);
  //   } catch {
  //     await this.$router.push("/song-list");
  //   }

  //   this.$store.commit("setNoteGroups", this.songData.noteGroups);
  //   this.$store.commit("setSustainPresses", this.songData.sustainPresses);
  //   this.$store.commit("setDivisions", this.songData.divisions);
  //   this.$store.commit("setTempoFactor", this.songData.tempoFactor);

  //   await this.loadPageImages();

  //   this.$nextTick().then(this.scoreLoaded);
  //   // await this.$nextTick(async () => {
  //   //   await this.scoreLoaded();
  //   // });

  //   this.pressedKeysWatchHandler = this.$store.watch(
  //     () => midi(this.$store).pressedKeys,
  //     (newValue) => {
  //       if (newValue.length > 0) {
  //         this.$store.dispatch("triggerKeys", newValue);
  //       }
  //     }
  //   );
  // },

  // unmounted() {
  //   if (this.pressedKeysWatchHandler) {
  //     this.pressedKeysWatchHandler();
  //   }
  //   if (this.positionHandler) {
  //     this.positionHandler();
  //   }
  //   if (this.resizeObserver) {
  //     this.resizeObserver.disconnect();
  //   }

  //   this.marker?.removeEventListener("transitionend", this.scrollMarkerIntoView);

  //   this.$store.dispatch("resetPlay");
  // },

  // methods: {
  //   async loadPageImages() {
  //     const pageNumbers = Array.from(Array(this.songData.pageCount).keys());
  //     const responses = await Promise.all(
  //       pageNumbers.map((pageNumber) => {
  //         return axios.get(`/api/score/${this.songData.songId}/page/${pageNumber + 1}`, { responseType: "arraybuffer" });
  //       })
  //     );

  //     this.pageImages = responses
  //       .map((it) => it.data)
  //       .map((it) => {
  //         return btoa(new Uint8Array(it).reduce((data, byte) => data + String.fromCharCode(byte), ""));
  //       })
  //       .map((it) => `data:image/jpg;base64,${it}`);

  //     this.resizeObserver = new ResizeObserver(async () => {
  //       await this.calcGroupPositions();
  //     });
  //     const container = this.$refs.container as HTMLDivElement;
  //     this.resizeObserver.observe(container);
  //   },

  //   async scoreLoaded() {
  //     this.showLoading = false;

  //     this.marker = this.$refs.marker as HTMLDivElement;
  //     this.marker.addEventListener("transitionend", this.scrollMarkerIntoView);

  //     // this.ctx.fillStyle = "#00FF00AA"
  //     // this.songData.noteGroups.forEach(noteGroup => {
  //     //   const height1 = noteGroup.maxPosY - noteGroup.minPosY
  //     //   this.ctx.fillRect(
  //     //     (noteGroup.minPosX * this.songData.scaling * width / (this.songData.pageWidth * this.songData.scaling)),
  //     //     (noteGroup.minPosY * this.songData.scaling * height / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling)), 10,
  //     //
  //     //     (height1 * this.songData.scaling * height / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling)))
  //     // })

  //     this.calcGroupPositions();
  //     const playerState = player(this.$store);
  //     this.paintCanvas(playerState.position);
  //     this.positionHandler = this.$store.watch(
  //       () => playerState.position,
  //       (position) => {
  //         this.paintCanvas(position);
  //       }
  //     );

  //     await this.$store.dispatch("resetPlay", 0);
  //   },

  //   calcGroupPositions() {
  //     const container = this.$refs.container as HTMLDivElement;
  //     const computedStyle = getComputedStyle(container);

  //     const width = parseInt(computedStyle.getPropertyValue("width"), 10);
  //     const height = parseInt(computedStyle.getPropertyValue("height"), 10);

  //     const canvas = document.getElementById("score") as HTMLCanvasElement;
  //     canvas.width = width;
  //     canvas.height = height;

  //     this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  //     this.markerWidth = width / 50;
  //     this.groupPositions = this.songData.noteGroups.map((noteGroup, index) => {
  //       const posX = (noteGroup.minPosX * this.songData.scaling * width) / (this.songData.pageWidth * this.songData.scaling) - this.markerWidth / 3;
  //       const posY = (noteGroup.minPosY * this.songData.scaling * height) / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling) - 30;
  //       const groupHeight = ((noteGroup.maxPosY - noteGroup.minPosY) * this.songData.scaling * height) / (this.songData.pageHeight * this.songData.pageCount * this.songData.scaling) + 60;
  //       return { index, posX, posY, width: width / 50, height: groupHeight };
  //     });

  //     this.paintCanvas(player(this.$store).position);
  //   },

  //   scrollMarkerIntoView() {
  //     this.marker?.scrollIntoView({ behavior: "smooth", block: "center" });
  //   },

  //   paintCanvas(position: number) {
  //     if (position >= 0) {
  //       const groupPosition = this.groupPositions[position];
  //       this.markerPosX = groupPosition.posX;
  //       this.markerPosY = groupPosition.posY - 50;
  //       this.markerHeight = groupPosition.height + 100;
  //     }
  //   },

  //   setLoopStartText() {
  //     return (this.selectedGroup === this.startBlock ? "Clear" : "Set as") + " loop start";
  //   },

  //   setLoopEndText() {
  //     return (this.selectedGroup === this.endBlock ? "Clear" : "Set as") + " loop end";
  //   },

  //   setLoopStart() {
  //     if (this.startBlock === -1) {
  //       this.startBlock = this.selectedGroup;
  //     } else {
  //       this.startBlock = this.startBlock === this.selectedGroup ? -1 : this.selectedGroup;
  //     }
  //     if (this.startBlock !== -1 && this.startBlock === this.endBlock) {
  //       this.endBlock = -1;
  //     }
  //   },

  //   setLoopEnd() {
  //     if (this.endBlock === -1) {
  //       this.endBlock = this.selectedGroup;
  //     } else {
  //       this.endBlock = this.endBlock === this.selectedGroup ? -1 : this.selectedGroup;
  //     }
  //     if (this.endBlock !== -1 && this.startBlock === this.endBlock) {
  //       this.startBlock = -1;
  //     }
  //   },

  //   clearLoop() {
  //     this.startBlock = -1;
  //     this.endBlock = -1;
  //   },

  //   contextMenuClosed() {
  //     this.selectedGroup = -1;
  //   },

  //   openNoteGroupContextMenu(event: MouseEvent, index: number) {
  //     this.selectedGroup = index;
  //     const contextMenu = this.$refs.noteGroupContextMenu as unknown as typeof ContextMenu;
  //     contextMenu.show(event);
  //   },

  //   setCurrentPosition(index: number) {
  //     this.$store.commit("setPosition", index);
  //   },
  // },

  // computed: {
  //   startBlock: {
  //     get(): number {
  //       return player(this.$store).startBlock;
  //     },
  //     set(newValue: number) {
  //       this.$store.commit("setStartBlock", newValue);
  //     },
  //   },

  //   endBlock: {
  //     get(): number {
  //       return player(this.$store).endBlock;
  //     },
  //     set(newValue: number) {
  //       this.$store.commit("setEndBlock", newValue);
  //     },
  //   },

  //   pageNumbers(): number[] {
  //     return Array.from(Array(this.songData.pageCount).keys());
  //   },
  // },
});
</script>

<style lang="scss" scoped>
.song-page {
  background-color: white;
  border: 1px solid gray;
  // padding: 2em;
  box-shadow: 4px 5px 5px grey;
  z-index: 1;

  .score-container {
    height: 100%;

    .loading {
      height: 100%;

      img {
        margin: 20vh;
        width: 15em;
      }
    }

    .score-inner-container {
      position: relative;

      img {
        width: 100%;
      }

      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .hover-trap {
    background-color: transparent;
    position: absolute;

    &.selected,
    &:hover {
      background-color: #ff000055;

      &.unselected {
        background-color: transparent;
      }
    }

    &.start-block {
      border-width: 0.3em 0 0.3em 0.6em;
      border-color: #ff6464;
      border-radius: 50% 0 0 50%;
      border-style: double;
    }

    &.end-block {
      border-width: 0.3em 0.6em 0.3em 0;
      border-color: #ff6464;
      border-radius: 0 50% 50% 0;
      border-style: double;
    }
  }

  .marker {
    position: absolute;
    background-color: transparent;
    width: 30px;
    height: 140px;
    transition: top 0.1s ease-in-out, left 0.1s ease-in-out;

    .marker-highlight {
      position: absolute;
      top: 50px;
      bottom: 50px;
      left: 0;
      right: 0;
      background-color: #5bcdff77;
    }
  }

  .group {
    position: absolute;
    background-color: #ff000045;
  }
}
</style>
