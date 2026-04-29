import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No PDF uploaded." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Disable worker for server-side parsing
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;

    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item: any) =>
          "str" in item ? item.str : ""
        )
        .join(" ");

      extractedText += pageText + "\n";
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "No readable text found in PDF." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: extractedText,
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);

    return NextResponse.json(
      {
        error:
          "Failed to extract PDF text. Try another text-based PDF.",
      },
      { status: 500 }
    );
  }
}