'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "phpaddnotes" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.addPHPNotes', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('addPHPNotes Hello World!');


        vscode.window.activeTextEditor.edit((editBuilder) => {
            var positionStart = new vscode.Position(vscode.window.activeTextEditor.selection.start.line, 0);
            var positionEnd = new vscode.Position(vscode.window.activeTextEditor.selection.start.line + 1, 0);
            var content = vscode.window.activeTextEditor.document.getText(new vscode.Range(positionStart, positionEnd));
            var matches = content.match(/function ([^\s(]+)\(/);
            var tabMatches = content.match(/^\s+/);
            var tab = '';
            if (null !== tabMatches) {
                tab = tabMatches[0];
            }
            if (null === matches) {
                // 万能注释
                var insertContent = tab + '/**\r\n' + tab + ' * \r\n' + tab + ' * @var mixed\r\n' + tab + ' */';
                editBuilder.insert(positionStart, insertContent + '\r\n');
            }
            else {
                var methodName = matches[1];
                matches = content.match(/\(([^)]*)\)/);
                if (null === matches || matches.length <= 1) {
                    return;
                }
                var insertContent = tab + '/**\r\n';
                tab += ' ';
                insertContent += tab + '* ' + methodName + '\r\n';
                matches = matches[1].match(/(\$[^\s,\)]+)/g);
                if (null !== matches) {
                    for (var i = 0; i < matches.length; i++) {
                        insertContent += tab + '* @param mixed ' + matches[i] + ' \r\n';
                    }
                }
                insertContent += tab + '* @return mixed \r\n';
                insertContent += tab + '*/';
                editBuilder.insert(positionStart, insertContent + '\r\n');
            }
        }, {
            undoStopBefore: true,
            undoStopAfter: true
        });
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}