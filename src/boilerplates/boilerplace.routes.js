function routerFile(entityName) {
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  return `import { Router } from "express";
import {
 create${entity}Controller,
 get${entity}Controller,
 update${entity}Controller,
 delete${entity}Controller,
} from "./${entityName}.controller";

const router = Router();

router.post("/", create${entity}Controller);
router.get("/:id", get${entity}Controller);
router.put("/:id", update${entity}Controller);
router.delete("/:id", delete${entity}Controller);

export default router;
`;
}
export default routerFile;
