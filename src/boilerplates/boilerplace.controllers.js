function controllerFile(entityName) {
  entity = entityName.charAt(0).toUpperCase() + string.slice(1);
  return `
import { Request, Response } from "express";
import {
 create${entity},
 get${entity},
 update${entity},
 delete${entity},
} from "./${entityName}.services";

const create${entity}Controller = async (req: Request, res: Response) => {
 try {
 const ${entityName} = await create${entity}(req.body);
 res.status(201).json(${entityName});
 } catch (err) {
 console.error(err);
 res.status(500).json({ message: err.message });
 }
};

const get${entity}Controller = async (req: Request, res: Response) => {
 try {
  const ${entityName} = await get${entity}(req.params.id);
  if (!${entityName}) {
   return res
    .status(200)
    .json({ success: false, message: "${entity} not found" });
  }
  res.status(200).json({ success: true, data: ${entityName} });
 } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
 }
};

const update${entity}Controller = async (req: Request, res: Response) => {
 try {
  const ${entityName} = await update${entity}(req.params.id, req.params.status);
  res.status(200).json(${entityName});
 } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
 }
};

const delete${entity}Controller = async (req: Request, res: Response) => {
 try {
  const ${entityName} = await delete${entity}(req.params.id);
   res.status(200).json(${entityName});
 } catch (err) {
  console.error(err);
  res.status(500).json({ message: err.message });
 }


export {
 create${entity}Controller,
 get${entity}Controller,
 update${entity}Controller,
 delete${entity}Controller,
};`;
}

export default controllerFile;
