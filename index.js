// Expression object
function Expression (id,upperLevel) {
    this.id = id;
    this.upperLevel=upperLevel;
    this.content = [];
    this.value=0;
} 

// Operator Object
function Ops (name,hasPriority,args,exeFunc) {
    this.name=name;
    this.hasPriority = hasPriority;
    this.execute=new Function (args,exeFunc);
        
}

// Calculus Object
function Calculus () {
    commands = [0];
    let currentExpression = 'main';
    this.expressionsList = {'main':new Expression(currentExpression,'main')};
    this.expressionsList[currentExpression].content= [0];
    
    function selectExpression (expressionId) {
        currentExpression = expressionId;
    };

this.createExpression = function (name, number, bracketState)
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
        console.log (RHS, RHS[0], typeof RHS[0])
        
        if (typeof RHS[0] == "number") {
            console.log('Number',RHS[0])
            LHS=RHS[0]

            if (RHS.length>1)
                return this.calculate (LHS, RHS.slice(1))
        }
        if (typeof RHS[0] == "string"){
            if (RHS[0].slice(0,4)=="exp-")
                return this.calculate(this.expressionsList[RHS[0].slice(4)].value,RHS.slice(1))
            //The operation has priority or not
            // no prority ... compute the remaining commands
            // priority execute the next number

            if (this[RHS[0]].hasPriority){
                if (typeof RHS[1]== "number")
                    return this.calculate (this[RHS[0]].execute(LHS,RHS[1]), RHS.slice(2));
                if (RHS[1].slice(0,4)=="exp-")
                    return this.calculate (this[RHS[0]].execute(LHS,this.expressionsList[RHS[1].slice(4)].value), RHS.slice(2));
                
            }
            else {
                console.log (
                    LHS,
                    this[RHS[0]],
                    this.calculate (LHS, RHS.slice(1)),
                    '=',
                    this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1))))
                return this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1)));
        }
    }
        return LHS

    };

    Object.defineProperty(this,'commands', {
        get: function() {return commands
        }
    })
}


const calcul = new Calculus();

// 0+(2*(10+10)+3)*10/2-.5
calcul.createExpression ('add',2,'bracketOpen');
calcul.createExpression('multiply',10,'bracketOpen');
calcul.createExpression ('add',10,'bracketClose');
calcul.createExpression ('add',3,'bracketClose');

calcul.createExpression ('multiply',10);
calcul.createExpression ('divide',2);
calcul.createExpression ('sub',0.5);

calcul.calculate(calcul.expressionsList.main.content[0],calcul.expressionsList.main.content)