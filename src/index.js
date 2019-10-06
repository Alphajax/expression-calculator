function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = '(' + expr + ')';
    while (expr.indexOf(' ')!==-1){
        expr = expr.replace(' ','');
    }
    checkBrackets(expr);
    while(expr.indexOf(')')!==-1){
        let substr, indBeg, res;
        let exprCopy = expr.split('');
        let indEnd = expr.indexOf(')');
        for(let i = indEnd; i >0;i--){
            if (exprCopy[i] ==='('){
                indBeg = i;
                break;
            }
        }
        substr = expr.substring(indBeg, indEnd+1);
        res =  calculateWithoutBrackets(substr);
        expr = expr.replace(substr, String(res));
    }
    return Math.trunc(Math.round(+expr*10000))/10000 ;
}
function calculateWithoutBrackets(expr) {
    expr = expr.replace('(','');
    expr = expr.replace(')', '');
    let operands = [];
    let functions = [];
    let num;
    let fun;
    while (readFunction(expr)!=='' || readNum(expr)!=='' ){
        num = +readNum(expr);
        expr = expr.replace(num,'');
        fun = readFunction(expr);
        expr = expr.replace(fun,'');
        if(fun!==''){
            functions.push(fun);
        }
        if(num!==''){
            operands.push(+num);
        }
        fun ='';
        num = '';
    }
    return calculateFromTwoStacks(operands, functions);
}
function calculateFromTwoStacks(operands, functions) {
    for (let i =0; i< functions.length;i++){
        if (getPriority(functions[i]) ===1){
            let num1 = operands[i];
            let num2 = operands[i+1];
            let func = functions[i];
            for(let j = i;j<operands.length-1; j++ ){
                operands[j] = operands[j+1];
                functions[j] = functions[j+1];
            }
            operands[i] =doCalculation(num1, func, num2);
            operands.pop();
            functions.pop();
            i=-1;
        }
    }

    let i =0;
    while(operands.length!==1){
        let num1 = operands[0];
        let num2 = operands[1];
        let fun = functions[0];
        num1 = doCalculation(num1,fun,num2);
        for(let i = 0;i<operands.length-1;i++){
            operands[i] = operands[i+1];
            functions[i] = functions[i+1];
        }
        operands[0] = num1;
        operands.pop();
        functions.pop();
    }
    return operands[0];

}
function doCalculation(num1, fun , num2) {
    let res;
    if (fun === '+'){
        res=num1+num2;
        return res;
    } else if(fun ==='-'){
        res = num1-num2;
        return res;
    } else if(fun ==='*'){
        res = num1 * num2;
        return res;
    } else if(fun ==='/' && num2 === 0 ){
        throw new TypeError('TypeError: Division by zero.');
    } else if(fun ==='/'){
        let res = num1/num2;
        return res;
    }
}
function readFunction(expr) {
    let fun = expr.substring(0,1);
    if(isNaN(fun)){
        return fun;
    } else {
        return '';
    }
}
function  readNum(expr) {
    expr = expr.split('');
    let res ='';
    let token;
    while (!isNaN(expr[0]) || expr[0]==='.'){
        token = expr.shift();
        res+=token;
    }
    return res;
}
function getPriority(fun) {
    if (fun === '(') {
        return -1;
    } else if (fun === '*') {
        return 1;
    } else if (fun === '/') {
        return 1;
    } else if (fun === '+') {
        return 2;
    } else if (fun === '-') {
        return 2;
    } else {
        return 0;
    }
}
function checkBrackets(string){
    let stack =[];
    string  = string.split('');
    for(let i =0; i<string.length;i++){
        if (string[i] === '('){
            stack.push(string[i])
        }
        if( string[i] ===')'){
            if(stack.length ===0){
                throw new ExpressionError('ExpressionError: Brackets must be paired');
            } else{
                stack.pop();
            }
        }
    }
    if(stack.length!==0){
        throw new ExpressionError('ExpressionError: Brackets must be paired');
    }
}
class ExpressionError extends SyntaxError {
    constructor(message = null) {
        super();
        this.message = message;
    }

}

module.exports = {
    expressionCalculator
}