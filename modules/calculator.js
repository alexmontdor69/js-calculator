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

    this.calculate = function (LHS,RHS) {
        //console.log (RHS,RHS.length, RHS[0], typeof RHS[0])
        
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
                if (RHS[1].slice(0,4)=="exp-")
                    return this.calculate (operands[RHS[0]].execute(LHS,this.expressionsList[RHS[1].slice(4)].value), RHS.slice(2));
                
            }
            else {
                
                //console.log ({LHS},this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1))))

                  return operands[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1)));
        }
    }
        return LHS;

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