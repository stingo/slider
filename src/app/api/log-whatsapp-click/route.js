import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const logFilePath = path.join(process.cwd(), "src/app/api/log-whatsapp-click/click-logs.json");
    
    // Read existing logs or initialize an empty array if file doesn't exist
    let data = [];
    if (fs.existsSync(logFilePath)) {
      const fileContent = fs.readFileSync(logFilePath, "utf8");
      data = fileContent ? JSON.parse(fileContent) : [];
    }

    // Parse request body
    const newLog = await req.json();
    newLog.timestamp = new Date().toLocaleString();
    newLog.isoTimestamp = new Date().toISOString();

    // Append new log
    data.push(newLog);

    // Save back to file
    fs.writeFileSync(logFilePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ success: true, log: newLog });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error saving log", error: error.message });
  }
}