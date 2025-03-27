import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const logFilePath = path.join(process.cwd(), "src/app/api/log-whatsapp-click/click-logs.json");

    // Ensure file exists before reading
    if (!fs.existsSync(logFilePath)) {
      return NextResponse.json({ success: true, stats: { total: 0, buyer: 0, seller: 0 } });
    }

    const fileContent = fs.readFileSync(logFilePath, "utf8");
    const data = fileContent ? JSON.parse(fileContent) : [];

    const stats = {
      total: data.length,
      buyer: data.filter(log => log.type === "buyer").length,
      seller: data.filter(log => log.type === "seller").length,
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error loading stats", error: error.message });
  }
}