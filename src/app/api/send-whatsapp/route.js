import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { phone, message, imageUrl } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: "Phone and message are required" }, { status: 400 });
    }

    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_ID;

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({ error: "WhatsApp API credentials missing." }, { status: 500 });
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    let imageResponse = null;

    // ✅ Send Image First (if provided)
    if (imageUrl) {
      console.log("📤 Sending WhatsApp Image:", imageUrl);
      const imagePayload = {
        messaging_product: "whatsapp",
        to: phone,
        type: "image",
        image: { link: imageUrl },
      };

      const imgResponse = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(imagePayload),
        }
      );

      const imgData = await imgResponse.json();
      console.log("📩 WhatsApp Image Response:", imgData);

      if (!imgResponse.ok) {
        return NextResponse.json({ error: imgData }, { status: imgResponse.status });
      }
      imageResponse = imgData;
    }

    // ✅ Send Text Message
    console.log("📤 Sending WhatsApp Text:", message);
    const textPayload = {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    };

    const textResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(textPayload),
      }
    );

    const textData = await textResponse.json();
    console.log("📩 WhatsApp Text Response:", textData);

    if (!textResponse.ok) {
      return NextResponse.json({ error: textData }, { status: textResponse.status });
    }

    return NextResponse.json({
      success: true,
      imageResponse,
      textResponse: textData,
    });
  } catch (error) {
    console.error("❌ WhatsApp API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}