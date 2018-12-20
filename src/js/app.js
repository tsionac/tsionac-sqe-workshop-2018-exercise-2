import $ from 'jquery';
import * as esgen from 'escodegen';
import {parseCode, substituteCode,evaluation} from './code-analyzer';

$(document).ready(function () {
    $('#parse').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    });
    let Subcode;
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        Subcode = substituteCode(codeToParse);
        $('#parsedCode').val(Subcode);
    });
    $('#evaluateButton').click(() => {
        let input = JSON.parse(($('#input').val()));
        let obj = parseCode(Subcode);
        let evaluate =evaluation(obj, input);
        document.getElementById('colorEval').innerHTML = esgen.generate(evaluate,{verbatim: 'color'});
    });
});

