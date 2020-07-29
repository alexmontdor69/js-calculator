import { Expression} from './expression.js';
import { Operator, operands} from './operator.js';

export default function Calculator () {
    this.calculs=[];
    let indexCalcul=0;
    this.currentCalcul ={}
    this.addCalcul = function () {
        this.calculs.push (new Calculus);
        indexCalcul=this.calculs.length-1;
        this.currentCalcul=this.calculs[indexCalcul];
    }

    this.addCalcul();
    
    // display the operator
    this.showOperands= function() {
        return operands;
    }

    this.getOperatorSymbol= expression => {
        if (operands[expression]) return operands[expression].name
        return expression
    };
    
}




// Calculus Object
// Is the structure of one calcul
function Calculus () {
    
    let currentExpression = 'main';
    this.expressionsList = {'main':new Expression(currentExpression,'main')};
    this.expressionsList[currentExpression].content= [];
    
    function selectExpression (expressionId) {
        currentExpression = expressionId;
    };
    const addUnitToLastContent= function (toLeft, unit) {
        return toLeft*10+unit;
    }
    this.addExpression = function (name)
    { 
        console.log ('expression',parseInt(name), typeof (parseInt(name)))
            if (name=='bracketOpen'){
                this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([name,'exp-'+Object.keys(this.expressionsList).length]);
                this.expressionsList[Object.keys(this.expressionsList).length]=new Expression(Object.keys(this.expressionsList).length,this.expressionsList[currentExpression].id);
                selectExpression (Object.keys(this.expressionsList).length-1);
            }
            
            else{
                if (typeof (parseInt(name)) == "number"&& parseInt(name)>=0 && parseInt(name)<=9)
                {
                    const lastIndex = this.expressionsList[currentExpression].content.length-1;
                    const lastContent = this.expressionsList[currentExpression].content[lastIndex]
                    if (typeof lastContent== 'number')
                        this.expressionsList[currentExpression].content[lastIndex]=addUnitToLastContent(lastContent,parseInt(name));
                    else
                    this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([parseInt(name)]);
                }
                else
                    this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([name]);
        
                };
            }

    this.addToExpression = function (name, number, bracketState)
    { 
        console.log ('expression',name, number, bracketState)
            if (bracketState=='bracketOpen'){
                this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([name,'exp-'+Object.keys(this.expressionsList).length]);
                this.expressionsList[Object.keys(this.expressionsList).length]=new Expression(Object.keys(this.expressionsList).length,this.expressionsList[currentExpression].id);
                selectExpression (Object.keys(this.expressionsList).length-1);
                this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([number]);
            }
            else if (bracketState=='bracketClose'){
                this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([name,number]);
                //bracket close so cursor go to parent expression
                this.expressionsList[currentExpression].value=this.calculate (this.expressionsList[currentExpression].content[0],this.expressionsList[currentExpression].content)
                selectExpression (this.expressionsList[currentExpression].upperLevel);
            }
            else 
                this.expressionsList[currentExpression].content=this.expressionsList[currentExpression].content.concat ([name,number]);

        };



// make them private
/*     this.add = new Operator ('+', false,'a,b', `return a+b;`);
    this.sub = new Operator ('-', false,'a,b', `return a-b;`);
    this.multiply = new Operator ('x', true,'a,b', `return a*b;`);
    this.divide = new Operator ('/', true,'a,b', `return a/b;`); */
    

/*     this.bracketOpen = new Operator ('(', true,'a,b', `
        console.log ('b',b,typeof b,b.lastIndexOf("bracketClose",-1));
        return b.lastIndexOf("bracketClose",-1);`);
    this.bracketClose = new Operator (')', true,'a,b', `return;`); */

/**
 * Calcultate should calculate the expression with high priority flag
 * Should end the calculation with low priority operand
 */

const calculateHighPriorityExpression = function(expressions, LHS=0) {
    let b;
    if (expressions.length>0)
        b=calculateHighPriorityExpression(expressions.slice(1),expressions[0])
    
    if (typeof expressions[0] == 'number')
        return expressions[0]
    if ((typeof expressions[0] == 'string' && operands[expressions[0]]))
        return operands[expressions[0]].execute(LHS, b)
    
}

let lowExpressions=[], mediumPriorityExp= {};
function getExp (expressions) {
    console.log ('Rewrite Expression',expressions)
    lowExpressions.length = 0;
    let startIndex=0, operand=undefined;
    // Split the expression by priority 0 operand
    for (let inc= 0; inc<expressions.length; inc++){
        const digit=expressions[inc];
        
        if (digit && typeof digit == "string"&&operands[digit]&&operands[digit].priority==0)
        {
            lowExpressions=[...lowExpressions, expressions.slice(startIndex, inc)]

            if (operand)
                lowExpressions=[...lowExpressions, [operand]]

            if (operands[digit]&&operands[digit].description)
                operand = operands[digit].description
            
            startIndex = inc+1;
        }
    }

    lowExpressions=[...lowExpressions, expressions.slice(startIndex)]
    if (operand)
        lowExpressions=[...lowExpressions, [operand]]
    
    
    
    mediumPriorityExp= {}
    // expression should split by priority 1
    lowExpressions.forEach((expression, key)=> {
        let highPriorityExpressions;
        mediumPriorityExp[key]=[];
        startIndex=0, operand=undefined;

        if (expression && expression.length>0)
        {
            for (let inc= 0; inc<expression.length; inc++){
                const digit=expression[inc];
                if (digit && typeof digit == "string"&&operands[digit]&&operands[digit].priority==1)
                {
                    highPriorityExpressions=expression.slice(startIndex, inc)
                    if (highPriorityExpressions.length>1)
                        highPriorityExpressions=[calculateHighPriorityExpression(highPriorityExpressions)]
                        mediumPriorityExp[key]=[...mediumPriorityExp[key], highPriorityExpressions]
                    if (operand)
                        mediumPriorityExp[key]=[...mediumPriorityExp[key], [operand]]
                    if (operands[digit]&&operands[digit].description)
                        operand = operands[digit].description
                    startIndex = inc+1;
                }
            } 
            highPriorityExpressions=expression.slice(startIndex)
            if (highPriorityExpressions.length>1)
                highPriorityExpressions=[calculateHighPriorityExpression(highPriorityExpressions)]

            mediumPriorityExp[key]=[...mediumPriorityExp[key], highPriorityExpressions]
            if (operand)
                mediumPriorityExp[key]=[...mediumPriorityExp[key], [operand]]
        }

        console.log ('Calcul rearranged...')

    })
}




function getObjectSize (obj) {
    return Object.keys(obj).length;
}

const getResultsFor = function (expressions){
    let a, b,inc=0;
    if (expressions[0]&&expressions[0][0]&&expressions[0].length==1&&typeof expressions[0][0] == 'number'){
        a =expressions[0][0]
        inc=1;
    }
    if (expressions[0]&&expressions[0][0]&&expressions[0].length>1&&typeof expressions[0][0] == 'number'){
        a =getResultsFor (mediumPriorityExp[inc])
        inc=1;
    }
        
    for (; inc<expressions.length; inc++) {
        let digit = expressions[inc];
        if (digit.length>1)
            digit =[getResultsFor (mediumPriorityExp[inc])]
        if (typeof digit[0] == "number")
            b=digit[0]
        if (typeof digit[0] == "string"&&operands[digit[0]])
            a=operands[digit[0]].execute(a,b)
        }
    console.log ('SR for', expressions,'=',a)
    return a

}

    this.calculate = function (LHS,RHS) {
        let result;
        console.log ('Rearranging calcul...')
        getExp(RHS);
        console.log ('Processing to Final Calculation',lowExpressions, mediumPriorityExp)
        result=getResultsFor (lowExpressions)
        console.log ('Calculation gives', result)


/*         console.log ('calculate', LHS,RHS)

        if (typeof RHS[0] == "number") {
            //console.log('Number',RHS[0])
            LHS=RHS[0]

            if (RHS.length>1){
                //console.log("final result",this.calculate (LHS, RHS.slice(1)))
                return this.calculate (LHS, RHS.slice(1))
            }
        }
        if (typeof RHS[0] == "string"){

            if (RHS[0].slice(0,4)=="exp-")
                return this.calculate(this.expressionsList[RHS[0].slice(4)].value,RHS.slice(1))
            //The operation has priority or not
            // no prority ... compute the remaining commands
            // priority execute the next number

            if (operands[RHS[0]]&&operands[RHS[0]].hasPriority){
                //console.log ({LHS})
                if (typeof RHS[1]== "number")
                    return this.calculate (operands[RHS[0]].execute(LHS,RHS[1]), RHS.slice(2));
                if (RHS[1]&&RHS[1].slice(0,4)=="exp-")
                    return this.calculate (operands[RHS[0]].execute(LHS,this.expressionsList[RHS[1].slice(4)].value), RHS.slice(2));
                
            }
            else {
                
                //console.log ({LHS},this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1))))
                console.log('sliced',RHS.slice(1,2));
                  return this.calculate (operands[RHS[0]].execute(LHS,this.calculate(LHS,RHS.slice(1,2))), RHS.slice(2));
        }
    }
    console.log ('end Result, ', LHS)
        return LHS; */

    };
    
    
    this.getResult = function (){
        // save the value of the main expression
        this.expressionsList['main'].value = this.calculate(this.expressionsList['main'].content[0],this.expressionsList['main'].content);
        
        return this.expressionsList['main'].value
    };

    Object.defineProperty(this,'commands', {
        get: function() {return this.expressionsList}
    })
}
console.log ('operands',operands)