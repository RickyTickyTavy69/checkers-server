import {Router} from "express";
import AuthController from "../controllers/auth.controller.js";
import {check} from "express-validator";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// here express-validator is used to validate the fields in the object, which is coming from react front end.

router.post("/create", [
    check("username").notEmpty().isLength({min: 4}),
    check("email").isEmail(),
    check("password").isLength({min: 4}),
], AuthController.register);

router.get("/getUsers", authMiddleware, AuthController.getUsers);
router.get("/getOne/:id", AuthController.getOneUser);
router.delete("/delete/:id", AuthController.deleteUser);
router.put("/update", AuthController.updateUser);

/*Login*/

router.post("/login", [
    check("username").notEmpty().isLength({min: 4}),
    check("password").isLength({min: 4}),
], AuthController.login);

export default router;