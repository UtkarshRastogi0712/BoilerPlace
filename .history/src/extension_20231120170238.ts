import * as vscode from "vscode";
import { TextEncoder } from "util";
import path = require("path");
import { text } from "stream/consumers";
import "./identifier.validator";
import { identifierValidator } from "./identifier.validator";
import initFile from "./boilerplates/boilerplace.init.json";
import appFile from "./boilerplates/boilerplace.app.js";
import schema from "./boilerplace.schema";
import {
  workspaceCheck,
  baseDirectoryCheck,
  boilerpalceInitCheck,
} from "./helpers/startup.utilities";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "boilerplace" is now active!');

  let origin: vscode.Uri | null = workspaceCheck();
  let baseDirectory: vscode.Uri | null;
  baseDirectoryCheck
    .then((value) => {
      baseDirectory = value;
    })
    .catch(() => {
      baseDirectory = null;
    });
  let boilerplaceInit: vscode.Uri | null = null;
  boilerpalceInitCheck
    .then((value) => {
      boilerplaceInit = value;
    })
    .catch(() => {
      boilerplaceInit = null;
    });
  let entryPoint: vscode.Uri | null = null;

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

  const init = vscode.commands.registerCommand("boilerplace.init", () => {
    if (!origin) {
      async () => {
        origin = await workspaceCheck();
      };
      return;
    }

    if (!baseDirectory) {
      async () => {
        baseDirectory = await baseDirectoryCheck;
      };
      return;
    }

    try {
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
        async () => {
          origin = await workspaceCheck();
        };
        return;
      }

      if (!baseDirectory) {
        async () => {
          baseDirectory = await baseDirectoryCheck;
        };
        return;
      }

      if (!boilerplaceInit) {
        async () => {
          boilerplaceInit = await boilerpalceInitCheck;
        };
        return;
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
            "Invalid input in boilerplace.json. Does not match expected schema."
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
