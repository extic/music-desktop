import _ from "lodash";
import { midiService } from "../services/midi-service";
import { usePlayerStore } from "../store/player-store";

function initInstruments() {
  const player = usePlayerStore();
  player.instruments.forEach((it) => {
    midiService.initInstruments(it);
  });
}

function triggerKeys() {
  const player = usePlayerStore();

  if (!player.playing) {
    return;
  }

  const practiceStaves = getPracticeStaves();

  if (player.player === "computer") {
    triggerComputerKeys(false, practiceStaves);
    return;
  }

  const group = player.groups[player.position];
  const requiredKeys = practiceStaves
    .flatMap((staff) => group.notes[staff])
    .filter((it) => !it.isRest)
    .map((it) => it.tone);
  const pressedKeys = player.pressedKeys;

  console.log(player.pressedKeys, requiredKeys);

  if (requiredKeys.length !== pressedKeys.length || !_.isEmpty(_.difference(requiredKeys, pressedKeys))) {
    return;
  }

  player.clearPressedKeys();

  const playerHasKeys = requiredKeys.length > 0;
  triggerComputerKeys(playerHasKeys, practiceStaves);
}

function triggerComputerKeys(playerHasKeys: boolean, practiceStaves: number[]) {
  const player = usePlayerStore();
  const group = player.groups[player.position];

  const staffNotes = group.notes;
  let computerHasKeys = false;
  player.instruments.forEach((instrument, index) => {
    instrument.staffIndexes
      .filter((it) => !practiceStaves.includes(it))
      .forEach((staffIndex) => {
        staffNotes[staffIndex]
          .filter((note) => !note.isRest)
          .forEach((note) => {
            computerHasKeys = true;
            player.setVirtualOnKey(staffIndex, note.tone.toString(), note.length, note.instrument);
            midiService.play(note.tone, 0x40, note.instrument); //, AvailableMidiInstruments[0], 0);
          });
      });
  });

  if (player.playing) {
    const delayCoefficient = -player.bpm * 36.66 + 5866;
    const timeoutDelay = playerHasKeys && !computerHasKeys ? 0 : group.length * delayCoefficient;
    setTimeout(() => {
      advancePosition();
    }, timeoutDelay);
  }
}

function advancePosition() {
  const player = usePlayerStore();
  const group = player.groups[player.position];
  updateVirtualOnKeysTime(group.length);
  console.log(player.virtualOnKeys);

  // console.log("advancePosition", player.playing);
  if (!player.playing) {
    return;
  }
  player.setPosition(player.position + 1);

  triggerKeys();
}

function updateVirtualOnKeysTime(amount: number) {
  const player = usePlayerStore();
  Object.entries(player.virtualOnKeys).forEach(([staff, virtualOnKeyEntry]) => {
    Object.entries(virtualOnKeyEntry).forEach(([key, timeAndInstrument]) => {
      timeAndInstrument.time -= amount;
      if (timeAndInstrument.time <= 0) {
        player.removeVirtualOnKey(+staff, key);
        midiService.release(+key, timeAndInstrument.instrument);
      }
    });
  });
}

function stop() {
  const player = usePlayerStore();
  player.setPlaying(false);
  player.clearPressedKeys();
  player.resetVirtualOnKeys([]);
  midiService.resetDevice();
}

function reset() {
  const player = usePlayerStore();
  stop();
  player.setPosition(0);
}

function getPracticeStaves(): number[] {
  const player = usePlayerStore();
  if (player.player === "computer") {
    return [];
  }
  const staffIndexes = player.selectedInstrument!!.staffIndexes;
  if (staffIndexes.length === 1 || (player.practiceLeftHand && player.practiceRightHand)) {
    return staffIndexes;
  }
  if (player.practiceLeftHand) {
    return [staffIndexes[1]];
  }
  return [staffIndexes[0]];
}

export const SongPlayer = {
  play: () => {
    const player = usePlayerStore();
    if (player.playing) {
      return;
    }
    player.setPlaying(true);
    player.resetVirtualOnKeys(player.instruments.flatMap((it) => it.staffIndexes));
    triggerKeys();
  },

  stop,
  reset,
  triggerKeys,
  initInstruments,

  // for (let i = 0; i < player.instruments.length; i++) {
  //   let instrument = AvailableMidiInstruments[0];
  //   // if (i === 0) {
  //   //   instrument = AvailableMidiInstruments[5];
  //   // } else if (i === 1) {
  //   //   instrument = AvailableMidiInstruments[6];
  //   // }

  //   instrument.

  //   staffNotes[+i].forEach((note) => {
  //     console.log(note);
  //     midiService.play1(note, 0x70, instrument, i);
  //   });
  // }
  // console.log(notes);
  // Object.values(staffNotes).forEach((notes) => {
  //   notes.forEach((note) => {
  //     console.log(note);
  //     midiService.play(note, 0x70);
  //   });
  // });
  // midiService.play
  // }, 1000);
};
