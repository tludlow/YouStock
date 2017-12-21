//A stack used to store where the user was last.
export class browserStack {
    constructor() {
        this.stack = [];
    }

    get() {
        return this.stack.pop;
    }

    push(data){
        browserStack.push(data);
    }

    
}