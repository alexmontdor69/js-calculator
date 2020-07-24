function Ops (name,hasPriority,args,exeFunc) {
    this.name=name;
    this.hasPriority = hasPriority;
    this.execute=new Function (args, exeFunc)
    
}

function Calculus () {
    commands = [0];
    this.result = 0;

    this.compute = 0;
/*    add = {priority : 0,
        needNumber=true};
    sub = {priority : 0,
        needNumber=true};
    multiply = {priority : 1,
                needNumber=true};
    divide = {priority : 1,
        needNumber=true};
*/
    this.adding = function (number) {
        commands.push('add');
        commands.push(number);
        this.result += number;
    };

    this.substracting = function (number) {
        commands.push('sub');
        commands.push(number);
        this.result += -number;
    };

    this.multiplying = function (number) {
        commands.push('multiply');
        commands.push(number);
        this.result = this.result*number;
    };

    this.dividing = function (number) {
        commands.push('divide');
        commands.push(number);
        if (!number)
            throw new Error('no division by 0');
            this.result = this.result/number;
    };


    this.add = new Ops ('add', false,'a,b', `return a+b;`);
    this.sub = new Ops ('sub', false,'a,b', `return a-b;`);
    this.multiply = new Ops ('multiply', true,'a,b', `return a*b;`);
    this.divide = new Ops ('divide', true,'a,b', `return a/b;`);

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
            console.log (this[RHS[0]].name)
            if (this[RHS[0]].hasPriority){
                console.log ('has priority');
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
calcul.adding (10);
calcul.adding (2);
calcul.multiplying (10);
calcul.dividing (4);
calcul.substracting (0.5);