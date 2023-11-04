import * as vscode from "vscode";
import { TextEncoder } from "util";
import path = require("path");

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "boilerplace" is now active!');

  let origin: vscode.Uri;
  let baseDirectory: vscode.Uri;

  let disposable = vscode.commands.registerCommand(
    "boilerplace.helloWorld",
    async () => {
      let selectedText: string = "Enter the text to say hi!";
      const textQuery = await vscode.window.showInputBox({
        placeHolder: "Text query",
        prompt: "Enter text",
        value: selectedText,
      });
      if (textQuery === "") {
        console.log(textQuery);
        vscode.window.showErrorMessage(
          "A text query is mandatory to execute this action"
        );
      }

      if (textQuery !== undefined) {
        vscode.window.showInformationMessage(`Hello World from ${textQuery}!`);
      }
    }
  );

  let oldInit = vscode.commands.registerCommand(
    "boilerplace.oldInit",
    async () => {
      const initFile: string =
        '{"origin" : "app origin path", "elements" : ["entities"]}';
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      let oldOrigin: vscode.Uri;

      if (vscode.workspace.workspaceFolders !== undefined) {
        oldOrigin = vscode.Uri.file(
          vscode.workspace.workspaceFolders[0].uri.fsPath + "/boilerplace.json"
        );

        const enc: TextEncoder = new TextEncoder();
        const data: Uint8Array = enc.encode(initFile);

        wsedits.createFile(oldOrigin, {
          ignoreIfExists: true,
          contents: data,
        });
        vscode.workspace.applyEdit(wsedits);
      } else {
        vscode.window.showErrorMessage("No workspace found");
      }
    }
  );

  let oldInitCode = vscode.commands.registerCommand(
    "boilerplace.oldInitCode",
    async () => {
      const varname = await vscode.window.showInputBox({
        placeHolder: "Text query",
        prompt: "Enter text",
        value: "Variable Name",
      });

      const initCode: string = `const ${varname} = () => {
        console.log("Hello World");
      }
      ${varname}()`;
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      let oldOrigin: vscode.Uri;

      if (vscode.workspace.workspaceFolders !== undefined) {
        oldOrigin = vscode.Uri.file(
          vscode.workspace.workspaceFolders[0].uri.fsPath + "/boilerapp.js"
        );

        const enc: TextEncoder = new TextEncoder();
        const data: Uint8Array = enc.encode(initCode);

        wsedits.createFile(oldOrigin, {
          ignoreIfExists: true,
          contents: data,
        });
        vscode.workspace.applyEdit(wsedits);
      } else {
        vscode.window.showErrorMessage("No workspace found");
      }
    }
  );

  const init = vscode.commands.registerCommand("boilerplace.init", async () => {
    if (vscode.workspace.workspaceFolders !== undefined) {
      origin = vscode.Uri.file(vscode.workspace.workspaceFolders[0].uri.fsPath);
      const packageCheck: vscode.Uri[] = await vscode.workspace.findFiles(
        "**/package.json",
        "**/node_modules/**/package.json"
      );
      if (packageCheck.length == 0) {
        vscode.window.showErrorMessage("No package.json found");
      } else if (packageCheck.length == 1) {
        baseDirectory = vscode.Uri.parse(path.dirname(packageCheck[0].fsPath));
        console.log(baseDirectory);
      } else {
        const packageOptions: string[] = [];
        packageCheck.forEach((element) => {
          packageOptions.push(element.fsPath);
        });
        const selectedPackage: string | undefined =
          await vscode.window.showQuickPick(packageOptions, {
            placeHolder: "Select a package.json",
          });
        if (selectedPackage !== undefined) {
          baseDirectory = selectedPackage;
        }
        console.log(vscode.Uri.parse(path.dirname(baseDirectory.toString())));
      }
    } else {
      vscode.window.showErrorMessage("Open a workspace folder to begin");
    }
  });

  context.subscriptions.push(disposable, oldInit, oldInitCode, init);
}

// This method is called when your extension is deactivated
export function deactivate() {}
