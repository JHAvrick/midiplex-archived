import { expect, test } from '@jest/globals';
import { Util } from './util';

describe('Util', () => {
    test('Util.Message.create()', (done) => {
        let m = Util.Message.create(new Uint8Array([0x90, 84, 64]), 5);
        expect(m.type).toBe('noteon'); 
        expect(m.channel).toBe(5); //Channel
        expect(m.data[1]).toBe(84); //Note number
        expect(m.data[2]).toBe(64); //Velocity
        done();
    });

    test('Util.Generate.noteon()', (done) => {
        let m = Util.Generate.noteon('D5', 127, 12);
        expect(m.type).toBe('noteon'); 
        expect(m.channel).toBe(12); 
        expect(m.data[1]).toBe(74); //Note number
        expect(m.data[2]).toBe(127); //Velocity
        done();
    });

    test('Util.Generate.noteoff()', (done) => {
        let m = Util.Generate.noteoff('C6', 127, 16);
        expect(m.type).toBe('noteoff');
        expect(m.channel).toBe(16);
        expect(m.data[1]).toBe(84); //Note number
        expect(m.data[2]).toBe(127); //Velocity
        done();
    });

    test('Util.Generate.controlchange()', (done) => {
        let m = Util.Generate.controlchange(43, 23, 14);
        expect(m.type).toBe('controlchange');
        expect(m.channel).toBe(14);
        expect(m.data[2]).toBe(23);
        done();
    });

    test('Util.Generate.keyaftertouch()', (done) => {
        let m = Util.Generate.keyaftertouch('A2', 23, 3);
        expect(m.type).toBe('keyaftertouch');
        expect(m.channel).toBe(3);
        expect(m.data[1]).toBe(45);
        expect(m.data[2]).toBe(23);
        done();
    });

    test('Util.Generate.programchange()', (done) => {
        let m = Util.Generate.programchange(23, 20);
        expect(m.type).toBe('programchange');
        expect(m.channel).toBe(16); //Channel out or range, expect to clamp to 16
        expect(m.data[1]).toBe(23);
        done();
    });

    test('Util.Generate.pitchbend()', (done) => {
        let m = Util.Generate.pitchbend(150, -15);
        expect(m.type).toBe('pitchbend');
        expect(m.channel).toBe(1); //Channel out or range, expect to clamp to 1
        expect(m.data[1]).toBe(150);
        done();
    });

    test('Util.Generate.channelaftertouch()', (done) => {
        let m = Util.Generate.channelaftertouch(23);
        expect(m.type).toBe('channelaftertouch');
        expect(m.channel).toBe(1);
        expect(m.data[1]).toBe(23);
        done();
    });
})