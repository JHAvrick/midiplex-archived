import { Message } from "webmidi";
import { MidiplexMessage } from "./midiplex-mesasge";

const AllMessageTypes = <const> [
    'noteon',
    'noteoff',
    'polykeypressure',
    'controlchange',
    'programchange',
    'monokeypressure',
    'pitchbend',
    'channelaftertouch',
    'system'
]

const Generate = {
    noteon: (note: number | NoteWithOctave, velocity: number) => {
        if (typeof note === 'string') {
            note = noteToMidi(note);
        }
        return new MidiplexMessage(new Uint8Array([0x90, note, velocity]));
    },
    noteoff: (note: number | NoteWithOctave, velocity: number) => {
        if (typeof note === 'string') {
            note = noteToMidi(note);
        }
        return new MidiplexMessage(new Uint8Array([0x80, note, velocity]));
    },
    controlchange: (cc: number, value: number) => {
        return new MidiplexMessage(new Uint8Array([0xB0, cc, value]));
    },
    programchange: (program: number) => {
        return new MidiplexMessage(new Uint8Array([0xC0, program]));
    },
    polykeypressure: (note: number, pressure: number) => {
        return new MidiplexMessage(new Uint8Array([0xA0, note, pressure]));
    },
    monokeypressure: (pressure: number) => {
        return new MidiplexMessage(new Uint8Array([0xD0, pressure]));
    },
    pitchbend: (value: number) => {
        return new MidiplexMessage(new Uint8Array([0xE0, value]));
    },
    channelaftertouch: (pressure: number) => {
        return new MidiplexMessage(new Uint8Array([0xD0, pressure]));
    },
    system: (data: Uint8Array) => {
        return new MidiplexMessage(data);
    }
}

const pickMessageTypes = (messageTypesToPick: MidiMessageType[]) : MidiMessageType[] => {
    return AllMessageTypes.filter((type) => messageTypesToPick.includes(type));
}

const omitMessageTypes = <T extends MidiMessageType>(messageTypesToOmit: MidiMessageType[]): MidiMessageType[] => {
    return AllMessageTypes.filter((type: MidiMessageType) => !messageTypesToOmit.includes(type));
    // if (result.length === 0) {
    //     throw new Error("Resulting array is empty");
    // }
    // return result;
}

const convertRange = (oldVal: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
    return (((oldVal - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
}

const clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
}

const getProgramChangeMessage = (program: IntRange<0, 128>, channel: IntRange<0, 17> = 0) => {
    return new MidiplexMessage(new Uint8Array([0xC0 + channel, program]));
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteToMidi = (note: string): number => {    
    const octave = parseInt(note.slice(-1));
    const key = note.slice(0, -1);
    const semitone = notes.indexOf(key);
    if (semitone === -1 || octave < -1 || octave > 9) {
        throw new Error('Invalid note format');
    }
    return octave * 12 + semitone + 12; // +12 to adjust for MIDI's note number system (C0 is note number 12)
}

const matchTrigger = (trigger: MidiplexTrigger, m: MidiplexMessage) => {
    if ('test' in trigger) return trigger.test(m);
    switch (true) {
        case trigger.type === 'noteon' && m.type === 'noteon':
            return 'note' in trigger ? trigger.note === m.message.data[1] : true;
        case trigger.type === 'noteoff' && m.type === 'noteoff':
            return 'note' in trigger ? trigger.note === m.message.data[1] : true;
        case trigger.type === 'controlchange' && m.type === 'controlchange':
            if ('cc' in trigger && 'value' in trigger) {
                return trigger.cc === m.message.data[1] && trigger.value === m.message.data[2];
            } else if ('cc' in trigger) {
                return trigger.cc === m.message.data[1];
            } else {
                return true;
            }
        default: return false;
    }   
}

export {
    AllMessageTypes,
    Generate,
    pickMessageTypes,
    omitMessageTypes,
    convertRange,
    getProgramChangeMessage,
    clamp,
    matchTrigger
}