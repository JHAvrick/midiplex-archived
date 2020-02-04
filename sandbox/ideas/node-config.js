{
    id: "28ryaw7f",
    name: "HoldNode",
    properties: [
        { tempo: 140 }
    ],
    "events": [
        {
            type: "note",
            device: "test-input-device",
            trigger: "C#2",
            action: {
                setMuted: true,
                setProperty:{
                    "tempo": 100
                }
            }
        },
        {
            "type": "note", 
            "trigger": "C#2",
            "deviceId": "3398fh23",
            "actions": {
                "setProperty": {
                    
                }
            }
        },
        {
            "type": "timestamp",
            "trigger": "00:2:30",
            "action": {
                "modifyProperty": {
                    "bypass": true
                }
            }
        }
    ],
    "nodeIn": ["2980rag9u43", "q4q90fy7wf"],
    "nodeOut": ["q-8498fj", "4q93f0w9pefo"]
}