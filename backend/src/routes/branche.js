import express from "express"
import branchesController from "../controllers/brancheController.js";

//Router() nos ayuda a colocar metodos
//que vamos a usar

const router = express();

router.route("/")
.get(branchesController.getbranches)
.post(branchesController.insertbranches)

router.route("/:id")
.put(branchesController.updateBranches)
.delete(branchesController.deleteBranches)

export default router;