import QRCode from "qrcode";

export async function GET() {
  try {
    // The QR code points to the vCard download URL
    const vcardUrl = "https://eduardogonzalez.coach/api/vcard";

    const qrBuffer = await QRCode.toBuffer(vcardUrl, {
      type: "png",
      width: 512,
      margin: 2,
      color: {
        dark: "#1B2A4A", // brand-blue
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });

    return new Response(new Uint8Array(qrBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return new Response("Error generating QR code", { status: 500 });
  }
}
