import { AvailableMidiInstruments, midiService } from "../services/midi-service";
import { usePlayerStore } from "../store/player-store";

function triggerKeys() {
  const player = usePlayerStore();
  if (!player.playing) {
    return;
  }

  const group = player.groups[player.position];

  const staffNotes = group.notes;
  player.instruments.forEach((instrument, index) => {
    instrument.staffIndexes.forEach((staffIndex) => {
      staffNotes[staffIndex]
        .filter((note) => !note.isRest)
        .forEach((note) => {
          player.setPressedKey(note.tone.toString(), note.length);
          midiService.play(note.tone, 0x70); //, AvailableMidiInstruments[0], 0);
        });
    });
  });

  if (player.playing) {
    setTimeout(() => {
      advancePosition();
    }, group.length * 2000);
  }
}

function advancePosition() {
  const player = usePlayerStore();

  const group = player.groups[player.position];
  updatePressedKeysTime(group.length);

  // console.log("advancePosition", player.playing);
  if (!player.playing) {
    return;
  }
  player.setPosition(player.position + 1);

  triggerKeys();
}

function updatePressedKeysTime(amount: number) {
  const player = usePlayerStore();

  Object.entries(player.pressedKeys).forEach(([key, time]) => {
    time -= amount;
    if (time > 0) {
      player.setPressedKey(key, time);
    } else {
      player.removePressedKey(key);
      midiService.release(+key);
    }
  });
}

function stop() {
  const player = usePlayerStore();
  player.setPlaying(false);
  player.clearPressedKeys();
  midiService.resetDevice();
}

function reset() {
  stop();
  const player = usePlayerStore();
  player.setPosition(0);
}

export const SongPlayer = {
  play: () => {
    const player = usePlayerStore();
    if (player.playing) {
      return;
    }
    player.setPlaying(true);
    triggerKeys();
  },

  stop: () => {
    stop();
  },

  reset: () => {
    reset();
  },

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
