function importRoutes(entities) {
  let allImports = "\n";
  for (let i = 0; i < entities.length; i++) {
    allImports += `import ${entities[i]}Router from "./boilerplaceComponents/${entities[i]}/${entities[i]}.router"; \n`;
  }
  return allImports;
}

function useRoutes(entities) {
  let useImports = "\n";
  for (let i = 0; i < entities.length; i++) {
    useImports += `app.use("/${entities[i]}s",${entities[i]}Router); \n`;
  }
  return useImports;
}
function appFile(entities) {
  return `
import express from "express";
${importRoutes(entities)}
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
${useRoutes(entities)}

app.get("/", async (req, res, next) => {
  res.send("It works!");
});

app.listen(PORT, () => {
  console.log("Server is running");
});`;
}

export default appFile;
