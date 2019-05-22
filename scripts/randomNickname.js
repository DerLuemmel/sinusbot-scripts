registerPlugin({
    name: "Random Nickname",
    version: "1.0",
    engine: '>= 0.9.16',
    description: "Das Script wechselt den Nicknamen nach einer bestimmten Zeit. Dabei wird ein zufälliger Name vom Server genutzt.",
    author: "Luemmel",
    vars: {
        enableSwitch: {
            title: "Script aktivieren?", type: "select", options: ["Nein", "Ja"]
        }, pre_modus: {
            title: "Textmodus?", type: "select", options: ["Danach", "Davor"]
        }, pre_string: {
            title: "Text davor/danach",
            type: "string",
            placeholder: "Bot"
        }, customNicks: {
            title: "Nicknames Liste",
            type: "string",
            placeholder: "Mit Komma getrennt. Zum Beispiel: BOT 1,BOT 2,BOT 3"
        }, delayTime: {            
            title: "Zeit zum Wechseln in Sekunden",
            type: "number",
            placeholder: "Wechsel den Namen alle... (Standard: 1 Sekunde)."
        }
    }    
}, function (sinusbot, config) {
    var engine = require('engine');
    var backend = require('backend');
    var event = require('event');
    var minimumDelay = 1; 
    
    if (typeof config.enableSwitch == "undefined") {
        config.enableSwitch = false;
    }    
    if (config.pre_string === "") {
        config.pre_string = "Bot";
    }    
    if (typeof config.pre_modus == "undefined") {
        config.pre_modus = true;
    }
    if (typeof config.delayTime == "undefined") {
        config.delayTime = 1;
    } else if (config.delayTime < minimumDelay) {
        config.delayTime = 1;
    }
    if (typeof config.customNicks == "undefined") {
        return;
    }
    
    var intervalN = setInterval(nickChange, config.delayTime*1000);    

    function nickChange() {
        if (!config.enableSwitch) return;
        var clients = backend.getClients();
        var client_names = []
        clients.forEach(function(client) {
            client_names.push(client.name());
        });
        
        var random_name = "";
        var random_length = "";
        
        if(clients.length < 10){
            var nickArr = config.customNicks.split(",");
            random_name = nickArr[Math.floor(Math.random() * nickArr.length)];
            engine.setNick(random_name);
            return;
        }
        
        random_name = client_names[Math.floor(Math.random() * client_names.length)];
        random_length = random_name+" "+config.pre_string;
        
        while(random_length.length > 30){
            random_name = client_names[Math.floor(Math.random() * client_names.length)];   
            random_length = random_name+" "+config.pre_string;
        }
        
        if (config.pre_modus == true){
            engine.setNick(config.pre_string +" "+ random_name);
        }else{
            engine.setNick(random_name +" "+ config.pre_string);
        }
        
    }
});