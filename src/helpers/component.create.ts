import * as vscode from "vscode";
import { TextEncoder } from "util";

let boilerplaceComponentCreate = (
  baseUri: vscode.Uri,
  contents: string,
  fileName?: string
): boolean => {
  if (fileName) {
    try {
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      const enc: TextEncoder = new TextEncoder();
      const fileContents: Uint8Array = enc.encode(contents);

      wsedits.createFile(
        vscode.Uri.joinPath(baseUri, "/boilerplaceComponents", fileName),
        {
          ignoreIfExists: true,
          contents: fileContents,
        }
      );
      vscode.workspace.applyEdit(wsedits);
      vscode.window.showInformationMessage(
        fileName + " ready to be configured"
      );
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export default boilerplaceComponentCreate;
