"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import {
  X,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Crop,
  Replace,
  Save,
  Loader2,
} from "lucide-react";

interface ImageEditorProps {
  imageUrl: string;
  mediaId: string;
  mediaName: string;
  onSave: () => void;
  onClose: () => void;
}

const ASPECT_RATIOS = [
  { label: "Libre", value: 0 },
  { label: "1:1", value: 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
];

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  // Calculate bounding box of the rotated image
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  // Set canvas to bounding box size to rotate the full image
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // Now extract the cropped area from the rotated canvas
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d")!;

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/png",
      1
    );
  });
}

export default function ImageEditor({
  imageUrl,
  mediaId,
  mediaName,
  onSave,
  onClose,
}: ImageEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [saving, setSaving] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaced, setReplaced] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    setSaving(true);

    try {
      const blob = await getCroppedImg(
        currentImageUrl,
        croppedAreaPixels,
        rotation,
        flipH,
        flipV
      );

      const formData = new FormData();
      formData.append("file", blob, mediaName);

      const res = await fetch(`/api/media/${mediaId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        onSave();
      }
    } catch (err) {
      console.error("Error saving image:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleReplace(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReplacing(true);

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);

      const res = await fetch(`/api/media/${mediaId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        // Update the image URL with cache-bust, keep editor open
        setCurrentImageUrl(`/api/media/${mediaId}?t=${Date.now()}`);
        setRotation(0);
        setFlipH(false);
        setFlipV(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setReplaced(true);
      }
    } catch (err) {
      console.error("Error replacing image:", err);
    } finally {
      setIsReplacing(false);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  const hasEdits = rotation !== 0 || flipH || flipV || zoom !== 1 || replaced;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Crop size={20} className="text-brand-orange" />
            <h2 className="font-semibold text-gray-800">Editar imagen</h2>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {mediaName}
            </span>
            {replaced && (
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-600">
                Reemplazada
              </span>
            )}
          </div>
          <button
            onClick={() => { if (replaced) onSave(); onClose(); }}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cropper area */}
        <div className="relative flex-1 bg-gray-900">
          <Cropper
            image={currentImageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
              },
            }}
          />
        </div>

        {/* Toolbar */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Aspect Ratio */}
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs font-medium text-gray-500">Proporción:</span>
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => setAspectRatio(ar.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    aspectRatio === ar.value
                      ? "bg-brand-orange text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
                className="rounded-lg bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                title="Alejar"
              >
                <ZoomOut size={16} />
              </button>
              <span className="w-12 text-center text-xs text-gray-500">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
                className="rounded-lg bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                title="Acercar"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            {/* Rotate */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRotation((r) => r - 90)}
                className="rounded-lg bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                title="Rotar izquierda"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setRotation((r) => r + 90)}
                className="rounded-lg bg-white p-2 text-gray-600 transition hover:bg-gray-100"
                title="Rotar derecha"
              >
                <RotateCw size={16} />
              </button>
            </div>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            {/* Flip */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFlipH((f) => !f)}
                className={`rounded-lg p-2 transition ${
                  flipH
                    ? "bg-brand-orange text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                title="Voltear horizontal"
              >
                <FlipHorizontal size={16} />
              </button>
              <button
                onClick={() => setFlipV((f) => !f)}
                className={`rounded-lg p-2 transition ${
                  flipV
                    ? "bg-brand-orange text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                title="Voltear vertical"
              >
                <FlipVertical size={16} />
              </button>
            </div>

            <div className="mx-2 h-6 w-px bg-gray-300" />

            {/* Replace */}
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100">
              {isReplacing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Replace size={14} />
              )}
              Reemplazar
              <input
                ref={replaceInputRef}
                type="file"
                accept="image/*"
                onChange={handleReplace}
                className="hidden"
                disabled={isReplacing}
              />
            </label>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving || !croppedAreaPixels}
              className="ml-auto flex items-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-orange/90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {hasEdits ? "Guardar cambios" : "Recortar y guardar"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
