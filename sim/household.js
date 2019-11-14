
function Household(name, consumption, time) {
    this.name = name;
    this.consumption = consumption;
    this.time = time;
}


function display() {
    let res = '${this.name} ${this.consumption} ${this.time}';
    console.log(res);
}

function simHouseHold() {
    let household1 = new Household("Hakansson", gen().consumption, gen().time);
    let household2 = new Household("Strandberg", gen().consumption, gen().time);

}

function gen() {    
    this.consumption;
    this.time;
    
}
