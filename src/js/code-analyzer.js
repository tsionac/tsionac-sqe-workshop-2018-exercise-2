import * as esprima from 'esprima';
import * as esgen from 'escodegen';
import * as color from 'static-eval';
import * as estr from 'estraverse';



let mapGlobal = [];
let mapLocal = {};
let result = [];
let mapLocalIf = {};
let ifbool = false;
let funcbool = false;



const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc: true, range: true}, function (node) {
        node['valuetext'] = codeToParse.substring(node.range[0], node.range[1]);

    });

};

const substituteCode = (codeToParse) => {
    let pp = esprima.parseScript(codeToParse, {loc: true, range: true}, function (node) {
        node['valuetext'] = codeToParse.substring(node.range[0], node.range[1]);
    });

    mapGlobal = [];
    mapLocal = {};
    result = [];
    mapLocalIf = {};
    ifbool = false;
    funcbool = false;
    for (let bodyOfProg = 0; bodyOfProg < pp.body.length; bodyOfProg++) {

        symbolicsSubt[pp.body[bodyOfProg].type](pp.body[bodyOfProg]);

    }
    return esgen.generate(parseCode(result.join('\n')));
};


export {parseCode, substituteCode,evaluation};

function copy() {
    mapLocalIf = {};
    for (let key in mapLocal) {
        mapLocalIf[key] = mapLocal[key];
    }
    return mapLocalIf;
}


function subIf(node) {
    ifbool = true; let init; mapLocalIf = copy();
    init = node.test.valuetext;
    init = replaceValue(init);
    if (node.consequent.type == 'BlockStatement') {
        result.push('if(' + init + '){');
    } else
        result.push('if(' + init + ')');
    symbolicsSubt[node.consequent.type](node.consequent);
    if (node.alternate != null) {
        if (node.alternate.type == 'IfStatement') {
            subIfElse(node.alternate);
        } else {mapLocalIf = copy();
            result.push('else{');
            symbolicsSubt[node.alternate.type](node.alternate);
        }
    }
    ifbool = false;
}


function subIfElse(node) {
    ifbool = true;  mapLocalIf = copy();  let init;
    init = node.test.valuetext;
    init = replaceValue(init);
    if (node.consequent.type == 'BlockStatement') {
        result.push('else if(' + init + '){');
    } else
        result.push('else if(' + init + ')');
    symbolicsSubt[node.consequent.type](node.consequent);
    if (node.alternate != null) {
        if (node.alternate.type == 'IfStatement') {
            subIfElse(node.alternate);
        } else {
            mapLocalIf = copy();
            result.push('else{');
            symbolicsSubt[node.alternate.type](node.alternate);
        }
    }
    ifbool = false;
}

function subWhile(node) {
    ifbool = true;
    mapLocalIf = copy();
    let init;
    init = node.test.valuetext;
    init = replaceValue(init);
    if (node.body.type == 'BlockStatement') {
        result.push('while(' + init + '){');
    } else
        result.push('while(' + init + ')');

    symbolicsSubt[node.body.type](node.body);
    ifbool = false;

}


function subVar(node) {
    let init = '';
    for (let i = 0; i < (node.declarations).length; i++) {
        if (node.declarations[i].init != null) {
            init = node.declarations[i].init.valuetext;
            init = replaceValue(init);
            if (/*!(node.declarations[i].id.name in mapLocal) &&*/ funcbool) {
                mapLocal[node.declarations[i].id.name] = init;
            }
            else result.push(node.valuetext);

        }
    }
}

function replaceValue(node) {
    let arrPart = node.split(' ');
    let res = node;
    for (let i = 0; i < arrPart.length; i++) {
        if (!ifbool) {
            if (arrPart[i] in mapLocal) {
                res = res.replace(arrPart[i], '(' + mapLocal[arrPart[i]]) + ')';
            }
        } else {
            if (arrPart[i] in mapLocalIf)
                res = res.replace(arrPart[i], '(' + mapLocalIf[arrPart[i]]) + ')';
        }
    }
    return tryEval(res);
}

function tryEval(node) {
    // try {
    //     // let nodeNew = eval(node);
    //     // return node!=undefined?nodeNew:node;
    // }
    // catch (e) {
    // }
    return node;
}

function subBlockState(node) {
    for (let i = 0; i < (node.body).length; i++) {
        symbolicsSubt[node.body[i].type](node.body[i]);
    }
    result.push('}');
}

function subFunc(node) {
    result.push((node.valuetext).substring(0, node.valuetext.indexOf('{') + 1));
    funcbool = true;
    node.params.map((part) => mapGlobal.push(part.name));
    symbolicsSubt[node.body.type](node.body);
    funcbool = false;
}

function subAssignmentExp(node) {
    let init;
    init = node.right.valuetext;
    init = replaceValue(init);
    if (mapGlobal.includes(node.left.name)) {
        result.push(node.left.name + ' = ' + init + ';');
    }
    if (ifbool) {
        mapLocalIf[node.left.name] = init;
    }
    else
        mapLocal[node.left.name] = init;
}

function subExpressionState(node) {

    symbolicsSubt[node.expression.type](node.expression);
}


function subRet(node) {
    let init;
    init = node.argument.valuetext;
    init = replaceValue(init);
    result.push('return ' + init + ';');

}
const symbolicsSubt = {
    'FunctionDeclaration': subFunc,
    'VariableDeclaration': subVar,
    'IfStatement': subIf,
    'BlockStatement': subBlockState,
    'ExpressionStatement': subExpressionState,
    'AssignmentExpression': subAssignmentExp,
    'WhileStatement': subWhile,
    'ReturnStatement': subRet,

};
//.....................................EVALUATE................................................//

const evaluation=(tree, input)=>{
    estr.replace(tree, {enter: function (node) {
        //  console.log(node.type);
        if(node.type==='IfStatement'){
            return evalIf(node, input);
        }
        else return tree;

    }
    });
    return tree;
};
function evalIf(node, input){
    //node.test['x-verbatim-property'] =
    if(( color(node.test,input))===true){
        // node.test.color=
        //console.log('true');
        node.test.color = '<mark style="background-color: forestgreen">' +
         node.test.valuetext + '</mark>';
    }
    else {
        //console.log('false');
        node.test.color = '<mark style="background-color: orangered">' +
         node.test.valuetext + '</mark>';
    }

}

