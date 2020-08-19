
// Operator Object
// like add, sub, multiply... 
// has there own mathematical definition (execute)
export function Operator (name,description,format,priority,args,exeFunc) {
    this.name=name;
    this.description = description
    this.format= format;
    this.priority = priority;
    this.execute=new Function (args,exeFunc);
        
}
// list of the basic operators
export const operators = {
    add : new Operator ('+','add',{pre:1, post: 1} ,0,'a,b', `console.log (a,'+', b);return a+b;`),
    sub : new Operator ('-', 'sub',{pre:1, post: 1},0,'a,b', `console.log (a,'-', b);return a-b;`),
    multiply : new Operator ('x','multiply',{pre:1, post: 1} ,1,'a,b', `console.log (a,'*', b);return a*b;`),
    divide : new Operator ('/', 'divide',{pre:1, post: 1},1,'a,b', `{console.log (a,'/', b);
        if (b==0) 
            return 'Not possible'; 
        return a/b;}`),
    sqrt : new Operator ('SQRT', 'sqrt',{pre:0, post: 1},2,'a=0,b', `{console.log ('sqrt');
        
        return Math.sqrt(b);}`),
    xroot : new Operator ('XRT', 'xroot',{pre:1, post: 1},2,'a,b', `{console.log (a,'/', b);
        if (b==0) 
            return 'Not possible'; 
        return a/b;}`),
}