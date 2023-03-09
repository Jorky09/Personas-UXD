"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDummyTsLs = void 0;
const shared = require("@volar/shared");
// Fast dummy TS language service, only has one script.
let dummyProjectVersion = 0;
let dummyTsLs;
let doc;
function getDummyTsLs(ts, ts2, _doc, getPreferences, getFormatOptions) {
    if (!dummyTsLs) {
        const host = {
            getProjectVersion: () => dummyProjectVersion.toString(),
            getPreferences,
            getFormatOptions,
            getCompilationSettings: () => ({ allowJs: true, jsx: ts.JsxEmit.Preserve }),
            getScriptFileNames: () => [shared.uriToFsPath(doc.uri)],
            getScriptVersion: () => doc.version.toString(),
            getScriptSnapshot: () => ts.ScriptSnapshot.fromString(doc.getText()),
            getScriptKind: () => {
                switch (doc.languageId) {
                    case 'javascript': return ts.ScriptKind.JS;
                    case 'typescript': return ts.ScriptKind.TS;
                    case 'javascriptreact': return ts.ScriptKind.JSX;
                    case 'typescriptreact': return ts.ScriptKind.TSX;
                    default: return ts.ScriptKind.TS;
                }
            },
            getCurrentDirectory: () => '',
            getDefaultLibFileName: () => '',
        };
        dummyTsLs = ts2.createLanguageService(ts, host, ts.createLanguageService(host));
    }
    dummyProjectVersion++;
    doc = _doc;
    return dummyTsLs;
}
exports.getDummyTsLs = getDummyTsLs;
//# sourceMappingURL=sharedLs.js.map