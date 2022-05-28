import { group } from "console";
import { OpenSheetMusicDisplay as OSMD, VerticalGraphicalStaffEntryContainer } from "opensheetmusicdisplay";

export type SongData = {
  instruments: Instrument[];
  verticalGroups: VerticalGroup[];
};

export type Instrument = {
  name: string;
  staffIndexes: number[];
};

export type VerticalGroup = {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

type BoundingBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function parseInstruments(osmd: OSMD): Instrument[] {
  return osmd.Sheet.Instruments.map((it): Instrument => {
    const staffIndexes = it.Staves.map((staff) => staff.idInMusicSheet);

    return { name: it.NameLabel.text, staffIndexes };
  });
}

function parseVerticalGroups(osmd: OSMD): VerticalGroup[] {
  const groups: VerticalGroup[] = [];

  osmd.GraphicSheet.VerticalGraphicalStaffEntryContainers.forEach((containerEntry) => {
    const { left, top, right, bottom } = calcBoundingBox(containerEntry);
    // const notes = calcNotes(containerEntry);

    groups.push({ id: groups.length, left, top, width: right - left, height: bottom - top });
  });

  console.log(groups);

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

// function calcNotes(containerEntry: VerticalGraphicalStaffEntryContainer): { [staff: string]: number[] } {
//   const notes: { [staff: string]: number[] } = {};
//   containerEntry.StaffEntries.forEach((staffEntry) => {
//     staffEntry.
//     // staffEntry.staffEntryParent.in
//   });
//   return {};
// }

export const SongParser = {
  calc: (osmd: OSMD): SongData => {
    const instruments = parseInstruments(osmd);
    const verticalGroups = parseVerticalGroups(osmd);

    return { instruments, verticalGroups };
  },
};
