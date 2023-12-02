import * as vscode from "vscode";
import { TextEncoder } from "util";
import controllerFile from "../boilerplates/boilerplace.controllers";
import serviceFile from "../boilerplates/boilerplace.services";
import schemaFile from "../boilerplates/boilerplace.schema.js";
import routerFile from "../boilerplates/boilerplace.routes";

let boilerplaceComponentCreate = (
  baseUri: vscode.Uri,
  fileName?: string
): boolean => {
  if (fileName) {
    try {
      const wsedits: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
      const enc: TextEncoder = new TextEncoder();

      const routerContents: Uint8Array = enc.encode(routerFile(fileName));
      const controllerContents: Uint8Array = enc.encode(
        controllerFile(fileName)
      );
      const serviceContents: Uint8Array = enc.encode(serviceFile(fileName));
      const schemaContents: Uint8Array = enc.encode(schemaFile(fileName));

      wsedits.createFile(
        vscode.Uri.joinPath(
          baseUri,
          `/boilerplaceComponents/${fileName}`,
          fileName + ".router.js"
        ),
        {
          ignoreIfExists: true,
          contents: routerContents,
        }
      );

      wsedits.createFile(
        vscode.Uri.joinPath(
          baseUri,
          `/boilerplaceComponents/${fileName}`,
          fileName + ".controller.js"
        ),
        {
          ignoreIfExists: true,
          contents: controllerContents,
        }
      );

      wsedits.createFile(
        vscode.Uri.joinPath(
          baseUri,
          `/boilerplaceComponents/${fileName}`,
          fileName + ".service.js"
        ),
        {
          ignoreIfExists: true,
          contents: serviceContents,
        }
      );

      wsedits.createFile(
        vscode.Uri.joinPath(
          baseUri,
          `/boilerplaceComponents/${fileName}`,
          fileName + ".schema.js"
        ),
        {
          ignoreIfExists: true,
          contents: schemaContents,
        }
      );

      vscode.workspace.applyEdit(wsedits);
      return true;
    } catch {
      return false;
    }
  }
  return false;
};

export default boilerplaceComponentCreate;
