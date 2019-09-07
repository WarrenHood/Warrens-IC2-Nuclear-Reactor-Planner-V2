// TODO: DOUBLE CHECK THIS WHEN YOU ARE AWAKE... You were writing this code at 4:42 in the morning...

// Abstract Reactor Component class

function AbstractReactorComponent() {
    var ClassAbstractReactorComponent = {};
    
    ClassAbstractReactorComponent.processChamber = function(reactor, x, y, heatrun) {
        
    }
    
    ClassAbstractReactorComponent.acceptUraniumPulse = function(reactor, youX, youY, pulseX, pulseY, heatrun) {
        return false;
    }
    
    ClassAbstractReactorComponent.canStoreHeat = function(reactor, x, y) {
        return false;
    }
    
    ClassAbstractReactorComponent.getMaxHeat = function(reactor, x, y) {
        return 0;
    }
    
    ClassAbstractReactorComponent.getCurrentHeat = function(reactor, x, y) {
        return 0;
    }
    
    ClassAbstractReactorComponent.alterHeat = function(reactor, x, y, heat) {
        return heat;
    }
    
    ClassAbstractReactorComponent.influenceExplosion = function(reactor) {
        return 0.0;
    }
    
    return ClassAbstractReactorComponent;
}



// ItemGradualInt class

function ItemGradualInt(maxDamage) {
    var ClassItemGradualInt = {};
    
    
    // TODO: Check this later
    ClassItemGradualInt.damage = 0;
    
    
    ClassItemGradualInt.maxDamage = maxDamage;
    
    ClassItemGradualInt.isDamageable = function() {return true;}
    
    ClassItemGradualInt.isDamaged = function() {return this.getDamage() > 0;}
    
    ClassItemGradualInt.getDamage = function() {return this.damage;}
    
    ClassItemGradualInt.getMaxDamage = function() {return this.maxDamage;}
    
    ClassItemGradualInt.setDamage = function(damage) {this.damage = damage;}
    
    ClassItemGradualInt.applyDamage = function(damage) {
        this.setDamage(this.getDamage() + damage);
        return true;
    }
    
    return ClassItemGradualInt;
}



// Abstract Damageable Reactor Component

function AbstractDamageableReactorComponent( maxDamage){
    
    var ClassAbstractDamageableReactorComponent = ItemGradualInt(maxDamage);
    
    ClassAbstractDamageableReactorComponent.processChamber = function(reactor, x, y, heatrun) {
        
    }
    
    ClassAbstractDamageableReactorComponent.acceptUraniumPulse = function(reactor, youX, youY, pulseX, pulseY, heatrun){
        return false;
    }
    
    ClassAbstractDamageableReactorComponent.canStoreHeat = function(name, reactor, x, y) {
        return false;
    }
    
    ClassAbstractDamageableReactorComponent.getMaxHeat = function() {
        return 0;
    }
    
    ClassAbstractDamageableReactorComponent.getCurrentHeat = function() {
        return 0;
    }
    
    ClassAbstractDamageableReactorComponent.alterHeat = function() {
        return heat;
    }
    
    ClassAbstractDamageableReactorComponent.influenceExplosion = function(reactor) {
        return 0.0;
    }
    
    return ClassAbstractDamageableReactorComponent;
}



// ReactorHeatStorageClass

function ItemReactorHeatStorage(heatStorage) {
    var ClassItemReactorHeatStorage = AbstractDamageableReactorComponent(heatStorage);
    

    ClassItemReactorHeatStorage.getMaxHeat = function() {
        return this.getMaxDamage();
    }
    
    ClassItemReactorHeatStorage.getCurrentHeat = function() {
        return this.getDamage();
    }
    
    ClassItemReactorHeatStorage.alterHeat = function(reactor, x, y, heat) {
        
        var myHeat = this.getCurrentHeat();
        myHeat += heat;
        
        var maxHeat = this.getMaxHeat();
        
        if (myHeat > maxHeat) {
            reactor.setItemAt(x, y, null);
            heat = maxHeat - myHeat + 1;
        }
        else {
            if (myHeat < 0) {
                heat = myHeat;
                myHeat = 0;
            }
            else {
                heat = 0;
            }
            this.setDamage(myHeat);
        }
        return heat;
    }
    
    ClassItemReactorHeatStorage.canStoreHeat = function( name, reactor, x, y) {
        return true;
    }
    
    
    
    return ClassItemReactorHeatStorage;
}



// Reactor class

function Reactor(){
    
    var ClassReactor = {};
    ClassReactor.reactorSize = 9;
    ClassReactor.lastOutput = 0.0;
    ClassReactor.output = 0.0;
    ClassReactor.heat = 0;
    ClassReactor.maxHeat = 10000;
    ClassReactor.hem = 1.0;
    ClassReactor.EmitHeatBuffer = 0;
    ClassReactor.EmitHeat = 0;
    ClassReactor.fluidCooled = false;
    ClassReactor.addedToEnergyNet = false;
    ClassReactor.reactorSlot = [];
    
    ClassReactor.setItemAt = function(x, y, comp) {
        this.reactorSlot[x+9*y] = comp;
    }
    
    ClassReactor.getCoreTe = function() {
        return this;
    }
    
    ClassReactor.getHeat = function() {
        return this.heat;
    }
    
    ClassReactor.setHeat = function(heat) {
        this.heat = heat;
    }
    
    ClassReactor.addHeat = function(amount){
        this.heat += amount;
        return amount;
    }
    
    ClassReactor.getItemAt = function(x, y) {
        if (x < 0 || x >= this.getReactorSize() || y < 0 || y >= 6) {
            return null;
        }
        
        return this.reactorSlot[x + y*this.getReactorSize()];
    }
    
    ClassReactor.explode = function() {
        boomPower = 10.0;
        boomMod = 1.0;
        this.exploded = true;
        
        for (var i=0; i<this.reactorSlot.length; i++) {
            var comp = this.reactorSlot[i];
            if (comp){
                var f = comp.influenceExplosion(this);
                if (f > 0.0 && f < 1.0) {
                    boomMod *= f;
                }
                else {
                    boomPower += f;
                }
                
            }
            //this.reactorSlot[i] = null;
        }
        boomPower *= this.hem * boomMod;
        console.log("Nuclear Reactor melted (raw explosion power " + boomPower + ")");
        
    }
    
    ClassReactor.addEmitHeat = function(heat) {
        this.EmitHeatBuffer += heat;
    }
    
    ClassReactor.getMaxHeat = function() {
        return this.maxHeat;
    }
    
    ClassReactor.setMaxHeat = function(newMaxHeat){
        this.maxHeat = newMaxHeat;
    }
    
    ClassReactor.getHeatEffectModifier = function() {
        return this.hem;
    }
    
    ClassReactor.setHeatEffectModifier = function(newHEM) {
        this.hem = newHEM;
    }
    
    ClassReactor.getReactorEnergyOutput = function() {
        return this.output;
    }
    
    ClassReactor.addOutput = function(energy) {
        this.output += energy;
        return this.output;
    }
    
    ClassReactor.isFluidCooled = function() {
        return this.fluidCooled;
    }
    
    ClassReactor.gaugeHeatScaled = function(i) {
        return i * this.heat / (this.maxHeat / 100 * 85);
    }
    
    ClassReactor.processChambers = function(){
        if (this.exploded) return;
        var size = this.getReactorSize();
        for (var pass = 0; pass < 2; pass++) {
            for (var y=0; y<6; y++) {
                for (var x=0; x < size; x++) {
                    var comp = this.reactorSlot[x+size*y];
                    
                    // If there is a component there
                    if (comp) {
                        comp.processChamber(this, x, y, pass == 0);
                    }
                }
            }
        }
        
        if (this.heat >= this.maxHeat) this.explode();
    }
    
    
    ClassReactor.getReactorSize = function() {
        return this.reactorSize;
    }
    
    ClassReactor.getTickRate = function() {
        return 20;
    }
    
    
    
    return ClassReactor;
}



// Uranium class

function Uranium(cells, duration){
    
    duration = duration || 20000;
    
    var ClassUranium = AbstractDamageableReactorComponent( duration);
    
    ClassUranium.numberOfCells = cells;
    
    ClassUranium.processChamber = function(reactor, x, y, heatRun) {
        
        var basePulses = 1 + Math.floor(this.numberOfCells/2);
        for (var iteration = 0; iteration < this.numberOfCells; iteration++) {
            var pulses = basePulses;
            if (!heatRun) {
                for (var i=0; i < pulses; i++) {
                    this.acceptUraniumPulse(reactor, x, y, x, y, heatRun);
                }
                pulses += this.checkPulseable(reactor, x-1, y, x, y, heatRun) + this.checkPulseable(reactor, x+1, y, x, y,heatRun) + this.checkPulseable(reactor, x, y-1, x, y, heatRun) + this.checkPulseable(reactor, x, y+1, x, y, heatRun);
            }
            else {
                pulses += this.checkPulseable(reactor, x - 1, y, x, y, heatRun) + this.checkPulseable(reactor, x + 1, y, x, y, heatRun) + this.checkPulseable(reactor, x, y - 1, x, y, heatRun) + this.checkPulseable(reactor, x, y + 1, x, y, heatRun);
                
                var heat = this.triangularNumber(pulses)*4;
                heat = this.getFinalHeat(reactor, x, y, heat);
                
                var heatAcceptors = [];
                this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
                this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
                
                while (heatAcceptors.length > 0 && heat > 0) {
                    var dheat = heat / heatAcceptors.length;
                    heat -= dheat;
                    dheat = heatAcceptors[0].alterHeat(reactor, heatAcceptors[0].x, heatAcceptors[0].y, dheat);
                    heatAcceptors.shift();
                    heat += dheat;
                }
                if (heat > 0) {
                    reactor.addHeat(heat);
                }
               
            }
        }
        if (!heatRun && this.getDamage() >= this.getMaxDamage()-1) reactor.setItemAt(x,y, null);
        else if (!heatRun) {
            this.applyDamage(1);
        }
        
    }
    
    ClassUranium.getFinalHeat = function(reactor, x, y, heat) {
        return heat;
    }
    
    ClassUranium.checkPulseable = function(reactor, x, y, mex, mey, heatrun) {
        var other = reactor.getItemAt(x,y);
        if (other && other.acceptUraniumPulse(reactor, x, y, mex, mey, heatrun)) {
            return 1;
        }
        return 0;
    }
    
    ClassUranium.triangularNumber = function(x) {
        return (x * x + x) / 2;
    }
    
    ClassUranium.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
        if (reactor.getItemAt(x,y) && reactor.getItemAt(x,y).canStoreHeat() ) {
            var comp = reactor.getItemAt(x,y);
            comp.x = x;
            comp.y = y;
            heatAcceptors.push(comp);
        }
    }
    
    ClassUranium.acceptUraniumPulse = function(reactor, youX, youY, pulseX, pulseY, heatrun) {
        if (!heatrun) {
            reactor.addOutput(1.0);
        }
        
        return true;
    }
    
    ClassUranium.influenceExplosion = function(reactor) {
        return 2.0 * this.numberOfCells;
    }
    
    return ClassUranium;
}


// Mox class

function Mox(cells, duration){
    
    duration = duration || 10000;
    
    var ClassMox = Uranium(cells, duration);
    
    ClassMox.acceptUraniumPulse = function(reactor, youX, youY, pulseX, pulseY, heatrun) {
        if (!heatrun) {
            var breederEffectiveness = reactor.getHeat() / reactor.getMaxHeat();
            reactorOutput = 4.0 * breederEffectiveness + 1.0;
            reactor.addOutput(reactorOutput);
        }
        return true;
    }
    
    
    return ClassMox;
}

// Heat vent class

function HeatVent(heatStorage, selfVent, reactorVent) {
    var ClassHeatVent = ItemReactorHeatStorage(heatStorage);
    
    ClassHeatVent.selfVent = selfVent;
    ClassHeatVent.reactorVent = reactorVent;
    
    ClassHeatVent.processChamber = function(reactor, x, y, heatrun) {
        if (heatrun) {
            if (this.reactorVent > 0) {
                var reactorDrain = reactor.getHeat();
                var rheat = reactorDrain;
                if (reactorDrain > this.reactorVent) {
                    reactorDrain = this.reactorVent;
                }
                
                rheat -= reactorDrain;
                reactorDrain = this.alterHeat(reactor, x, y, reactorDrain);
                if (reactorDrain > 0) {
                    return;
                }
                reactor.setHeat(rheat);
            }
            var self = this.alterHeat(reactor, x, y, -this.selfVent);
            if (self <= 0) {
                reactor.addEmitHeat(self + this.selfVent);
            }
        }
    }
    
    
    return ClassHeatVent;
}

// Component heat vent class (Yes the component heat vent is a special little guy he even gets his own stupid little class)

function ComponentHeatVent(sideVent) {
    var ClassComponentHeatVent = AbstractReactorComponent();
    
    ClassComponentHeatVent.sideVent = sideVent;
    
    ClassComponentHeatVent.processChamber = function(reactor, x, y, heatrun) {
        if (heatrun) {
            this.cool(reactor, x - 1, y);
            this.cool(reactor, x + 1, y);
            this.cool(reactor, x, y - 1);
            this.cool(reactor, x, y + 1);
        }
    }
    
    ClassComponentHeatVent.cool = function(reactor, x, y) {
        var comp = reactor.getItemAt(x,y);
        if (comp && comp.canStoreHeat(reactor, x, y) ) {
            var self = comp.alterHeat(reactor, x, y, -this.sideVent);
            if (self <= 0) {
                reactor.addEmitHeat(self + this.sideVent);
            }
        }
    }
    
    return ClassComponentHeatVent;
}

// Heat exchanger class

function HeatExchanger(heatStorage, switchside, switchreactor) {
    var ClassHeatExchanger = ItemReactorHeatStorage(heatStorage);
    
    ClassHeatExchanger.switchSide = switchside;
    ClassHeatExchanger.switchReactor = switchreactor;
    
    ClassHeatExchanger.processChamber = function(reactor, x, y, heatrun) {
        if (!heatrun) return;
        
        var myHeat = 0;
        var heatAcceptors = [];
        if (this.switchSide > 0) {
            this.checkHeatAcceptor(reactor, x - 1, y, heatAcceptors);
            this.checkHeatAcceptor(reactor, x + 1, y, heatAcceptors);
            this.checkHeatAcceptor(reactor, x, y - 1, heatAcceptors);
            this.checkHeatAcceptor(reactor, x, y + 1, heatAcceptors);
        }
        if (this.switchSide > 0) {
            for (var i=0; i<heatAcceptors.length; i++) {
                var heatable = heatAcceptors[i];
                var mymed = this.getCurrentHeat(reactor, x, y) * 100.0 / this.getMaxHeat(reactor, x, y);
                var heatablemed = heatable.getCurrentHeat(reactor, heatable.x, heatable.y) * 100.0 / heatable.getMaxHeat(reactor, heatable.x, heatable.y);
                var add = Math.floor(heatable.getMaxHeat(reactor, heatable.x, heatable.y) / 100 * (heatablemed + mymed / 2.0) );
                if (add > this.switchSide) {
                    add = this.switchSide;
                }
                if (heatablemed + mymed / 2.0 < 1.0) {
                    add = this.switchSide / 2;
                }
                if (heatablemed + mymed / 2.0 < 0.75) {
                    add = this.switchSide / 4;
                }
                if (heatablemed + mymed / 2.0 < 0.5) {
                    add = this.switchSide / 8;
                }
                if (heatablemed + mymed / 2.0 < 0.25) {
                    add = 1;
                }
                if (Math.round(heatablemed * 10.0) / 10.0 > Math.round(mymed * 10.0) / 10.0) {
                    add -= 2*add;
                }
                else if (Math.round(heatablemed * 10.0) / 10.0 == Math.round(mymed * 10.0) / 10.0) {
                    add = 0;
                }
                myHeat -= add;
                add = heatable.alterHeat(reactor, heatable.x, heatable.y, add);
                myHeat += add;
            }
        }
        if (this.switchReactor > 0) {
            var mymed2 = this.getCurrentHeat(reactor, x, y) * 100 / this.getMaxHeat(reactor, x, y);
            var reactorMed = reactor.getHeat() * 100.0 / reactor.getMaxHeat();
            var add2 = Math.floor(Math.round(reactor.getMaxHeat() / 100.0 * (reactorMed + mymed2 / 2.0)));
            if (add2 > this.switchReactor) {
                add2 = this.switchReactor;
            }
            
            if (reactorMed + mymed2 / 2.0 < 1.0) {
                add2 = this.switchSide / 2;
            }
            if (reactorMed + mymed2 / 2.0 < 0.75) {
                add2 = this.switchSide / 4;
            }
            if (reactorMed + mymed2 / 2.0 < 0.5) {
                add2 = this.switchSide / 8;
            }
            if (reactorMed + mymed2 / 2.0 < 0.25) {
                add2 = 1;
            }
            if (Math.round(reactorMed * 10.0) / 10.0 > Math.round(mymed2 * 10.0) / 10.0) {
                add2 -= 2 * add2;
            }
            else if (Math.round(reactorMed * 10.0) / 10.0 == Math.round(mymed2 * 10.0) / 10.0) {
                add2 = 0;
            }
            myHeat -= add2;
            reactor.setHeat(reactor.getHeat() + add2);
        }
        this.alterHeat(reactor, x, y, myHeat);
    }
    
    ClassHeatExchanger.checkHeatAcceptor = function(reactor, x, y, heatAcceptors) {
        var comp = reactor.getItemAt(x,y);
        if (comp && comp.canStoreHeat(reactor, x, y)) {
            comp.x = x;
            comp.y = y;
            heatAcceptors.push(comp);
        }
    }
    
    
    
    
    return ClassHeatExchanger;
}


// Cooling Cell class

function CoolingCell(){
    var ClassCoolingCell = {};
    
    
    
    
    
    return ClassCoolingCell;
}

// Condensator class


function Condensator(){
    var ClassCondensator = {};
    
    
    
    return ClassCondensator;
}



function TEST(){
    reactor = Reactor();
    for (var x=0; x < 9; x++)
        for (var y=0; y < 6; y++)
            reactor.setItemAt(x, y,null);
    reactor.setItemAt(0,0, makeComponent("fuel-uranium-dual"));
    reactor.setItemAt(5,1, makeComponent("heat-exchanger-reactor"));
    reactor.setItemAt(5,0, makeComponent("heat-vent-component"));
    reactor.setItemAt(5,2, makeComponent("heat-vent-component"));
    reactor.setItemAt(4,1, makeComponent("heat-vent-component"));
    reactor.setItemAt(6,1, makeComponent("heat-vent-component"));
    var totalPower = 0;
    for(var tick=0; tick < 5000; tick++){
        reactor.processChambers();
        totalPower = reactor.getReactorEnergyOutput()*100;
        if(reactor.exploded) {
            tick++;
            console.log("Reactor exploded after " + (tick) + " seconds...");
            break;
        }
    }
    console.log(totalPower + " EU after 1000 sec");
    console.log("AVG: " + totalPower / (tick*20) + " EU/t")
    
}



var IC2components = {
    "fuel-uranium-single" : function(){return Uranium(1);}, // Tested, works
    "fuel-uranium-dual" : function(){return Uranium(2);}, // Tested, works
    "fuel-uranium-quad" : function(){return Uranium(4);}, // Tested, works
    "fuel-mox-single" : function(){return Mox(1)},
    "fuel-mox-dual" : function(){return Mox(2)},
    "fuel-mox-quad" : function(){return Mox(4)},
    "heat-vent" : function(){return HeatVent(1000,6,0);}, // Tested, works
    "heat-vent-advanced" : function(){return HeatVent(1000,12,0);}, // Tested, works
    "heat-vent-reactor" : function(){return HeatVent(1000,5,5);}, // Tested, works
    "heat-vent-overclocked" : function(){return HeatVent(1000,20,36);}, // Tested, works
    "heat-vent-component" : function(){return ComponentHeatVent(4)}, // Tested, works
    "heat-exchanger" : function(){return HeatExchanger(2500, 12, 4)},
    "heat-exchanger-advanced" : function(){return HeatExchanger(10000, 24, 8)},
    "heat-exchanger-reactor" : function(){return HeatExchanger(5000, 0, 72)}, // Tested, works
    "heat-exchanger-component" : function(){return HeatExchanger(5000, 36, 0)},
}

function makeComponent(name) {
    if (name.length < 1){
        alert(name + " is not yet available for use and will be ignored");
        return function(){return null;};
        
    }
    return IC2components[name]();
}
// reactor.getReactor()*100; Will give the total EU generated after n seconds where n = number of reactor.processChambers() calls.


// GUI LOGIC BELOW




var currentGridModifier = "panel-cell";
var mouseIsDown = false;
var indicator = null;
var simulationTime = 0;
var reactorHullHeat = 0;
var totalPower = 0;
var lastPower = 0;
var exploded = false;
var reactor;
var reactorGrid = [];

// For heat tracking
var heatTrackers = [];

var currentInterval = null;

var componentCodes = {
    "fuel-uranium-single" : "a",
    "fuel-uranium-dual" : "b",
    "fuel-uranium-quad" : "c",
    "fuel-mox-single" : "d",
    "fuel-mox-dual" : "e",
    "fuel-mox-quad" : "f",
    "heat-vent" : "g",
    "heat-vent-reactor" : "h",
    "heat-vent-advanced" : "i",
    "heat-vent-component" : "j",
    "heat-vent-overclocked" : "k",
    "heat-exchanger" : "l",
    "heat-exchanger-advanced" : "m",
    "heat-exchanger-reactor" : "n",
    "heat-exchanger-component" : "o",
    "coolant-cell-10k" : "p",
    "coolant-cell-30k" : "q",
    "coolant-cell-60k" : "r",
    "condensator-rsh" : "s",
    "condensator-lzh" : "t",
}

var componentNames = {
    "a" : "fuel-uranium-single",
    "b" : "fuel-uranium-dual",
    "c" : "fuel-uranium-quad",
    "d" : "fuel-mox-single",
    "e" : "fuel-mox-dual",
    "f" : "fuel-mox-quad",
    "g" : "heat-vent",
    "h" : "heat-vent-reactor",
    "i" : "heat-vent-advanced",
    "j" : "heat-vent-component",
    "k" : "heat-vent-overclocked",
    "l" : "heat-exchanger",
    "m" : "heat-exchanger-advanced",
    "n" : "heat-exchanger-reactor",
    "o" : "heat-exchanger-component",
    "p" : "coolant-cell-10k",
    "q" : "coolant-cell-30k",
    "r" : "coolant-cell-60k",
    "s" : "condensator-rsh",
    "t" : "condensator-lzh",
    "0" : ""
}



function getReactorCode(){
    document.getElementById("wrcode").value = _getReactorCode();
}

function loadReactorCode(){
    var code = document.getElementById("wrcode").value.trim();
    if(code.length != 54) return
    _loadReactorCode(code);
}

function _getReactorCode(){
    var code = "";
    for (var i=0; i<reactorGrid.length; i++)
        if(componentCodes[reactorGrid[i].element.className.replace("panel-cell","").trim()])
            code += componentCodes[reactorGrid[i].element.className.replace("panel-cell","").trim()];
        else code += "0"
    return code;
}

function _loadReactorCode(code){
    for(var i=0; i<reactorGrid.length; i++)
        reactorGrid[i].element.className = "panel-cell " + componentNames[code[i]];
    
    initialiseGrid();
}

var descriptions = {
    "fuel-uranium-single" : {
        "title": "Uranium Rod",
        "description": "A single uranium cell produces 5 EU/t (10 EU/t if next to 1 Uranium Cell, 15 EU/t if next to 2 Uranium Cells, etc.) generating a total of 1-5 million EU per cycle (2 hours and 47 minutes real time)"
    },
    "fuel-uranium-dual" : {
        "title": "Dual Uranium Rod",
        "description": "Dual uranium cells act like two single uranium cells next to each other. They generate 4x the energy that a single uranium cell produces at the cost of generating 6x the heat at 24hU/s. "
    },
    "fuel-uranium-quad" : {
        "title": "Quad Uranium Rod",
        "description": "These cells produce (alone) 60 EU/t, and 96 Heat/t. It also sends 4 Neutron Pulses to each adjacent component. They otherwise function like a normal Uranium Cell. Each cell has a life of 4000s. "
    },
    "fuel-mox-single" : {
        "title": "Mox Rod",
        "description": "A single mox rod."
    },
    "fuel-mox-dual" : {
        "title": "Dual Mox Rod",
        "description": "A dual mox rod."
    },
    
}

function showDescription(description){
    document.getElementById("info-panel-title").innerHTML = descriptions[description].title;
    document.getElementById("info-panel").innerHTML = descriptions[description].description;
    document.getElementById("info").style.visibility = "visible";
}

function removeGridModifier(){
    currentGridModifier = "panel-cell";
    indicator.className = currentGridModifier;
}

function GridItem(x,y,element){
        var o = {};
        o.x = x;
        o.y = y;

        // Do event handling
        o.element = element;
        o.element.onmouseover = function(e){
            if(mouseIsDown){
                this.className = currentGridModifier;
                if(currentInterval)
                    clearInterval(currentInterval);
                currentInterval = null;
                initialiseGrid();
            }
        };
        
        o.element.onmousedown = function(e){
            e = e || event;
            if(e.button == 0){
                this.className = currentGridModifier;
                if(currentInterval)
                    clearInterval(currentInterval);
                currentInterval = null;
                initialiseGrid();
            }
        };
        return o;
}

function initialiseGrid(){
    reactorHullHeat = 0;
    simulationTime = 0;
    totalPower = 0;
    lastPower = 0;
    exploded = false;
    reactor = Reactor();
    heatTrackers = [];
    
    var fakeReactor = Reactor();
    
    for(var i=0; i<reactorGrid.length; i++){
        var currentName = reactorGrid[i].element.className.replace("panel-cell","").trim();
        if (currentName.length > 0) {
            fakeReactor.reactorSlot.push(makeComponent(currentName));
            reactor.reactorSlot.push(makeComponent(currentName));
            heatTrackers.push(reactor.reactorSlot[i]);
        }
        else {
            fakeReactor.reactorSlot.push(null);
            reactor.reactorSlot.push(null);
            heatTrackers.push(null);
        }
    }
    
    // Calculate EU Production using fake reactor
    fakeReactor.processChambers();
    var EUGen = fakeReactor.getReactorEnergyOutput() * 5;

    document.getElementById("heat-indicator").innerHTML = Math.round(reactorHullHeat,5) + " HU (" +Math.round(reactorHullHeat/100,5) + "%)";
    document.getElementById("power-indicator").innerHTML = EUGen + " EU/t";
    document.getElementById("power-total-indicator").innerHTML = "0 EU";
    document.getElementById("time-indicator").innerHTML = simulationTime + " seconds";
    getReactorCode();
    for(var i=0; i<reactorGrid.length; i++){
        reactorGrid[i].element.style.backgroundColor = "#8b8b8b";
    }
}

function clearGrid(){
    if(currentInterval)
            clearInterval(currentInterval);
        currentInterval = null;
    
    for(var i=0; i<reactorGrid.length; i++){
        reactorGrid[i].element.className = "panel-cell";
        reactorGrid[i].element.style.backgroundColor = "#8b8b8b";
    }
    initialiseGrid();
}

function showHeat(){
    for(var i=0; i<heatTrackers.length; i++) {
        var comp = heatTrackers[i];
        if(comp && comp.canStoreHeat()) {
            var red = 255*comp.getCurrentHeat()/comp.getMaxHeat();
            var green = 255*(1-comp.getCurrentHeat()/comp.getMaxHeat());
            if(comp.getCurrentHeat() < comp.getMaxHeat())
                reactorGrid[i].element.style.backgroundColor = "rgba("+red+","+green+",0.1)";
            else 
                reactorGrid[i].element.style.backgroundColor = "black";
        }
    }
}

function doReactorTick(){

    if(exploded) return;
   
    // Do heat and power generation
    reactor.processChambers();
    
    // Get the total and increase in power for display
    totalPower = reactor.getReactorEnergyOutput()*100;
    EUGen = Math.round(totalPower - lastPower)/20;
    
    if (EUGen == 0) return;
    lastPower = totalPower;
    document.getElementById("power-indicator").innerHTML = Math.round(EUGen,3) + " EU/t";
    document.getElementById("power-total-indicator").innerHTML = Math.round(totalPower,3) + "EU";
    
    // Check the reactor heat
    reactorHullHeat = reactor.getHeat();
    document.getElementById("heat-indicator").innerHTML = Math.round(reactorHullHeat,5) + " HU (" +Math.round(reactorHullHeat/100,5) + "%)";
    
   
    simulationTime += 1;
    document.getElementById("time-indicator").innerHTML = simulationTime + " seconds";
    showHeat();
    
    if(reactorHullHeat >= 10000 || simulationTime >= 20000){
        if(reactorHullHeat >= 10000) exploded = true;
        if(currentInterval) clearInterval(currentInterval);
        return;
    }
}

function setGridModifierHandler(element){
    element.onclick = function(e){
        e = e || event;
        currentGridModifier = this.className;
        indicator.className = currentGridModifier;
    }
    element.onmouseenter = function(e){
        showDescription(this.className.replace("panel-cell ",""));
    }
    element.onmouseleave = function(e){
        e = e || event;
        document.getElementById("info").style.visibility = "hidden";
    }
    
}


window.onload = function(){
    indicator = document.getElementById("indicator");
    
    window.onmousemove = function(e){
        e = e || event;
        indicator.style.left = e.clientX - 18 + "px"
        indicator.style.top = e.clientY - 18 + "px";
    }
    
    document.oncontextmenu = function(){
        return false;
    }
    
    window.onmousedown = function(e){
        e = e || event;
        if (e.button == 0) {
            mouseIsDown = true;
        }
        else {
            mouseIsDown = false;
            removeGridModifier();
        }
    }
    
    window.onmouseup = function(e){
        e = e || event;
        if (e.button == 0){
            mouseIsDown = false;
        }
    }
    
    document.getElementById("cleargrid").onclick = clearGrid;
    
    document.getElementById("step1").onclick = doReactorTick;
    document.getElementById("normalsim").onclick = function(){
        if(!currentInterval)
            currentInterval = setInterval(doReactorTick, 1000);
    };
    document.getElementById("fastsim").onclick = function(){
        if(!currentInterval)
            currentInterval = setInterval(doReactorTick, 1e-1);
    };
    document.getElementById("stopsim").onclick = function(){
        if(currentInterval)
            clearInterval(currentInterval);
        currentInterval = null;
    };
    document.getElementById("resetsim").onclick = function(){
        if(currentInterval)
            clearInterval(currentInterval);
        currentInterval = null;
        simulationTime = 0;
        reactorHullHeat = 0;
        initialiseGrid();
        for(var i=0; i<reactorGrid.length; i++){
            reactorGrid[i].element.style.backgroundColor = "#8b8b8b";
        }
    };
    
    document.getElementById("wrcode").onchange = loadReactorCode;
    document.getElementById("wrcode").onkeyup = loadReactorCode;
    document.getElementById("wrcode").onblur = getReactorCode;
    var fuelRows = document.getElementById("reactor-panel").getElementsByClassName("panel-row");
    var toolPanels = document.getElementsByClassName("toolpanel");
    
    for (var i=0; i<fuelRows.length; i++){
        for(var j=0; j < fuelRows[i].getElementsByClassName("panel-cell").length; j++){
            reactorGrid.push(GridItem(j,i,fuelRows[i].getElementsByClassName("panel-cell")[j]));
        }
    }
    
    for (var i=0; i<toolPanels.length; i++ ) {
        var panelCells = toolPanels[i].getElementsByClassName("panel-cell");
        for (var j=0; j < panelCells.length; j++) {
            setGridModifierHandler(panelCells[j]);
        }
    }
}
