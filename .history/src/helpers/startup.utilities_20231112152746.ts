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

let baseDirectoryCheck = async (): Promise<vscode.Uri | null> => {
  const packageCheck: vscode.Uri[] = await vscode.workspace.findFiles(
    "**/package.json",
    "**/node_modules/**/package.json"
  );
  let baseDirectory: vscode.Uri;
  if (packageCheck.length == 0) {
    vscode.window.showErrorMessage(
      "No package.json found. Initialize node project to start."
    );
    return Promise.resolve(null);
  } else if (packageCheck.length == 1) {
    baseDirectory = vscode.Uri.file(path.dirname(packageCheck[0].fsPath));
    return Promise.resolve(baseDirectory);
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
      return Promise.resolve(baseDirectory);
    } else {
      vscode.window.showErrorMessage(
        "No package.json found. Initialize node project to start."
      );
      return Promise.resolve(null);
    }
  }
};

export { workspaceCheck, baseDirectoryCheck };
