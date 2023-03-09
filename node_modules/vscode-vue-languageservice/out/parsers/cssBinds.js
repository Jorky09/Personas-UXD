"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
function parse(docText, ss) {
    const result = [];
    visChild(ss);
    function visChild(node) {
        var _a, _b;
        if (node.type === 22) {
            const nodeText = docText.substring(node.offset, node.end);
            const reg = /\bv-bind\(\s*(?:'([^']+)'|"([^"]+)"|([^'"][^)]*))\s*\)/g;
            const matchs = nodeText.matchAll(reg);
            for (const match of matchs) {
                if (match.index !== undefined) {
                    const matchText = (_b = (_a = match[1]) !== null && _a !== void 0 ? _a : match[2]) !== null && _b !== void 0 ? _b : match[3];
                    if (matchText !== undefined) {
                        const offset = node.offset + match.index + nodeText.substr(match.index).indexOf(matchText);
                        result.push({ start: offset, end: offset + matchText.length });
                    }
                }
            }
        }
        else if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                visChild(node.children[i]);
            }
        }
    }
    return result;
}
exports.parse = parse;
//# sourceMappingURL=cssBinds.js.map