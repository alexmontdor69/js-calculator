// Operator Object
function Ops (name,hasPriority,args,exeFunc) {
    this.name=name;
    this.hasPriority = hasPriority;
    this.execute=new Function (args, exeFunc)
    
}

// Calculus Object
function Calculus () {
    commands = [0];

    function addBracket (state, number) {
        if (state =="bracketOpen"){
            return new Array("bracketOpen", number);
        }
            if (state =="bracketClose")
            return new Array (number,"bracketClose");  
        
        throw new Error ("bracket error");

    };

// Definitions
    this.adding = function (number, bracketState) {
        commands.push('add');
        if (bracketState){
            commands = commands.concat(addBracket(bracketState,number))
        }
        else 
            commands.push (number);

    };

    this.substracting = function (number,bracketState) {
        commands.push('sub');

        if (bracketState){
            commands = commands.concat(addBracket(bracketState,number))
        }
        else 
            commands.push (number);
    };

    this.multiplying = function (number,bracketState) {
        commands.push('multiply');
        if (bracketState){
            commands = commands.concat(addBracket(bracketState,number))
        }
        else 
            commands.push (number);
    };

    this.dividing = function (number,bracketState) {
        if (!number)
            throw new Error('no division by 0');
        this.result = this.result/number;
        commands.push('divide');
        if (bracketState){
            commands = commands.concat(addBracket(bracketState,number))
        }
        else 
            commands.push (number);
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
            LHS=RHS[0]

            if (RHS.length>1)
                return this.calculate (LHS, RHS.slice(1))
        }
        if (typeof RHS[0] == "string"){
            //The operation has priority or not
            // no prority ... compute the remaining commands
            // priority execute the next number
            if (this[RHS[0]].hasPriority){
                if (RHS[0] == "bracketOpen"){
                    //return 1
                    console.log ('open braket');
                    /*
                    console.log ("LHS operation",RHS,RHS.slice(1,this[RHS[0]].execute(LHS,RHS)));
                    console.log ('LHS',this.calculate (RHS[1],RHS.slice(2,this[RHS[0]].execute(LHS,RHS))) )
                    console.log ('RHS',RHS.slice(1,RHS.lastIndexOf("bracketClose",-1)) )
                    console.log ('=',this.calculate (
                        0,
                        RHS.slice(1,this[RHS[0]].execute(LHS,RHS))));
*/
                    return this.calculate(
                        this.calculate (
                            0,
                            RHS.slice(1,this[RHS[0]].execute(LHS,RHS))),
                        RHS.slice(RHS.lastIndexOf("bracketClose",-1)+1)
                        );
                }
                // bracket into bracket
                if (RHS[1]=="bracketOpen") {
                    console.log ('open braket2',this[RHS[0]].execute(LHS,this.calculate(0,RHS.slice(2,RHS.lastIndexOf("bracketClose",-1)))),
                    RHS.slice(RHS.lastIndexOf("bracketClose",-1)+1));
                    return this.calculate(this[RHS[0]].execute(LHS,this.calculate(0,RHS.slice(2,RHS.lastIndexOf("bracketClose",-1)))),
                    RHS.slice(RHS.lastIndexOf("bracketClose",-1)+1));

                }

                return this.calculate (this[RHS[0]].execute(LHS,RHS[1]), RHS.slice(2));
            }
                
            else
                return this[RHS[0]].execute(LHS,this.calculate (LHS, RHS.slice(1)));
        }
        return LHS

    };

    Object.defineProperty(this,'commands', {
        get: function() {return commands
        }
    })
}


const calcul = new Calculus();
calcul.adding (2,'bracketOpen');
calcul.multiplying(10,'bracketOpen');
calcul.adding (10,'bracketClose');
calcul.adding (3,'bracketClose');

calcul.multiplying (10);
calcul.dividing (2);
calcul.substracting (0.5);