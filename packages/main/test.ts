import { ipcMain } from "electron";
import { SongSerializer } from "./songs/song-serializer";

export const utils = {
  aaa: () => {
    SongSerializer.load();

    ipcMain.on("synchronous-message", (event, arg) => {
      console.log(arg); // prints "ping"
      event.returnValue = "pong";
    });

    ipcMain.on("getSongs", (event, arg) => {
      event.returnValue = SongSerializer.load().map((it) => it.name);
    });
  },
};
