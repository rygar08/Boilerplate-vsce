// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    

       console.log(
        vscode.workspace.workspaceFolders[0].uri.fsPath
    );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        'extension.createWebBoilerplate',
        async function() {
            if (!vscode.workspace) {
                return vscode.window.showErrorMessage(
                    'Please open a project folder first'
                );
            }

            const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath
                .toString()
                .split(':')[1];

            const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <link rel="stylesheet" href="app.css" />
</head>
<body>
    <script src="app.js"></script>
</body>
</html>
        `;

            fs.writeFile(
                path.join(folderPath, 'index.html'),
                htmlContent,
                (err) => {
                    if (err) {
                        return console.log(err);
                        vscode.window.showErrorMessage(
                            'Failed to create boilerplate files'
                        );
                    }
                    fs.writeFile(path.join(folderPath, 'app.js'), '', (err) => {
                        if (err) {
                            return console.log(err);
                            vscode.window.showErrorMessage(
                                'Failed to create boilerplate files'
                            );
                        }
                        fs.writeFile(
                            path.join(folderPath, 'app.css'),
                            '',
                            (err) => {
                                if (err) {
                                    return console.log(err);
                                    vscode.window.showErrorMessage(
                                        'Failed to create boilerplate files'
                                    );
                                }
                                vscode.window.showWarningMessage(
                                    'Created boilerplate files!'
                                );
                            }
                        );
                    });
                }
            );
        }
    );

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
