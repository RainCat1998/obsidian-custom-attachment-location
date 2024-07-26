export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (): void => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(blob);
  });
}

function base64ToArrayBuffer(code: string): ArrayBuffer {
  const parts = code.split(";base64,");
  const raw = window.atob(parts[1]!);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return uInt8Array.buffer;
}

export async function blobToJpegArrayBuffer(blob: Blob, jpegQuality: number): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e): void => {
      const image = new Image();
      image.onload = (): void => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const imageWidth = image.width;
        const imageHeight = image.height;
        let data = "";

        canvas.width = imageWidth;
        canvas.height = imageHeight;

        context!.fillStyle = "#fff";
        context!.fillRect(0, 0, imageWidth, imageHeight);
        context!.save();

        context!.translate(imageWidth / 2, imageHeight / 2);
        context!.drawImage(image, 0, 0, imageWidth, imageHeight, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
        context!.restore();

        data = canvas.toDataURL("image/jpeg", jpegQuality);

        const arrayBuffer = base64ToArrayBuffer(data);
        resolve(arrayBuffer);
      };

      image.src = e.target!.result as string;
    };
    reader.readAsDataURL(blob);
  });
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}
