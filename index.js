import Calculator from './modules/calculator.js';

// Starting up the calculator
const myCalculator = new Calculator();

//-----     Init functions
function initOperands () {
    let inc=0, lineRef=1; 
    const operands = myCalculator.showOperands();

    for (const [key, operand] of Object.entries(operands)) {
        if( inc==0){
            let newDiv = document.createElement ('div');
            newDiv.id = `operator-line-${lineRef}`;
            newDiv.className = 'operator-buttons container column';  
            document.getElementById("basic-operators").appendChild(newDiv);  
        }
        let newSpan = document.createElement('div');
        newSpan.id = key;
        newSpan.className = 'touch operator-button';
        document.getElementById(`operator-line-${lineRef}`).appendChild(newSpan);
        document.getElementById(key).textContent =operand.name;
        document.getElementById(key).addEventListener("click", addExpression );
        inc++;
        if (inc==4) {
            inc=0;
            lineRef++;
        }
      }
}

function displayNumber(numberDescriptions) {
    let inc=0, lineRef=1;

    numberDescriptions.map(description =>{
        if( inc==0){
            let newDiv = document.createElement ('div');
            newDiv.id = `line-${lineRef}`;
            newDiv.className = 'container row';  
            document.getElementById("numbers").appendChild(newDiv);  
        }
        let newDiv = document.createElement ('div');
        newDiv.id = description.name;
        newDiv.name = description.name;
        newDiv.className = 'touch';
        newDiv.textContent =description.name;
        document.getElementById(`line-${lineRef}`).appendChild(newDiv);
        document.getElementById(description.name).addEventListener("click", addExpression);
        inc++;
        if (inc==3) {
            inc=0;
            lineRef++;
        }
    })
    
}

/**
 * 
 * @param {*} key 
 * @param {*} content 
 * @param {*} upperlevel 
 * @param {*} current 
 */
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

    })
}

/**
 * 
 * @param {*} el 
 */
function addExpression (el) {
    myCalculator.currentCalcul.addExpression (el.srcElement.id);

    [...document.getElementsByClassName("main")].forEach(
        (element) => {
            if (element.parentElement.id == "current-main-expression") 
                element.remove();
        }
    );

    /* let nodeToRemove = mainNodes.filter (node => mainNode.parentElement.id='current-main-expression')
    nodeToRemove.remove(); */
    
    displayCalcul('main',myCalculator.currentCalcul.expressionsList['main'].content,'current-main-expression');
    showResult()
}

/**
 * 
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

function showCurrentCalcul() {
    // remove the calcul
    const myNode = document.getElementById('current-main-expression_main')
    if (myNode)
        myNode.remove();
    displayCalcul('main',myCalculator.currentCalcul.expressionsList['main'].content,'current-main-expression');
}

function showResult() {
        const result = myCalculator.currentCalcul.getResult();
        if (result)
            document.getElementById('result').textContent= result;
        else
            document.getElementById('result').textContent= '--';
   
}

/**
 *  Add a new calculus to the calculator
 * Save the precedent ones
 * To implement : click on the previous calculus to be displayed
 */
function addCalcul () {
    myCalculator.addCalcul();
    showPreviousCalcul()
    showCurrentCalcul()
    console.log ('calcul added', myCalculator);
}

/**
 * 
 */
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
showResult()