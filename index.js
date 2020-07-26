import Calculator from './modules/calculator.js';

// Starting up the calculator
const myCalculator = new Calculator();

//-----     Init functions
function initOperands () {
    const operands = myCalculator.showOperands();
    for (const [key, operand] of Object.entries(operands)) {
        let newSpan = document.createElement('div');
        newSpan.id = key;
        newSpan.className = 'operator-button';
        document.getElementById("basic-operators").appendChild(newSpan);
        document.getElementById(key).textContent =operand.name;
        document.getElementById(key).addEventListener("click", addExpression );
        console.log(`${key}: ${operand.name}`);
      }
}

//-----     Page functions
function displayCalcul(key, content, upperlevel) {
    console.log (upperlevel)
    let newSpan = document.createElement('span');
    newSpan.id = key;
    if (key=='main')
        newSpan.className="main-expression";
    else
        newSpan.className="bracket";
        
            document.getElementById(upperlevel).appendChild(newSpan);

    content.map(expression =>{
        if (typeof expression=='string' && expression.slice(0,4) == 'exp-') {
            displayCalcul(expression.slice(4),myCalculator.currentCalcul.expressionsList[expression.slice(4)].content, myCalculator.currentCalcul.expressionsList[expression.slice(4)].upperLevel)
        }else

        {
            let newDigit = document.createElement('span');
            newDigit.name = key;
            newDigit.className = 'digit';
            if (typeof expression=='string') 
                newDigit.textContent = myCalculator.getOperatorSymbol(expression)
            else
                newDigit.textContent = expression
            document.getElementById(key).appendChild(newDigit);
        }
       /*  if (typeof expression=="string")
            document.getElementById(key).textContent =operand[expression].name;

        else
        document.getElementById(key).addEventListener("click", addControl ); */
    })
}
function displayNumber(numberDescriptions) {
    numberDescriptions.map(description =>{
        let newDiv = document.createElement ('div');
        newDiv.id = description.name;
        newDiv.name = description.name;
        newDiv.className = 'number-touch';
        newDiv.textContent =description.name;
        document.getElementById("numbers").appendChild(newDiv);
        document.getElementById(description.name).addEventListener("click", addExpression);
    })
    
}

function addExpression (el,ev) {
    console.log(el,ev);
    myCalculator.currentCalcul.addExpression (el.srcElement.id);
    displayCalcul('main',myCalculator.currentCalcul.expressionsList['main'].content,'current-main-expression');
}

/* function defaultCalculation(param) {
    console.log (param);
    myCalculator.currentCalcul.addToExpression ('add',2,'bracketOpen');
    myCalculator.currentCalcul.addToExpression('multiply',10,'bracketOpen');
    myCalculator.currentCalcul.addToExpression ('add',10,'bracketClose');
    myCalculator.currentCalcul.addToExpression ('add',3,'bracketClose');

    myCalculator.currentCalcul.addToExpression ('multiply',10);
    myCalculator.currentCalcul.addToExpression ('divide',2);
    myCalculator.currentCalcul.addToExpression ('sub',0.5);
    console.log('result', myCalculator);
}
 */
function showResult() {
    
        document.getElementById('main').textContent= myCalculator.currentCalcul.getResult();
   
}

function addCalcul () {
    myCalculator.addCalcul();
    console.log ('calcul added', myCalculator);
}

function  displayNumberCalcul() {
    document.getElementById('main').textContent= myCalculator.calculs.length;
    console.log ( myCalculator.calculs.length);
}

//console.log (defaultCalculation('module'))

displayCalcul('main',myCalculator.currentCalcul.expressionsList['main'].content,'current-main-expression');

//-----     Page listeners
//document.getElementById("btn-1").addEventListener("click", defaultCalculation);
document.getElementById("btn-2").addEventListener("click", addCalcul);
document.getElementById("btn-3").addEventListener("click", displayNumberCalcul);
document.getElementById("btn-4").addEventListener("click", showResult);

//-----     Init
let numbers = [1,2,3,4,5,6,7,8,9,0];
let numberButtonDescription= numbers.map(number=>{return{name:number.toString(), value:number}});
displayNumber (numberButtonDescription);
initOperands ();
document.getElementById("btn-4").addEventListener("click", showResult);