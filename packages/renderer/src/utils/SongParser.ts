import { group } from "console";
import { OpenSheetMusicDisplay as OSMD, VerticalGraphicalStaffEntryContainer } from "opensheetmusicdisplay";
import _ from "lodash";
import { AvailableMidiInstruments, MidiInstrument } from "../services/midi-service";

export type SongData = {
  instruments: Instrument[];
  verticalGroups: VerticalGroup[];
  bpm: number;
};

export type Instrument = {
  name: string;
  midiChannel: number;
  staffIndexes: number[];
  midiInstrument: MidiInstrument;
};

export type VerticalGroup = {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  notes: { [staff: number]: Note[] };
  time: number;
  length: number;
};

export type Note = {
  tone: number;
  isRest: boolean;
  isTied: boolean;
  length: number;
  instrument: Instrument;
};

type BoundingBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function parseInstruments(osmd: OSMD): Instrument[] {
  return osmd.Sheet.Instruments.map((it, instrumentIndex): Instrument => {
    const staffIndexes = it.Staves.map((staff) => staff.idInMusicSheet);

    const name = it.NameLabel.text;
    let midiInstrument: MidiInstrument = AvailableMidiInstruments[0];
    switch (name) {
      case "Violon":
        midiInstrument = AvailableMidiInstruments[1];
        break;
      case "Violoncelle":
        midiInstrument = AvailableMidiInstruments[2];
        break;
    }

    return { name, midiChannel: instrumentIndex, staffIndexes, midiInstrument };
  });
}

function parseVerticalGroups(osmd: OSMD, instruments: Instrument[]): VerticalGroup[] {
  const groups: VerticalGroup[] = [];

  osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.forEach((containerEntry) => {
    const { left, top, right, bottom } = calcBoundingBox(containerEntry);
    const notes = calcNotes(containerEntry, osmd.Sheet.Staves.length, instruments);

    const time = containerEntry.AbsoluteTimestamp.RealValue;
    const allNotes = Object.values(notes).flatMap((it) => it);
    const groupLength = _.min(allNotes.map((it) => it.length)) ?? 0;

    groups.push({ id: groups.length, left, top, width: right - left, height: bottom - top, notes, length: groupLength, time });
  });

  groups.forEach((group, groupIndex) => {
    if (groupIndex + 1 < groups.length) {
      group.length = groups[groupIndex + 1].time - group.time;
    }
  });

  return groups;
}

function calcBoundingBox(containerEntry: VerticalGraphicalStaffEntryContainer): BoundingBox {
  let left = Number.MAX_VALUE;
  let top = Number.MAX_VALUE;
  let right = Number.MIN_VALUE;
  let bottom = Number.MIN_VALUE;
  const staffCount = containerEntry.StaffEntries.length;
  containerEntry.StaffEntries.forEach((staffEntry) => {
    // const containsOnlyRests = staffEntry.graphicalVoiceEntries.every((entry) => entry.notes.every((note) => !note.sourceNote.isRest()));
    // if (containsOnlyRests) {
    const box = staffEntry.PositionAndShape;
    const entryLeft = (box.AbsolutePosition.x + box.BoundingRectangle.x) * 10 - 3;
    const entryRight = entryLeft + box.BoundingRectangle.width * 10;
    const staffLines = staffEntry.parentMeasure.ParentMusicSystem.StaffLines;
    const entryTop = staffLines[0].PositionAndShape.AbsolutePosition.y * 10;
    const entryBottom = staffLines[staffCount - 1].PositionAndShape.AbsolutePosition.y * 10 + staffLines[staffCount - 1].StaffHeight * 10;

    left = Math.min(left, entryLeft);
    top = Math.min(top, entryTop);
    right = Math.max(right, entryRight);
    bottom = Math.max(bottom, entryBottom);
    // }
  });
  return { left, top, right, bottom };
}

function calcNotes(containerEntry: VerticalGraphicalStaffEntryContainer, staffCount: number, instruments: Instrument[]): { [staff: number]: Note[] } {
  const notes: { [staff: number]: Note[] } = {};
  for (let i = 0; i < staffCount; i++) {
    const staffEntry = containerEntry.StaffEntries[i];
    const staffNotes: Note[] = [];
    if (staffEntry) {
      const instrument = instruments.find((it) => it.staffIndexes.includes(i))!!;
      staffEntry.graphicalVoiceEntries.forEach((voice) => {
        const voiceNotes = voice.notes.map((note): Note => {
          return {
            tone: note.sourceNote.halfTone + 12,
            isRest: note.sourceNote.isRest(),
            isTied: !!note.sourceNote.NoteTie && note.sourceNote.NoteTie.StartNote !== note.sourceNote,
            length: note.sourceNote.Length.RealValue,
            instrument,
          };
        });
        staffNotes.push(...voiceNotes);
      });
    }
    notes[i] = staffNotes;
  }
  return notes;
}

function printDebug(songData: SongData) {
  songData.verticalGroups.forEach((group, groupIndex) => {
    console.log(`--- Group ${groupIndex}, Time: ${group.time}, Length: ${group.length}`);
    songData.instruments.forEach((instrument) => {
      instrument.staffIndexes.forEach((staffIndex) => {
        console.log(`      Staff ${staffIndex}:`);
        group.notes[staffIndex].forEach((note) => {
          console.log(`         Note: ${note.isRest ? "rest" : note.tone}, Length=${note.length}`);
        });
      });
    });
  });
}

export const SongParser = {
  parse: (osmd: OSMD): SongData => {
    const instruments = parseInstruments(osmd);
    const verticalGroups = parseVerticalGroups(osmd, instruments);
    const bpm = osmd.Sheet.DefaultStartTempoInBpm;

    return { instruments, verticalGroups, bpm };
  },

  printDebug: (songData: SongData) => {
    printDebug(songData);
  },
};
