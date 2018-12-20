import assert from 'assert';
import {substituteCode} from '../src/js/code-analyzer';

describe('Parser to table cases 2', () => {
    it('fuction', () => {
        assert.equal(substituteCode(' function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}'), 'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '        return x + y + z + (0 + x + 5);\n' +
            '    } else {\n' +
            '        return x + y + z + (0 + z + 5);\n' +
            '    }\n' +
            '}');

    });
});

describe('while', () => {
    it('fuction with While Statement', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' +
            '    \n' +
            '    while (a < z) {\n' +
            '        c = a + b;\n' +
            '        z = c * 2;\n' +
            '    }\n' +
            '    \n' +
            '    return z;\n' +
            '}\n'),
        'function foo(x, y, z) {\n' +
            '    while (x + 1 < z) {\n' +
            '        z = (x + 1 + (x + 1 + y)) * 2;\n' +
            '    }\n' +
            '    return z;\n' +
            '}');
    });
});
describe('if without block', () => {
    it('fuction without a block', () => {
        assert.equal(substituteCode('function foo(x){\n' +
            'let a = x + 5;   \n' +
            'if(a)\n' +
            'return a;\n' +
            '    return x;\n' +
            '}\n'),
        'function foo(x) {\n' +
            '    if (x + 5)\n' +
            '        return x + 5;\n' +
            '    return x;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('  function foo(x){\n' +
            'let a = x + 5;   \n' +
            'if(a)\n' +
            'return a;\n' +
            'else\n' +
            '    return x;\n' +
            '}\n'),
        'function foo(x) {\n' +
            '    if (x + 5)\n' +
            '        return x + 5;\n' +
            '    else\n' +
            '        return x;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' +            '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '        } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else {\n' +
            '        return x + y + z + (0 + z + 5);\n' +
            '    }\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '        } else \n' +
            '        c = c + z + 5;\n' +
            '   \n' +
            '    \n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    }\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode(' function foo(x, y, z){\n' + '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) \n' +
            '    return x + y + z + c;\n' +
            '    \n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2)\n' +
            '        return x + y + z + 0;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode(' function foo(x, y, z){\n' +
            '    while (x + 1 < z) \n' +
            '       c = c + a;\n' +
            '    \n' +
            '    \n' +
            '    return z;\n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    return z;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('  let a = 2;'),'let a = 2;');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    while (a < z) \n' +
            '       \n' +
            '        z = c * 2;\n' +
            '    \n' +
            '    \n' +
            '    return z;\n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    while (x + 1 < z)\n' +
            '        z = 0 * 2;\n' +
            '    return z;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode(' function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else \n' +
            '        z = c + x + 5;\n' +
            '    \n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '    } else\n' +
            '        z = 0 + x + 5;\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        return x + y + z + c;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else if (b < z) {\n' +
            '        c = c + x + 5;\n' +
            '    }\n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '    if (x + 1 + y < z) {\n' +
            '        return x + y + z + (0 + 5);\n' +
            '    } else if (x + 1 + y < z * 2) {\n' +
            '    } else if (x + 1 + y < z) {\n' +
            '    }\n' +
            '}');
    });
});
describe('else without block', () => {
    it('is testing an alternate without block', () => {
        assert.equal(substituteCode('function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '   \n' +
            '    c = c + 5;\n' +
            '     \n' +
            '}\n'),'function foo(x, y, z) {\n' +
            '}');
    });
});
