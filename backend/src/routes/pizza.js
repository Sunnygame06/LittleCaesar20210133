import express from "express";

//Router() nos ayuda a colocar los metodos
//que tendra el endpoint
const router = express.Router()

router.route("/")
.get()
.post()

router.route("/:id")
.put()
.delete()

export default router