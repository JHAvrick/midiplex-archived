import hotkeys from 'hotkeys-js';
import { MidiPlex } from 'src/midiplex';
const { dialog } = require('electron').remote;

hotkeys('ctrl+f, cmd+f', function(event, handler){
  event.preventDefault() 
  console.log("Toggle Clock State");
  if (!MidiPlex.clock.active) MidiPlex.clock.start();
  else MidiPlex.clock.stop();
});

hotkeys('ctrl+s, cmd+s', function(event, handler){
  event.preventDefault() 
  if (!MidiPlex.getMeta("projectPath")){
    let savePath = dialog.showSaveDialogSync();
    if (savePath && savePath[0]){
      MidiPlex.writeProject(savePath.concat(".json"));
    }
    return;
  }
  
  MidiPlex.writeProject(MidiPlex.meta.get("projectPath"));
});

hotkeys();