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
  boilerplaceInitCheck,
} from "./helpers/startup.utilities";
import boilerplaceComponentCreate from "./helpers/component.create";

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
  boilerplaceInitCheck
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
          boilerplaceInit = await boilerplaceInitCheck;
        };
        return;
      }

      try {
        let boilerplaceData: any = await vscode.workspace.fs
          .readFile(boilerplaceInit)
          .then((data) => {
            return JSON.parse(data.toString());
          });
        vscode.window.showInformationMessage(JSON.stringify(boilerplaceData));
        const validationResults = schema.validate(boilerplaceData);
        if (validationResults.error) {
          vscode.window.showErrorMessage(
            "Invalid input in boilerplace.json. Does not match expected schema."
          );
          return;
        } else {
          entryPoint = vscode.Uri.joinPath(
            baseDirectory,
            boilerplaceData.entryPoint
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

          const entities: Array<any> = boilerplaceData.entities;
          let flag: boolean = true;
          for (let i = 0; i < entities.length; i++) {
            const entity: string = JSON.parse(JSON.stringify(entities[i])).name;
            if (!boilerplaceComponentCreate(baseDirectory, entity)) {
              flag = false;
            }
            if (!flag) {
              vscode.window.showErrorMessage(
                "Could not create one or more files properly."
              );
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  );

  context.subscriptions.push(disposable, init);
}

export function deactivate() {}
