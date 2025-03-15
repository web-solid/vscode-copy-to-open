import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });



    for (let i = 1; i <= 5; i++) {
        test(`Split Command Line Test - Iteration ${i}`, async () => {
            const commandLine = 'git show fd766eba2b -- scripts/cmake/vcpkg_acquire_msys.cmake';
            await vscode.env.clipboard.writeText(commandLine);

            await vscode.commands.executeCommand('copy-to-open.splitCommandLine');

            // Wait for 1 second
            await new Promise((resolve) => setTimeout(resolve, 50));

            const splitCommandLine = await vscode.env.clipboard.readText();
            const expected = '"git", "show", "fd766eba2b", "--", "scripts/cmake/vcpkg_acquire_msys.cmake"';

            assert.strictEqual(splitCommandLine, expected);
        });
        
        test(`Split Command Line Test-2 - Iteration ${i}`, async () => {
            const commandLine = `xvfb-run -s '-screen 0 1920x1080x24' node ./out/test/runTest.js`;
            await vscode.env.clipboard.writeText(commandLine);

            await vscode.commands.executeCommand('copy-to-open.splitCommandLine');

            // Wait for 1 second
            await new Promise((resolve) => setTimeout(resolve, 50));

            const splitCommandLine = await vscode.env.clipboard.readText();
            const expected =
                `"xvfb-run", "-s", "'-screen 0 1920x1080x24'", "node", "./out/test/runTest.js"`;

            assert.strictEqual(splitCommandLine, expected);
        });

        test(`Split Command Line Test-3 - Iteration ${i}`, async () => {
            const commandLine = `git log --pretty=format:"%h %ad %s" --date=short -S"libtool-2.4.6"`;
            await vscode.env.clipboard.writeText(commandLine);

            await vscode.commands.executeCommand('copy-to-open.splitCommandLine');

            // Wait for 1 second
            await new Promise((resolve) => setTimeout(resolve, 50));

            const splitCommandLine = await vscode.env.clipboard.readText();
            const expected = `"git", "log", "--pretty=format:'%h %ad %s'", "--date=short", "-S'libtool-2.4.6'"`;

            assert.strictEqual(splitCommandLine, expected);
        });
    }
});
