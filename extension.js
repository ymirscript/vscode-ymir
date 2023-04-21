const vscode = require('vscode');
const cp = require('child_process');

const KEYWORDS = [
    "target", "use", "as", "router", "auth", "authenticate", "authenticated", "public", 
    "include", "query", "header", "body", "any", "string", "float", "int", "boolean", 
    "datetime", "time", "date", "GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS",
    "API-Key", "Bearer"
];

function activate(context) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider('ymirscript', {
            provideCompletionItems(document, position, token, context) {
                const linePrefix = document.lineAt(position).text.substr(0, position.character);
                if (!linePrefix.endsWith(' ')) {
                    return undefined;
                }
                return KEYWORDS.map(keyword => {
                    const completionItem = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
                    completionItem.insertText = keyword;
                    return completionItem;
                });
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerTextEditorCommand("ymirscript.compile", (textEditor, edit) => {
            const path = textEditor.document.fileName;
            if (!path) {
                vscode.window.showErrorMessage("No file is opened.");
                return;
            }

            const output = cp.spawnSync("ymir", [path]);
            if (output.status !== 0) {
                vscode.window.showErrorMessage(output.stderr.toString());
                return;
            } else {
                vscode.window.showInformationMessage("Compile success.");
            }
        })
    );
}

exports.activate = activate;

module.exports = {
    activate,
    deactivate: () => {}
}