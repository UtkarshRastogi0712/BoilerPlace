function schemaFile(entityName) {
  const entity = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  return `import mongoose, { Schema } from "mongoose";

const ${entityName}Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Lorem Ipsum",
  },
});

export default mongoose.model("${entity}", ${entityName}Schema);
`;
}

export default schemaFile;
