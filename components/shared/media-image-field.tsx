"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useFormStatus } from "react-dom";

import { FormField } from "@/components/shared/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  MEDIA_ACCEPTED_MIME_TYPES,
  MEDIA_MAX_FILE_SIZE_BYTES,
  formatMediaFileSize,
  getMediaHelpText,
  type MediaAsset,
} from "@/lib/media/utils";
import { cn } from "@/lib/utils";

type MediaImageFieldProps = {
  label?: string;
  fileInputName?: string;
  altInputName?: string;
  removeInputName?: string;
  currentImage?: MediaAsset | null;
  previewTitle: string;
  emptyLabel: string;
  className?: string;
};

type LocalPreview = {
  url: string;
  fileName: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
};

export function MediaImageField({
  label = "Portada",
  fileInputName = "cover_image",
  altInputName = "cover_image_alt_text",
  removeInputName = "remove_cover_image",
  currentImage = null,
  previewTitle,
  emptyLabel,
  className,
}: MediaImageFieldProps) {
  const { pending } = useFormStatus();
  const [localPreview, setLocalPreview] = useState<LocalPreview | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  useEffect(() => {
    return () => {
      if (localPreview?.url) {
        URL.revokeObjectURL(localPreview.url);
      }
    };
  }, [localPreview]);

  const preview = useMemo(() => {
    if (localPreview) {
      return {
        src: localPreview.url,
        alt: previewTitle,
        caption: `${localPreview.fileName} - ${formatMediaFileSize(localPreview.sizeBytes)}`,
        isReplacement: Boolean(currentImage),
      };
    }

    if (currentImage && !removeCurrentImage) {
      return {
        src: currentImage.publicUrl,
        alt: currentImage.altText ?? previewTitle,
        caption: `${currentImage.fileName} - ${formatMediaFileSize(currentImage.sizeBytes)}`,
        isReplacement: false,
      };
    }

    return null;
  }, [currentImage, localPreview, previewTitle, removeCurrentImage]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      clearLocalPreview();
      return;
    }

    if (!MEDIA_ACCEPTED_MIME_TYPES.includes(nextFile.type as (typeof MEDIA_ACCEPTED_MIME_TYPES)[number])) {
      clearLocalPreview();
      setLocalError("Formato no compatible. Usa JPG, PNG, WebP o AVIF.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MEDIA_MAX_FILE_SIZE_BYTES) {
      clearLocalPreview();
      setLocalError("La imagen supera el maximo recomendado de 5 MB.");
      event.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(nextFile);
    const dimensions = await getImageDimensions(objectUrl);

    setRemoveCurrentImage(false);
    setLocalError(null);
    setLocalPreview({
      url: objectUrl,
      fileName: nextFile.name,
      sizeBytes: nextFile.size,
      width: dimensions.width,
      height: dimensions.height,
    });
  }

  function clearLocalPreview() {
    setLocalError(null);
    setLocalPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url);
      }

      return null;
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-3">
        <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[var(--surface-soft)] p-3">
          <div className="relative overflow-hidden rounded-[calc(var(--radius-lg)-0.2rem)] bg-[var(--surface-strong)]">
            {preview ? (
              <>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={preview.src}
                    alt={preview.alt}
                    fill
                    unoptimized={preview.src.startsWith("blob:")}
                    sizes="(min-width: 1280px) 28rem, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="border-t border-[color:var(--border)] px-3 py-2 text-xs text-[var(--muted)]">
                  <p>
                    {preview.isReplacement
                      ? "Nueva imagen seleccionada para reemplazar la actual."
                      : "Imagen actual."}
                  </p>
                  <p className="mt-1">{preview.caption}</p>
                </div>
              </>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center px-4 text-center text-sm text-[var(--muted)]">
                {removeCurrentImage && currentImage
                  ? "La portada actual se eliminara al guardar."
                  : emptyLabel}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <FormField label={label} hint={getMediaHelpText()}>
            <Input
              type="file"
              name={fileInputName}
              accept={MEDIA_ACCEPTED_MIME_TYPES.join(",")}
              onChange={handleFileChange}
              disabled={pending}
            />
          </FormField>

          <FormField
            label="Texto alternativo"
            hint="Describe la imagen si aporta contexto util al contenido."
          >
            <Input
              name={altInputName}
              defaultValue={currentImage?.altText ?? ""}
              disabled={pending}
            />
          </FormField>
        </div>

        {currentImage ? (
          <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-dashed border-[color:var(--border)] px-3 py-3 text-sm text-[var(--muted)]">
            <Checkbox
              name={removeInputName}
              checked={removeCurrentImage}
              onChange={(event) => {
                setRemoveCurrentImage(event.target.checked);

                if (event.target.checked) {
                  clearLocalPreview();
                }
              }}
              disabled={pending}
            />
            <span>Eliminar la portada actual si no subes otra en este guardado.</span>
          </label>
        ) : null}

        <input type="hidden" name="cover_image_width" value={localPreview?.width ?? ""} />
        <input type="hidden" name="cover_image_height" value={localPreview?.height ?? ""} />

        {localError ? <p className="text-sm text-[var(--danger)]">{localError}</p> : null}
        {pending ? (
          <p className="text-sm text-[var(--muted)]">
            {localPreview || removeCurrentImage
              ? "Subiendo imagen y guardando cambios..."
              : "Guardando cambios..."}
          </p>
        ) : null}
      </div>
    </div>
  );
}

async function getImageDimensions(url: string) {
  return new Promise<{ width: number | null; height: number | null }>((resolve) => {
    const image = new window.Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth || null,
        height: image.naturalHeight || null,
      });
    };

    image.onerror = () => {
      resolve({
        width: null,
        height: null,
      });
    };

    image.src = url;
  });
}
