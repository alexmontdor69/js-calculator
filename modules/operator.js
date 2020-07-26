
// Operator Object
// like add, sub, multiply... 
// has there own mathematical definition (execute)
export function Operator (name,description,hasPriority,args,exeFunc) {
    this.name=name;
    this.description = description
    this.hasPriority = hasPriority;
    this.execute=new Function (args,exeFunc);
        
}
// list of the basic operands
export const operands = {
    add : new Operator ('+','add', false,'a,b', `return a+b;`),
    sub : new Operator ('-', 'sub',false,'a,b', `return a-b;`),
    multiply : new Operator ('x','multiply', true,'a,b', `return a*b;`),
    divide : new Operator ('/', 'divide',true,'a,b', `return a/b;`),
}