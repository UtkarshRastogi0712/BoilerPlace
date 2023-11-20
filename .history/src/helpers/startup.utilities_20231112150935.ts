import * as vscode from "vscode";

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

export default workspaceCheck;
