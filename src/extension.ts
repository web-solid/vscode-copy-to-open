// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as os from 'os';
import * as fs from 'fs';

//Strings
const CFG_SECTION = "googleSearch";
const CFG_QUERY = "QueryTemplate";

function getPathSeparator(isWin: boolean){
    if(isWin){
        return '\\';
    }

    // default to *nix system.
    return '/';
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	const isWin = os.platform() === 'win32';
	const sep = getPathSeparator(isWin);
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "copy-to-open" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('copy-to-open.openFileInClipboard', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.env.clipboard.readText().then((text) => {
			let path = isWin ? text.replace(/\//g, '\\') : text;
			
			if(path.length < 2 || path.trim().length > 1024) {
				return;
			}
            let [, lineIndex, , charIndex] = /:(\d+)(:(\d+))?\s*$/.exec(path) || [, -1, , 1];
            path = lineIndex !== -1 ? path.replace(/:(\d+)(:(\d+))?\s*$/, '') : path;
			const isAbsolutePath = isWin ? /^\s*[a-zA-Z]:/.test(path): path.startsWith('/');

			if (!isAbsolutePath) {
				const workspaceFolders = vscode.workspace.workspaceFolders?.map(v => v.uri.fsPath);
				let found = false;
				for (const v in workspaceFolders) {
					const mayPath = `${workspaceFolders[v as unknown as number]}${sep}${path}`;
					try {
						const stat = fs.statSync(mayPath);
						if (stat.isFile()) {
							path = mayPath;
							found = true;
							break;
						}
					} catch (e: any) {
						// do nothing
					}
				}

				if(!found){
					vscode.window.showInformationMessage('No such file, failed to open!');
					return;
				}
			}

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

			vscode.window.showTextDocument(vscode.Uri.file(path)).then((editor)=>{
				if(lineIndex === -1){
					return;
				}

                if(typeof charIndex === 'undefined'){
                    charIndex = 1;
                }

                const lineNumber = Math.max(1, Number(lineIndex));
                const range = editor?.document.lineAt(lineNumber - 1).range;
                editor?.revealRange(range);
                const position = editor.selection.active;
                const newPosition = position.with(lineNumber - 1, Number(charIndex)-1);
				const newSelection = new vscode.Selection(newPosition, newPosition);
                editor.selection = newSelection;
			});
		});
	});

	context.subscriptions.push(disposable);

	const copyToSearch= vscode.commands.registerCommand('copy-to-open.openSearchInClipboard', () => {
		vscode.env.clipboard.readText().then((text) => {
			if(text.length < 2 || text.trim().length > 1024) {
				return;
			}
			webSearch(text.trim().substring(0, 255));
		});
	});
	context.subscriptions.push(copyToSearch);
}

//Function to launch the Search URL in default browser
function webSearch(selectedText: string) {
	if (!selectedText) {
	  return;
	}
	const uriText = encodeURI(selectedText);
	const googleSearchCfg = vscode.workspace.getConfiguration(CFG_SECTION);
	const queryTemplate = googleSearchCfg.get<string>(CFG_QUERY);
	const query = queryTemplate?.replace("%SELECTION%", uriText);
	if(!query) {
		return;
	};
	vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(query));
  }

// this method is called when your extension is deactivated
export function deactivate() {}
