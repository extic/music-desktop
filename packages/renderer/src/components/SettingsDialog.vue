<template>
  <GenericDialog
    ref="genericDialog"
    :modal="true"
    @dialogAppeared="dialogAppeared()"
    @enterPressed="ok()"
    class="settings-dialog"
  >
    <template #dialog-title>
      <span>Settings</span>
    </template>
    <template #dialog-content>
      <div class="sign-in-dialog-content">
        <div class="dialog-content">
          <label for="midi-input-device">MIDI Input Device</label>
          <select
            id="midi-input-device"
            ref="midiInputDevice"
            v-model="midiInputDevice"
            :disabled="availableMidiInputs().length === 0"
          >
            <option
              v-for="input in availableMidiInputs()"
              :key="input.id"
              :value="input"
            >
              {{ input.name }}
            </option>
          </select>

          <label for="midi-output-device">MIDI Output Device</label>
          <select
            id="midi-output-device"
            ref="midiOutputDevice"
            v-model="midiOutputDevice"
            :disabled="availableMidiOutputs().length === 0"
          >
            <option
              v-for="output in availableMidiOutputs()"
              :key="output.id"
              :value="output"
            >
              {{ output.name }}
            </option>
          </select>

          <label for="midi-instrument">Instrument</label>
          <select id="midi-instrument" v-model="midiInstrument">
            <option
              v-for="instrument in availableMidiInstruments()"
              :key="instrument.code"
              :value="instrument"
            >
              {{ instrument.name }}
            </option>
          </select>
          <div class="buttons">
            <button @click="cancel()">Cancel</button>
            <button class="primary" @click="ok()" ref="okButton">Ok</button>
          </div>
        </div>
      </div>
    </template>
  </GenericDialog>
</template>

<script lang="ts">
import { createApp, defineComponent } from "vue";
import GenericDialog, {
  createDialogMountingPoint,
  focusOnModalOnly,
} from "./GenericDialog.vue";
// import { key } from "@/store";
import { ComponentPublicInstance } from "@vue/runtime-core";
import SettingsDialog from "./components/SettingsDialog.vue";
import {
  AvailableMidiInstruments,
  MidiDeviceDescriptor,
  MidiInstrument,
  midiService,
} from "../services/midi-service";

export default defineComponent({
  name: "SettingsDialog",
  components: {
    GenericDialog,
  },

  data() {
    return {
      midiInputDevice: null as MidiDeviceDescriptor | null,
      midiOutputDevice: null as MidiDeviceDescriptor | null,
      midiInstrument: midiService.chosenInstrument,
    };
  },

  mounted() {
    this.midiInputDevice = midiService.selectedInputDescriptor();
    this.midiOutputDevice = midiService.selectedOutputDescriptor();
  },

  methods: {
    availableMidiInputs(): MidiDeviceDescriptor[] {
      return midiService.availableMidiInputNames();
    },

    availableMidiOutputs(): MidiDeviceDescriptor[] {
      return midiService.availableMidiOutputNames();
    },

    availableMidiInstruments(): MidiInstrument[] {
      return AvailableMidiInstruments;
    },

    dialogAppeared() {
      if (this.availableMidiInputs().length > 0) {
        (this.$refs.midiInputDevice as HTMLInputElement).focus();
      } else if (this.availableMidiOutputs().length > 0) {
        (this.$refs.midiOutputDevice as HTMLInputElement).focus();
      } else {
        (this.$refs.okButton as HTMLButtonElement).focus();
      }
    },

    cancel() {
      const genericDialog = this.$refs
        .genericDialog as unknown as typeof GenericDialog;
      genericDialog.close();
    },

    ok() {
      midiService.setSelectedInput(this.midiInputDevice?.id ?? null);
      midiService.setSelectedOutput(this.midiOutputDevice?.id ?? null);
      midiService.setInstrument(this.midiInstrument());

      const genericDialog = this.$refs
        .genericDialog as unknown as typeof GenericDialog;
      genericDialog.close();
    },
  },
});

// export function openSettingsDialog(parent: ComponentPublicInstance): void {
//   createApp(SettingsDialog)
//     .use(parent.$store, key)
//     .mount(createDialogMountingPoint());
//   focusOnModalOnly(".settings-dialog");
// }
</script>

<style lang="scss" scoped>
@import "../styles/variables";
//@import '../styles/mixins';

.sign-in-dialog-content {
  padding: 2em;

  .dialog-content {
    width: 40vw;
    min-width: 20em;
    display: flex;
    flex-direction: column;

    label {
      text-align: left;
      margin-bottom: 0.5em;
    }

    select {
      padding: 0.5em;
      margin-bottom: 2em;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1em;
      margin-top: 1em;

      button {
        border: 1px solid transparent;
        border-radius: 4px;
        font-weight: bold;
        font-size: 1.1em;
        width: 7em;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.2s;
        position: relative;
        text-align: center;
        padding: 0.5em 0;
        white-space: nowrap;

        &.primary {
          color: white;
          background-color: #69ccef;
        }
      }

      .sign-in {
        &:active {
          transform: scale(0.95);
        }

        &:hover {
          background-color: #358cab;
        }
      }
    }
  }

  .dialog-buttons-container {
    margin-top: 2em;
    text-align: right;

    .dialog-button {
      //@include pressable();
      padding: 0.7em 3.5em;
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      margin-left: 1em;
      flex-shrink: 0;
      cursor: pointer;

      &.ok {
        background: linear-gradient(100deg, #ddd, #e6e6e6);
        color: white;
      }
    }
  }

  *:focus {
    outline: none;
    border: 1px solid #654b72 !important;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @keyframes progress-rotation {
    12.5% {
      transform: rotateZ(45deg);
    }
    25% {
      transform: rotateZ(90deg);
    }
    37.5% {
      transform: rotateZ(135deg);
    }
    50% {
      transform: rotateZ(180deg);
    }
    62.5% {
      transform: rotateZ(225deg);
    }
    75% {
      transform: rotateZ(270deg);
    }
    87.5% {
      transform: rotateZ(315deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
</style>
