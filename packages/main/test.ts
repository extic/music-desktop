import { ipcMain, dialog, BrowserWindow, app } from "electron";
import * as fs from "fs";
import { songDb } from "./songs/song-db";

export const utils = {
  aaa: (win: BrowserWindow) => {
    // SongSerializer.load();

    ipcMain.on("synchronous-message", (event, arg) => {
      console.log(arg); // prints "ping"
      event.returnValue = "pong";
    });

    ipcMain.on("load-songs", (event, arg) => {
      event.returnValue = songDb.load(arg);
    });

    ipcMain.on("save-songs", (event, path: string, songs: any) => {
      event.returnValue = songDb.save(path, JSON.parse(songs));
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

    ipcMain.on("get-music-xml", (event, arg) => {
      const xml = fs.readFileSync(arg).toString();

      win.webContents.send("music-xml-loaded", xml);
    });
  },
};
