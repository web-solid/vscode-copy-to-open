// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copy-to-open" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('copy-to-open.openFileInClipboard', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.env.clipboard.readText().then((text) => {
			const path = os.platform() === 'win32' ? text.replace(/\//g, '\\') : text;
			try{
				const stat = fs.statSync(path);
				if (stat.isDirectory()) {
					vscode.window.showInformationMessage(path + ' is a directory, should be a file to open!');
					return;
				}
			} catch(e: any){
				vscode.window.showInformationMessage(e.message + ' ,failed to open!');
				return;
			}
			vscode.window.showTextDocument(vscode.Uri.file(path));
		});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
