import Calculator from './modules/calculator.js';

// Starting up the calculator
const myCalculator = new Calculator();

function defaultCalculation(param) {

    console.log (param);
    myCalculator.currentCalcul.addToExpression ('add',2,'bracketOpen');
    myCalculator.currentCalcul.addToExpression('multiply',10,'bracketOpen');
    myCalculator.currentCalcul.addToExpression ('add',10,'bracketClose');
    myCalculator.currentCalcul.addToExpression ('add',3,'bracketClose');

    myCalculator.currentCalcul.addToExpression ('multiply',10);
    myCalculator.currentCalcul.addToExpression ('divide',2);
    myCalculator.currentCalcul.addToExpression ('sub',0.5);
    document.getElementById('main').textContent= myCalculator.currentCalcul.getResult();
    console.log('result', myCalculator);
}

function addCalcul () {
    myCalculator.addCalcul();
    console.log ('calcul added', myCalculator);
}

function  displayNumberCalcul() {
    document.getElementById('main').textContent= myCalculator.calculs.length;
    console.log ( myCalculator.calculs.length);
}

console.log (defaultCalculation('module'))

// Add listener
document.getElementById("btn-1").addEventListener("click", defaultCalculation);
document.getElementById("btn-2").addEventListener("click", addCalcul);
document.getElementById("btn-3").addEventListener("click", displayNumberCalcul);