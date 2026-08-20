import { Context } from "hono";
import { eq, desc, and } from "drizzle-orm";
import { appointments, users, lawyers } from "../db/schema";
import { getDb } from "../db/db.service";
import * as dotenv from "dotenv";

dotenv.config();

 
export const addAppointment = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { title, description, reason, userEmail, lawyerEmail, scheduledAt } = await c.req.json();

    // Validate required fields
    if (!title || !description || !reason || !userEmail || !lawyerEmail || !scheduledAt) {
      return c.json({
        success: false,
        message: "All fields (title, description, reason, userEmail, lawyerEmail, scheduledAt) are required"
      }, 400);
    }

   
    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return c.json({
        success: false,
        message: "Invalid date format for scheduledAt"
      }, 400);
    }

    if (scheduledDate <= new Date()) {
      return c.json({
        success: false,
        message: "Scheduled time must be in the future"
      }, 400);
    }
 
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (user.length === 0) {
      return c.json({
        success: false,
        message: "User not found"
      }, 404);
    }

    // Verify that lawyer exists
    const lawyer = await db
      .select()
      .from(lawyers)
      .where(eq(lawyers.email, lawyerEmail))
      .limit(1);

    if (lawyer.length === 0) {
      return c.json({
        success: false,
        message: "Lawyer not found"
      }, 404);
    }

   
    const conflictingAppointment = await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.lawyerEmail, lawyerEmail),
          eq(appointments.scheduledAt, scheduledDate)
        )
      )
      .limit(1);

    if (conflictingAppointment.length > 0) {
      return c.json({
        success: false,
        message: "Lawyer already has an appointment scheduled at this time"
      }, 409);
    }

    const newAppointment = await db.insert(appointments).values({
      title,
      description,
      reason,
      userEmail,
      lawyerEmail,
      scheduledAt: scheduledDate,
    }).returning();

    return c.json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment[0]
    }, 201);

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create appointment"
    }, 500);
  }
};

 
export const getAllAppointments = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const allAppointments = await db
      .select({
        id: appointments.id,
        title: appointments.title,
        description: appointments.description,
        reason: appointments.reason,
        userEmail: appointments.userEmail,
        lawyerEmail: appointments.lawyerEmail,
        scheduledAt: appointments.scheduledAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        userName: users.name,
        userWalletAddress: users.walletAddress,
        lawyerName: lawyers.name,
       
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userEmail, users.email))
      .leftJoin(lawyers, eq(appointments.lawyerEmail, lawyers.email))
      .orderBy(desc(appointments.scheduledAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      success: true,
      appointments: allAppointments,
      total: allAppointments.length,
      limit,
      offset
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch appointments"
    }, 500);
  }
};
 
export const getAppointmentById = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const appointmentId = c.req.param('id');

    if (!appointmentId) {
      return c.json({
        success: false,
        message: "Appointment ID is required"
      }, 400);
    }

    const appointment = await db
      .select({
        id: appointments.id,
        title: appointments.title,
        description: appointments.description,
        reason: appointments.reason,
        userEmail: appointments.userEmail,
        lawyerEmail: appointments.lawyerEmail,
        scheduledAt: appointments.scheduledAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          walletAddress: users.walletAddress
        },
        lawyer: {
          id: lawyers.id,
          name: lawyers.name,
          email: lawyers.email,
          
        }
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userEmail, users.email))
      .leftJoin(lawyers, eq(appointments.lawyerEmail, lawyers.email))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (appointment.length === 0) {
      return c.json({
        success: false,
        message: "Appointment not found"
      }, 404);
    }

    return c.json({
      success: true,
      appointment: appointment[0]
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch appointment"
    }, 500);
  }
};

 
export const removeAppointment = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const appointmentId = c.req.param('id');

    if (!appointmentId) {
      return c.json({
        success: false,
        message: "Appointment ID is required"
      }, 400);
    }

   
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (existingAppointment.length === 0) {
      return c.json({
        success: false,
        message: "Appointment not found"
      }, 404);
    }

  
    await db
      .delete(appointments)
      .where(eq(appointments.id, appointmentId));

    return c.json({
      success: true,
      message: "Appointment deleted successfully"
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete appointment"
    }, 500);
  }
};
 
export const editAppointment = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const appointmentId = c.req.param('id');
    const { title, description, reason, scheduledAt } = await c.req.json();

    if (!appointmentId) {
      return c.json({
        success: false,
        message: "Appointment ID is required"
      }, 400);
    }

 
    const existingAppointment = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (existingAppointment.length === 0) {
      return c.json({
        success: false,
        message: "Appointment not found"
      }, 404);
    }

   
    const updateData: any = {
      updatedAt: new Date()
    };

    if (title !== undefined) {
      if (!title.trim()) {
        return c.json({
          success: false,
          message: "Title cannot be empty"
        }, 400);
      }
      updateData.title = title;
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return c.json({
          success: false,
          message: "Description cannot be empty"
        }, 400);
      }
      updateData.description = description;
    }

    if (reason !== undefined) {
      if (!reason.trim()) {
        return c.json({
          success: false,
          message: "Reason cannot be empty"
        }, 400);
      }
      updateData.reason = reason;
    }

    if (scheduledAt !== undefined) {
      const scheduledDate = new Date(scheduledAt);
      if (isNaN(scheduledDate.getTime())) {
        return c.json({
          success: false,
          message: "Invalid date format for scheduledAt"
        }, 400);
      }

      if (scheduledDate <= new Date()) {
        return c.json({
          success: false,
          message: "Scheduled time must be in the future"
        }, 400);
      }

       
      const conflictingAppointment = await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.lawyerEmail, existingAppointment[0].lawyerEmail),
            eq(appointments.scheduledAt, scheduledDate),
             
            eq(appointments.id, appointmentId)
          )
        )
        .limit(1);

      if (conflictingAppointment.length > 0 && conflictingAppointment[0].id !== appointmentId) {
        return c.json({
          success: false,
          message: "Lawyer already has an appointment scheduled at this time"
        }, 409);
      }

      updateData.scheduledAt = scheduledDate;
    }

   
    if (Object.keys(updateData).length === 1) {  
      return c.json({
        success: false,
        message: "At least one field (title, description, reason, or scheduledAt) must be provided for update"
      }, 400);
    }

     
    const updatedAppointment = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, appointmentId))
      .returning();

    return c.json({
      success: true,
      message: "Appointment updated successfully",
      appointment: updatedAppointment[0]
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update appointment"
    }, 500);
  }
};

 
export const getLawyerAppointments = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const lawyerEmail = c.req.param('email');

    if (!lawyerEmail) {
      return c.json({
        success: false,
        message: "Lawyer email is required"
      }, 400);
    }

    // Verify lawyer exists
    const lawyer = await db
      .select()
      .from(lawyers)
      .where(eq(lawyers.email, lawyerEmail))
      .limit(1);

    if (lawyer.length === 0) {
      return c.json({
        success: false,
        message: "Lawyer not found"
      }, 404);
    }

    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const lawyerAppointments = await db
      .select({
        id: appointments.id,
        title: appointments.title,
        description: appointments.description,
        reason: appointments.reason,
        userEmail: appointments.userEmail,
        scheduledAt: appointments.scheduledAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        user: {
          name: users.name,
          email: users.email,
          walletAddress: users.walletAddress
        }
      })
      .from(appointments)
      .leftJoin(users, eq(appointments.userEmail, users.email))
      .where(eq(appointments.lawyerEmail, lawyerEmail))
      .orderBy(desc(appointments.scheduledAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      success: true,
      appointments: lawyerAppointments,
      total: lawyerAppointments.length,
      limit,
      offset
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch lawyer appointments"
    }, 500);
  }
};

 
export const getUserAppointments = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const userEmail = c.req.param('email');

    if (!userEmail) {
      return c.json({
        success: false,
        message: "User email is required"
      }, 400);
    }

  
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    if (user.length === 0) {
      return c.json({
        success: false,
        message: "User not found"
      }, 404);
    }

    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const userAppointments = await db
      .select({
        id: appointments.id,
        title: appointments.title,
        description: appointments.description,
        reason: appointments.reason,
        lawyerEmail: appointments.lawyerEmail,
        scheduledAt: appointments.scheduledAt,
        createdAt: appointments.createdAt,
        updatedAt: appointments.updatedAt,
        lawyer: {
          name: lawyers.name,
          email: lawyers.email,
           
        }
      })
      .from(appointments)
      .leftJoin(lawyers, eq(appointments.lawyerEmail, lawyers.email))
      .where(eq(appointments.userEmail, userEmail))
      .orderBy(desc(appointments.scheduledAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      success: true,
      appointments: userAppointments,
      total: userAppointments.length,
      limit,
      offset
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch user appointments"
    }, 500);
  }
};


export const getAllLawyers = async (c:Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const lawyerList = await db.select().from(lawyers).orderBy(lawyers.createdAt)
    return c.json({
      success:true,
      data:lawyerList
    })
    
  } catch (error) {
    console.error("Error fetching lawyers",error);
    return c.json({
      success:false,
      message:"Failed to fetch lawyers"
    },500)
  }
}