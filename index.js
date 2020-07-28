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
function displayCalcul(key, content, upperlevel, current ='current') {
    
    const spanId = `${upperlevel}_${key}`;
    
    // Create an element to display the expression
    const newSpan = document.createElement('span');
    newSpan.id = spanId;
    if (key=='main')
        newSpan.className="main";
    else
        newSpan.className="bracket";

    document.getElementById(upperlevel).appendChild(newSpan);

    // Display the expression and the sub expressions (into brackets)
    content.map(expression =>{
        
        if (typeof expression=='string' && expression.slice(0,4) == 'exp-') {
            // For the sub expression
            // Management of the current list and the previous next List
            if (current=='current')
                displayCalcul(expression,myCalculator.currentCalcul.expressionsList[expression.slice(4)].content, spanId)
            else
                displayCalcul(expression,myCalculator.calculs[current].expressionsList[expression.slice(4)].content, spanId)

        }else

        {
            // For the main expression
            let newDigit = document.createElement('span');
            newDigit.id = key;
            newDigit.className = 'digit';
            if (typeof expression=='string') 
                newDigit.textContent = myCalculator.getOperatorSymbol(expression)
            else
                newDigit.textContent = expression
            document.getElementById(spanId).appendChild(newDigit);
            
        }
/* Not SURE ABOUT THIS PART
PROBABLY TO GET RID OF

        if (typeof expression=="string")
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

    [...document.getElementsByClassName("main")].forEach(
        (element, index, array) => {
            if (element.parentElement.id == "current-main-expression") 
                element.remove();
        }
    );

    /* let nodeToRemove = mainNodes.filter (node => mainNode.parentElement.id='current-main-expression')
    nodeToRemove.remove(); */
    
    displayCalcul('main',myCalculator.currentCalcul.expressionsList['main'].content,'current-main-expression');
    showResult()
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
function showPreviousCalcul(){
    const totalCalcul = myCalculator.calculs.length;
    const parentElementName = 'previous-main-expression';
    const parentNode = document.getElementById(parentElementName);

    parentNode.innerHTML='';
    for (let inc = 0; inc<totalCalcul; inc++){
        const nodeId=`prev-exp-${inc.toString()}`;
        const myNode = document.getElementById(nodeId)
        if (myNode)
            myNode.remove();
        let newDiv = document.createElement('div');
        newDiv.id ='prev-exp-'+inc.toString();
        newDiv.className = 'prev-exp';
        parentNode.appendChild(newDiv);
        displayCalcul('main',myCalculator.calculs[inc].expressionsList['main'].content,nodeId,inc.toString());
    }
        
    
}

function showResult() {
        const result = myCalculator.currentCalcul.getResult();
        if (result)
            document.getElementById('result').textContent= result;
        else
            document.getElementById('result').textContent= '--';
   
}

function addCalcul () {
    myCalculator.addCalcul();
    showPreviousCalcul()
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