import * as vscode from "vscode";
import { TextEncoder } from "util";
import path = require("path");
import { text } from "stream/consumers";
import "./identifier.validator";
import { identifierValidator } from "./identifier.validator";
import initFile from "./boilerplates/boilerplace.init.json";
import appFile from "./boilerplates/boilerplace.app.js";
import schema from "./boilerplace.schema";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "boilerplace" is now active!');

  let origin: vscode.Uri | null = null;
  let baseDirectory: vscode.Uri | null = null;
  let boilerplaceInit: vscode.Uri | null = null;
  let entryPoint: vscode.Uri | null = null;

  let workspaceCheck = () => {
    if (vscode.workspace.workspaceFolders !== undefined) {
      origin = vscode.Uri.file(vscode.workspace.workspaceFolders[0].uri.fsPath);
      vscode.window.showInformationMessage("Workspace opened.");
    } else {
      vscode.window.showErrorMessage("Open a workspace folder to begin.");
      return;
    }
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
      /*
      let selectedText: string = "Enter the preferred variable name!";
      const textQuery: string | undefined = await vscode.window.showInputBox({
        placeHolder: "Text query",
        prompt: "Enter text",
        value: selectedText,
      });

      if (textQuery === undefined || !identifierValidator(textQuery)) {
        vscode.window.showErrorMessage("Enter a valid variable name");
        return;
      }*/

      boilerplaceInit = vscode.Uri.joinPath(origin, "/boilerplace.json");
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      const enc: TextEncoder = new TextEncoder();
      const data: Uint8Array = enc.encode(JSON.stringify(initFile));

      wsedits.createFile(boilerplaceInit, {
        ignoreIfExists: true,
        contents: data,
      });
      vscode.workspace.applyEdit(wsedits);
      vscode.window.showInformationMessage(
        "boilerplace.json ready to be configured"
      );
    } catch (err) {
      vscode.window.showErrorMessage("Something went wrong. Try Again.");
    }
  });

  const create = vscode.commands.registerCommand(
    "boilerplace.create",
    async () => {
      if (!origin) {
        vscode.window.showErrorMessage("Open a workspace folder to begin.");
        return;
      } else if (!baseDirectory) {
        vscode.window.showErrorMessage(
          "No package.json found. Initialize node project to start."
        );
        return;
      } else {
        const boilerplaceCheck: vscode.Uri[] = await vscode.workspace.findFiles(
          "**/boilerplace.json"
        );
        if (boilerplaceCheck.length == 0) {
          vscode.window.showErrorMessage(
            "Couldnt find boilerpalce.json. Run boilerpalce init first"
          );
          return;
        } else if (boilerplaceCheck.length == 1) {
          boilerplaceInit = boilerplaceCheck[0];
        } else {
          const boilerplaceOptions: string[] = [];
          boilerplaceCheck.forEach((element) => {
            boilerplaceOptions.push(element.fsPath);
          });
          const selectedBoilerplace: string | undefined =
            await vscode.window.showQuickPick(boilerplaceOptions, {
              placeHolder: "Select a boilerplace.json",
            });
          if (selectedBoilerplace !== undefined) {
            boilerplaceInit = vscode.Uri.file(selectedBoilerplace);
          } else {
            vscode.window.showErrorMessage(
              "No boilerplace.json found. Run boilerplace init first."
            );
            return;
          }
        }
      }

      try {
        let boilerpalceData: any = await vscode.workspace.fs
          .readFile(boilerplaceInit)
          .then((data) => {
            return JSON.parse(data.toString());
          });
        vscode.window.showInformationMessage(JSON.stringify(boilerpalceData));
        const validationResults = schema.validate(boilerpalceData);
        if (validationResults.error) {
          vscode.window.showErrorMessage(
            "Invalid input in boilerplace.json.Does not match expected schema."
          );
          return;
        } else {
          //create app.js file;
          entryPoint = vscode.Uri.joinPath(
            baseDirectory,
            boilerpalceData.entryPoint
          );
          const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
          const enc: TextEncoder = new TextEncoder();
          const app: Uint8Array = enc.encode(appFile());
          vscode.workspace.fs
            .readFile(vscode.Uri.file("../boilerplates/testapp.js"))
            .then((data) => {
              vscode.window.showInformationMessage(data.toString());
            });

          wsedits.createFile(entryPoint, {
            ignoreIfExists: true,
            contents: app,
          });
          vscode.workspace.applyEdit(wsedits);
          vscode.window.showInformationMessage("app.js ready to be configured");

          ///
          if (vscode.workspace.workspaceFolders !== undefined) {
            vscode.workspace.fs
              .readDirectory(vscode.workspace.workspaceFolders[0].uri)
              .then((elements) => {
                elements.forEach((element) => {
                  vscode.window.showInformationMessage(element[0]);
                });
              });
          }
          ///
        }
      } catch (err) {
        console.error(err);
      }
    }
  );

  context.subscriptions.push(disposable, init);
}

export function deactivate() {}
