import * as vscode from "vscode";
import path = require("path");

let workspaceCheck = (): vscode.Uri | null => {
  if (vscode.workspace.workspaceFolders !== undefined) {
    let origin: vscode.Uri = vscode.Uri.file(
      vscode.workspace.workspaceFolders[0].uri.fsPath
    );
    vscode.window.showInformationMessage("Workspace opened.");
    return origin;
  } else {
    vscode.window.showErrorMessage("Open a workspace folder to begin.");
    return null;
  }
};

let baseDirectoryCheck: Promise<vscode.Uri | null> = new Promise(
  async (resolve, reject) => {
    const packageCheck: vscode.Uri[] = await vscode.workspace.findFiles(
      "**/package.json",
      "**/node_modules/**/package.json"
    );
    let baseDirectory: vscode.Uri;
    if (packageCheck.length == 0) {
      vscode.window.showErrorMessage(
        "No package.json found. Initialize node project to start."
      );
      reject(null);
    } else if (packageCheck.length == 1) {
      baseDirectory = vscode.Uri.file(path.dirname(packageCheck[0].fsPath));
      vscode.window.showInformationMessage("Base directory found.");
      resolve(baseDirectory);
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
        vscode.window.showInformationMessage("Base directory found.");
        resolve(baseDirectory);
      } else {
        vscode.window.showErrorMessage(
          "No package.json found. Initialize node project to start."
        );
        reject(null);
      }
    }
  }
);

let boilerpalceInitCheck: Promise<vscode.Uri | null> = new Promise(
  async (resolve, reject) => {
    let boilerplaceInit: vscode.Uri | null;
    const boilerplaceCheck: vscode.Uri[] = await vscode.workspace.findFiles(
      "**/boilerplace.json"
    );
    if (boilerplaceCheck.length == 0) {
      vscode.window.showErrorMessage(
        "Couldnt find boilerpalce.json. Run boilerpalce init first"
      );
      reject(null);
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
);

export { workspaceCheck, baseDirectoryCheck };
