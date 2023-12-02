function serviceFile(entityName) {
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  return `import ${entity} from "./${entityName}.schema";

const create${entity} = async (${entityName}) => {
 try {
  const new${entity} = new ${entity}(${entityName});
  const saved${entity} = await new${entity}.save();
  return saved${entity};
 } catch (err) {
  console.error(err);
  throw new Error(err);
 }
};

const get${entity} = async (id) => {
 try {
  const ${entityName} = await ${entity}.findOne({ id: id });
  return ${entityName};
 } catch (err) {
  console.error(err);
  throw new Error(err);
 }
};

const update${entity} = async (id, status) => {
 try {
  const ${entityName} = await ${entity}.findOneAndUpdate(
   { id: id },
   { status: status }
  );
  const updated${entity} = await ${entityName}?.save();
  return updated${entity};
 } catch (err) {
  console.error(err);
  throw new Error(err);
 }
};
 
const delete${entity} = async (id) => {
 try {
  const ${entityName} = await ${entity}.findOne({ id: id });
  const deleted${entity} = await ${entityName}?.deleteOne();
  return deleted${entity};
 } catch (err) {
  console.error(err);
  throw new Error(err);
 }
};

export { create${entity}, get${entity}, update${entity}, delete${entity} };`;
}

export default serviceFile;
