import { Hono } from "hono";
import { loginAdv,loginUser,registerAdv,registerUser } from "../controllers/auth.controller";

const authRoutes = new Hono();


authRoutes.post('/register-user',registerUser)

authRoutes.post('/login-user',loginUser)

authRoutes.post('/register-adv',registerAdv)

authRoutes.post('/login-adv',loginAdv)


export default authRoutes