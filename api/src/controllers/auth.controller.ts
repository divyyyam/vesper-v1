import { Hono } from "hono";
import { Context } from "hono";
import { eq } from "drizzle-orm";
import { users, lawyers } from "../db/schema"; // Import your schema
import { getDb } from "../db/db.service";
import * as dotenv from "dotenv";
import { sign } from "hono/jwt";

dotenv.config();

const createToken = (id: string) => {
  return sign({ id }, process.env.JWT_SECRET as string);
};

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
};

export const registerUser = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email, name, password } = await c.req.json();

    
    if (!email || !name || !password ) {
      return c.json({
        success: false,
        message: "Email, name, password, and wallet address are required"
      }, 400);
    }

   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({
        success: false,
        message: "Invalid email format"
      }, 400);
    }

    
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({
        success: false,
        message: "User with this email already exists"
      }, 409);
    }

    
    const hashedPassword = await hashPassword(password);
    const newUser = await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    
    }).returning();

    
    const token = await createToken(newUser[0].id);

    return c.json({
      success: true,
      message: "User registered successfully",
      token,
      email: newUser[0].email,
      id: newUser[0].id
    }, 201);

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "User registration failed"
    }, 500);
  }
};

export const registerAdv = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email, name, password,stateRollNumber,specialization } = await c.req.json();

    
    if (!email || !name || !password  ||!stateRollNumber ||!specialization) {
      return c.json({
        success: false,
        message: "Email, name, password, and specialization are required"
      }, 400);
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({
        success: false,
        message: "Invalid email format"
      }, 400);
    }

    const existingLawyer = await db
      .select()
      .from(lawyers)
      .where(eq(lawyers.email, email))
      .limit(1);

    if (existingLawyer.length > 0) {
      return c.json({
        success: false,
        message: "Lawyer with this email already exists"
      }, 409);
    }

  
    const hashedPassword = await hashPassword(password);
    const newLawyer = await db.insert(lawyers).values({
      email,
      name,
      password: hashedPassword,
      specialization,
      stateRollNumber
    }).returning();

     
    const token = await createToken(newLawyer[0].id);

    return c.json({
      success: true,
      message: "Lawyer registered successfully",
      token,
      email: newLawyer[0].email,
      id: newLawyer[0].id,
      stateRollNumber:newLawyer[0].stateRollNumber,
      specialization:newLawyer[0].specialization
    }, 201);

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Lawyer registration failed"
    }, 500);
  }
};

export const loginUser = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email, password } = await c.req.json();

    
    if (!email || !password) {
      return c.json({
        success: false,
        message: "Email and password are required"
      }, 400);
    }

     
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return c.json({
        success: false,
        message: "Invalid credentials"
      }, 401);
    }

    const userData = user[0];

     
    const isPasswordValid = await verifyPassword(password, userData.password);
    if (!isPasswordValid) {
      return c.json({
        success: false,
        message: "Invalid credentials"
      }, 401);
    }

     
    const token = await createToken(userData.id);

    return c.json({
      success: true,
      token,
      email: userData.email,
      id: userData.id,
     
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "User login failed"
    }, 500);
  }
};

export const loginAdv = async (c: Context) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email, password,stateRollNumber } = await c.req.json();

    
    if (!email || !password ||!stateRollNumber) {
      return c.json({
        success: false,
        message: "Email and password are required"
      }, 400);
    }

    
    const lawyer = await db
      .select()
      .from(lawyers)
      .where(eq(lawyers.email, email))
      .limit(1);

    if (lawyer.length === 0) {
      return c.json({
        success: false,
        message: "Invalid credentials"
      }, 401);
    }

    const lawyerData = lawyer[0];

     
    const isPasswordValid = await verifyPassword(password, lawyerData.password);
    if (!isPasswordValid) {
      return c.json({
        success: false,
        message: "Invalid credentials"
      }, 401);
    }

     
    const token = await createToken(lawyerData.id);

    return c.json({
      success: true,
      token,
      email: lawyerData.email,
      id: lawyerData.id,
       
      stateRollNumber:lawyerData.stateRollNumber
    });

  } catch (error) {
    console.log(error);
    return c.json({
      success: false,
      message: error instanceof Error ? error.message : "Lawyer login failed"
    }, 500);
  }
};