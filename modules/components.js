// Expression object - 
//main expression => [2, "add", 3, "mutiply", epx-1]
export function Expression (id,upperLevel) {
    this.id = id;
    this.upperLevel=upperLevel;
    this.content = [];
    this.value=0;
} 