"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSfcStyles = void 0;
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const reactivity_1 = require("@vue/reactivity");
const SourceMaps = require("../utils/sourceMaps");
const shared = require("@volar/shared");
const upath = require("upath");
const cssBinds_1 = require("../parsers/cssBinds");
function useSfcStyles(context, vueUri, vueDoc, styles) {
    const { modules: { typescript: ts } } = context;
    let version = 0;
    const textDocuments = (0, reactivity_1.computed)(() => {
        const documents = [];
        for (let i = 0; i < styles.value.length; i++) {
            const style = styles.value[i];
            const lang = style.lang;
            let content = style.content;
            const documentUri = vueUri + '.' + i + '.' + lang;
            const document = vscode_languageserver_textdocument_1.TextDocument.create(documentUri, lang, version++, content);
            const linkStyles = [];
            let stylesheet = undefined;
            const cssLs = context.getCssLs(lang);
            if (cssLs) {
                stylesheet = cssLs.parseStylesheet(document);
                findLinks(cssLs, document, stylesheet);
            }
            documents.push({
                textDocument: document,
                stylesheet,
                binds: stylesheet ? (0, cssBinds_1.parse)(content, stylesheet) : [],
                links: linkStyles,
                module: style.module,
                scoped: style.scoped,
            });
            function findLinks(ls1, textDocument, stylesheet) {
                const links = 'documentContext' in context ? ls1.findDocumentLinks(textDocument, stylesheet, context.documentContext) : [];
                for (const link of links) {
                    if (!link.target)
                        continue;
                    if (!link.target.endsWith('.css') && !link.target.endsWith('.scss') && !link.target.endsWith('.less'))
                        continue;
                    if (!ts.sys.fileExists(shared.uriToFsPath(link.target)))
                        continue;
                    if (linkStyles.find(l => l.textDocument.uri === link.target))
                        continue; // Loop
                    const text = ts.sys.readFile(shared.uriToFsPath(link.target));
                    if (text === undefined)
                        continue;
                    const lang = upath.extname(link.target).substr(1);
                    const doc = vscode_languageserver_textdocument_1.TextDocument.create(link.target, lang, version++, text);
                    const ls2 = context.getCssLs(lang);
                    if (!ls2)
                        continue;
                    const stylesheet = ls2.parseStylesheet(doc);
                    linkStyles.push({
                        textDocument: doc,
                        stylesheet,
                    });
                    findLinks(ls2, doc, stylesheet);
                }
            }
        }
        return documents;
    });
    const sourceMaps = (0, reactivity_1.computed)(() => {
        const sourceMaps = [];
        for (let i = 0; i < styles.value.length && i < textDocuments.value.length; i++) {
            const cssData = textDocuments.value[i];
            const style = styles.value[i];
            const sourceMap = new SourceMaps.CssSourceMap(vueDoc.value, cssData.textDocument, cssData.stylesheet, style.module, style.scoped, cssData.links, { foldingRanges: true, formatting: true });
            sourceMap.add({
                data: undefined,
                mode: SourceMaps.Mode.Offset,
                sourceRange: {
                    start: style.startTagEnd,
                    end: style.startTagEnd + style.content.length,
                },
                mappedRange: {
                    start: 0,
                    end: style.content.length,
                },
            });
            sourceMaps.push(sourceMap);
        }
        return sourceMaps;
    });
    return {
        textDocuments,
        sourceMaps,
    };
}
exports.useSfcStyles = useSfcStyles;
//# sourceMappingURL=useSfcStyles.js.map