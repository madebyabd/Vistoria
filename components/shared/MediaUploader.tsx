"use client";

import { useToast } from "@/components/ui/use-toast";
import { dataUrl, getImageSize } from "@/lib/utils";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  image: any;
  type: string;
};

const MediaUploader = ({
  onValueChange,
  setImage,
  image,
  publicId,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "jsm_imaginify";

  if (!uploadPreset) {
    toast({
      title: "Cloudinary preset missing",
      description:
        "Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local to continue.",
      duration: 5000,
      className: "error-toast",
    });
    return;
  }

  const onUploadSuccessHandler = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: "Image uploaded successfully",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  const onUploadErrorHandler = () => {
    toast({
      title: "Something went wrong while uploading",
      description: "Please try again",
      duration: 5000,
      className: "error-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccessHandler}
      onError={onUploadErrorHandler}
    >
      {({ open }) => (
        <div className="flex flex-col gap-4">
          <h3 className="h3-bold text-foreground">Original</h3>

          {publicId ? (
            <div className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-[#101b33]/80 p-3 shadow-[0_25px_60px_rgba(15,23,42,0.7)] backdrop-blur-xl transition-all duration-300">
              <CldImage
                width={getImageSize(type, image, "width")}
                height={getImageSize(type, image, "height")}
                src={publicId}
                alt="image"
                sizes={"(max-width: 767px) 100vw, 50vw"}
                placeholder={dataUrl as PlaceholderValue}
                className="media-uploader_cldImage"
              />
              <div className="pointer-events-none absolute inset-0 rounded-[18px] border border-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-50" />
            </div>
          ) : (
            <div
              className="group relative flex h-72 w-full cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-[20px] border border-dashed border-white/15 bg-[#101b33]/70 p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50"
              onClick={() => open()}
            >
              <div className="media-uploader_cta-image">
                <Image
                  src="/assets/icons/add.svg"
                  alt="Add Image"
                  width={28}
                  height={28}
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="p-16-semibold text-foreground">
                  Drag & drop your media
                </p>
                <p className="p-14-medium text-muted-foreground">
                  or tap to select from your device
                </p>
              </div>
              <div className="pointer-events-none absolute inset-[1px] rounded-[20px] border border-secondary/30 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute -bottom-24 inset-x-0 h-40 bg-vistoria-gradient opacity-20 blur-3xl" />
            </div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
};

export default MediaUploader;
