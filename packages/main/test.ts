import { ipcMain, dialog, BrowserWindow, app } from "electron";
import { SongSerializer } from "./songs/song-serializer";
import * as fs from "fs";

export const utils = {
  aaa: (win: BrowserWindow) => {
    // SongSerializer.load();

    ipcMain.on("synchronous-message", (event, arg) => {
      console.log(arg); // prints "ping"
      event.returnValue = "pong";
    });

    ipcMain.on("load-songs", (event, arg) => {
      event.returnValue = SongSerializer.load();
    });

    ipcMain.on("get-home-path", (event, arg) => {
      event.returnValue = app.getPath("home");
    });

    ipcMain.on("create-folder", (event, arg) => {
      fs.mkdirSync(arg, { recursive: true });
    });

    ipcMain.on("open-folder-dialog", (event, arg) => {
      const dir = dialog.showOpenDialogSync(win, {
        properties: ["openDirectory"],
        defaultPath: arg,
      });
      event.returnValue = dir?.[0];
    });
  },
};
