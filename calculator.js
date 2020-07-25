function Calculator () {
    this.calculs=[new Calculus];
    let indexCalcul=this.calculs.length-1;
    this.addCalcul = function () {
        this.calculs.push (new Calculus);
    }
}

// Expression object - 
//main expression => [2, "add", 3, "mutiply", epx-1]
function Expression (id,upperLevel) {
    this.id = id;
    this.upperLevel=upperLevel;
    this.content = [];
    this.value=0;
} 

// Operator Object
// like add, sub, multiply... 
// has there own mathematical definition (execute)
function Ops (name,hasPriority,args,exeFunc) {
    this.name=name;
    this.hasPriority = hasPriority;
    this.execute=new Function (args,exeFunc);
        
}

// Calculus Object
// Is the structure of one calcul
function Calculus () {
    
    let currentExpression = 'main';
    this.expressionsList = {'main':new Expression(currentExpression,'main')};
    this.expressionsList[currentExpression].content= [0];
    
    function selectExpression (expressionId) {
        currentExpression = expressionId;
    };

    this.addToExpression = function (name, number, bracketState)
    {
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
    this.add = new Ops ('+', false,'a,b', `return a+b;`);
    this.sub = new Ops ('-', false,'a,b', `return a-b;`);
    this.multiply = new Ops ('x', true,'a,b', `return a*b;`);
    this.divide = new Ops ('/', true,'a,b', `return a/b;`);

    this.bracketOpen = new Ops ('(', true,'a,b', `
        console.log ('b',b,typeof b,b.lastIndexOf("bracketClose",-1));
        return b.lastIndexOf("bracketClose",-1);`);
    this.bracketClose = new Ops (')', true,'a,b', `return;`);

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

            if (this[RHS[0]].hasPriority){
                //console.log ({LHS})
                if (typeof RHS[1]== "number")
                    return this.calculate (this[RHS[0]].execute(LHS,RHS[1]), RHS.slice(2));
                if (RHS[1].slice(0,4)=="exp-")
                    return this.calculate (this[RHS[0]].execute(LHS,this.expressionsList[RHS[1].slice(4)].value), RHS.slice(2));
                
            }
            else {
                
                //console.log ({LHS},this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1))))

                  return this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1)));
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
        get: function() {return commands}
    })
}


const calcul = new Calculus();

// 0+(2*(10+10)+3)*10/2-.5
calcul.addToExpression ('add',2,'bracketOpen');
calcul.addToExpression('multiply',10,'bracketOpen');
calcul.addToExpression ('add',10,'bracketClose');
calcul.addToExpression ('add',3,'bracketClose');

calcul.addToExpression ('multiply',10);
calcul.addToExpression ('divide',2);
calcul.addToExpression ('sub',0.5);

calcul.getResult()


// Starting up the calculator
const myCalculator = new Calculator();