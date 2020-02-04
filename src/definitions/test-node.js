export default {
    name: "TestNode",
    baseNodeClass: "filter",
    props: {
        number: {
            label: "Number Field",
            type: "number",
            value: 34
        },
        string: {
            label: "String Field",
            type: "string",
            value: "G9"
        },
        boolean: {
            label: "Boolean Field",
            type: "boolean",
            value: true
        },
        trigger: {
            label: "Trigger Value",
            type: "number",
            min: 0,
            max: 127,
            value: 64
        },
        dropdown: {
            label: "Dropdown",
            type: "select",
            value: 1,
            options: [
                { name: "Option 1", value: 1 },
                { name: "Option 2", value: 2 },
                { name: "Option 3", value: 3 }
            ]
        }
    },
    receive: function(params){
        let send = params.send;
        let message = params.message;
        send(message);
    }
}