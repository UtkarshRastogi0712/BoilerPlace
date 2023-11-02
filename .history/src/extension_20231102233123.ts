// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import { error } from "console";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "boilerplace" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "boilerplace.helloWorld",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
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

  let readDirectory = vscode.commands.registerCommand(
    "boilerplace.readDirectory",
    async () => {
      vscode.window.showInformationMessage("Running");
      if (vscode.workspace.workspaceFolders !== undefined) {
        console.log(
          await vscode.workspace.fs.readDirectory(
            vscode.Uri.parse(vscode.workspace.workspaceFolders[0].uri.path)
          )
        );
      }
    }
  );

  let init = vscode.commands.registerCommand("boilerplace.init", async () => {
    const initFile = {
      origin: "app origin path",
      elements: ["models"],
    };
    const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    let origin: vscode.Uri;

    if (vscode.workspace.workspaceFolders !== undefined) {
      origin = vscode.Uri.parse(vscode.workspace.workspaceFolders[0].uri.path);
      wsedits.createFile(vscode.Uri.joinPath(origin, "../../boilerplace.json"));
      vscode.workspace.applyEdit(wsedits);
      console.log(vscode.Uri.joinPath(origin, "../../boilerplace.json"));
      fs.writeFile(
        vscode.Uri.joinPath(origin, "/boilerplace.json").toString(),
        JSON.stringify(initFile),
        (err) => {
          vscode.window.showErrorMessage("Something went wrong");
          console.error(err);
        }
      );
    } else {
      vscode.window.showErrorMessage("No workspace found");
    }
  });

  context.subscriptions.push(disposable, readDirectory, init);
}

// This method is called when your extension is deactivated
export function deactivate() {}
