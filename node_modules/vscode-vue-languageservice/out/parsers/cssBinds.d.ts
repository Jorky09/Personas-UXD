import type * as css from 'vscode-css-languageservice';
import type { TextRange } from './types';
export declare function parse(docText: string, ss: css.Stylesheet): TextRange[];
