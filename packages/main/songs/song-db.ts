import fs from "fs";

export type SongDb = {
  songs: SongDbEntry[];
};

export type SongDbEntry = {
  id: string;
  name: string;
  author: string;
  file: string;
  favorite: boolean;
};

type SongNameAndFile = {
  name: string;
  file: string;
};

function loadDb(path: string): SongDb {
  const content = fs.readFileSync(`${path}/db.json`).toString();
  return JSON.parse(content);
}

function saveDb(path: string, db: SongDb) {
  fs.writeFileSync(`${path}/db.json`, JSON.stringify(db, null, 2));
}

function readSongNames(path: string): SongNameAndFile[] {
  const files = fs.readdirSync(path);
  return files
    .filter((filename) => filename.toLocaleLowerCase().endsWith(".musicxml"))
    .map((filename) => {
      return {
        name: filename,
        file: `${path}/${filename}`,
      };
    });
}

function extractInfoFromFiles(song: SongNameAndFile): SongDbEntry {
  const xml = fs.readFileSync(song.file).toString();

  const name =
    extractRegExp(xml, /<credit-type>title[\s\S]*?credit-words[\s\S]*?>([\s\S]*?)<\/credit-words>/g) ??
    extractRegExp(xml, /<work-title>(.*?)<\/work-title>/g) ??
    song.name;

  const author =
    extractRegExp(xml, /<credit-type>composer[\s\S]*?credit-words[\s\S]*?>([\s\S]*?)<\/credit-words>/g) ??
    extractRegExp(xml, /<credit-type>subtitle[\s\S]*?credit-words[\s\S]*?>([\s\S]*?)<\/credit-words>/g) ??
    "";

  return {
    id: song.name,
    name,
    author,
    file: song.file,
    favorite: false,
  };
}

function extractRegExp(str: string, regExp: RegExp): string | undefined {
  const result = [...str.matchAll(regExp)];
  if (result.length === 0 || result[0].length < 2) {
    return undefined;
  }
  return result[0][1];
}

function load(path: string): SongDb {
  const db = loadDb(path);
  const songNames = readSongNames(path);

  const dbSongsWithActualFiles = db.songs.filter((song) => songNames.find((it) => song.id === it.name));
  const filesWithNoDbSongs = songNames.filter((it) => !db.songs.find((song) => it.name === song.id));
  const songsFromExtractedInfo = filesWithNoDbSongs.map((song) => extractInfoFromFiles(song));

  return { songs: [...dbSongsWithActualFiles, ...songsFromExtractedInfo] };
}

function save(path: string, songs: SongDbEntry[]) {
  saveDb(path, { songs });
}

export const songDb = {
  load,
  save,
};
