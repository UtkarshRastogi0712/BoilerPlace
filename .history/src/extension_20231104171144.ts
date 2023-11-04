import * as vscode from "vscode";
import { TextEncoder } from "util";
import path = require("path");
import { text } from "stream/consumers";
import "./identifier.validator";
import { identifierValidator } from "./identifier.validator";
import initFile from "./boilerplates/boilerplace.init.json";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "boilerplace" is now active!');

  let origin: vscode.Uri;
  let baseDirectory: vscode.Uri;
  let boilerplaceInit: vscode.Uri;

  const initCode = (varname: string) => {
    return `const ${varname} = () => {
    console.log("Hello World");
  }`;
  };

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

  const init = vscode.commands.registerCommand("boilerplace.init", async () => {
    if (vscode.workspace.workspaceFolders !== undefined) {
      origin = vscode.Uri.file(vscode.workspace.workspaceFolders[0].uri.fsPath);
      const packageCheck: vscode.Uri[] = await vscode.workspace.findFiles(
        "**/package.json",
        "**/node_modules/**/package.json"
      );
      if (packageCheck.length == 0) {
        vscode.window.showErrorMessage(
          "No package.json found. Initialize node project to start."
        );
        return;
      } else if (packageCheck.length == 1) {
        baseDirectory = vscode.Uri.file(path.dirname(packageCheck[0].fsPath));
        console.log(baseDirectory);
      } else {
        const packageOptions: string[] = [];
        packageCheck.forEach((element) => {
          packageOptions.push(path.dirname(element.fsPath));
        });
        const selectedPackage: string | undefined =
          await vscode.window.showQuickPick(packageOptions, {
            placeHolder: "Select a package.json",
          });
        if (selectedPackage !== undefined) {
          baseDirectory = vscode.Uri.file(selectedPackage);
        } else {
          vscode.window.showErrorMessage(
            "No package.json found. Initialize node project to start."
          );
          return;
        }
        console.log(baseDirectory);
      }
    } else {
      vscode.window.showErrorMessage("Open a workspace folder to begin.");
      return;
    }

    try {
      let selectedText: string = "Enter the preferred variable name!";
      const textQuery: string | undefined = await vscode.window.showInputBox({
        placeHolder: "Text query",
        prompt: "Enter text",
        value: selectedText,
      });

      if (textQuery === undefined || !identifierValidator(textQuery)) {
        vscode.window.showErrorMessage("Enter a valid variable name");
        return;
      }

      boilerplaceInit = vscode.Uri.joinPath(origin, "/boilerplace.js");
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      const enc: TextEncoder = new TextEncoder();
      const data: Uint8Array = enc.encode(initCode(textQuery));

      wsedits.createFile(boilerplaceInit, {
        overwrite: true,
        contents: data,
      });
      vscode.workspace.applyEdit(wsedits);
    } catch (err) {
      vscode.window.showErrorMessage("Something went wrong. Try Again.");
    }
  });

  context.subscriptions.push(disposable, init);
}

export function deactivate() {}
