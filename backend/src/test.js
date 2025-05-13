function Car (make,model){
    this.make = make;
    this.model = model;
}

Car.prototype.startEngine = function(){
   console.log( `The ${this.make} ${this.model}'s engine is starting`)
}

const myCar = new Car('Toyota', 'Camry')

myCar.startEngine()

console.log('test ', Object.getPrototypeOf(myCar).hasOwnProperty('startEngine'))