import * as fs from "fs";

export const SongSerializer = {
  load(): SongRecord[] {
    const dataFolder = "C:/programming/music/data-files"; //process.env.DATA_FOLDER

    const files = fs.readdirSync(dataFolder);
    return files
      .map((filename) => `${dataFolder}/${filename}`)
      .filter((folder) => fs.lstatSync(folder).isDirectory())
      .map((folder) => {
        const rawData = fs.readFileSync(`${folder}/info.json`);
        const song = JSON.parse(rawData.toString());

        const musicXmlName = fs.readdirSync(folder).find((file) => {
          return file.toLowerCase().endsWith(".musicxml");
        });

        song.folder = folder;
        song.musicXmlFile = `${folder}/${musicXmlName}`;

        console.debug(`Loaded - ${song.name}`);

        return song as SongRecord;
      });
  },
};

export interface SongRecord {
  readonly uuid: string;
  readonly name: string;
  readonly folder: string;
  readonly musicXmlFile: string;
  readonly author: string;
  readonly incomplete: boolean;
  readonly registered: boolean;
  readonly admin: boolean;
}
