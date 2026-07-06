import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });

export default prisma;
