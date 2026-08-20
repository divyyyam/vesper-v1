import { addAppointment,getAllAppointments,getAppointmentById,editAppointment,removeAppointment ,getLawyerAppointments,getUserAppointments ,getAllLawyers} from "../controllers/appointment.controller";
import { Hono } from "hono";


const appointmentRoutes = new Hono()


appointmentRoutes.post("/add-appointment",addAppointment)

appointmentRoutes.get("/all-appointments",getAllAppointments)

appointmentRoutes.get("/id-appointment/:id",getAppointmentById)

appointmentRoutes.put("/edit-appointment/:id",editAppointment)

appointmentRoutes.delete("/remove-appointment/:id",removeAppointment)

appointmentRoutes.get("/user/:email",getUserAppointments)

appointmentRoutes.get("/lawyer/:email",getLawyerAppointments)

appointmentRoutes.get("/all-lawyers",getAllLawyers)


export default appointmentRoutes