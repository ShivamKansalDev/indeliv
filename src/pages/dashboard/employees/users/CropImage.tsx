import { useCallback, useState } from "react";

import ImageCropper from "./ImageCropper";

export default function CropImage() {
  const [remoteImage, setRemoteImage] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const isImageSelected = remoteImage || localImage ? true : false;

  const downloadImage = async () => {
    if (!croppedImage) return;
    const link = document.createElement("a");
    const name = `${Date.now()}_wallpaper`;
    link.download = name;
    link.href = URL.createObjectURL(croppedImage);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isImageSelected)
    return (
      <div className="space-y-4 w-full p-4">
        <input
          className="w-full p-2 rounded border-2 border-gray-300 focus:border-gray-700 outline-none focus:outline-none transition"
          placeholder="https://images.unsplash.com/photo-1691673236501..."
          value={remoteImage}
          onChange={({ target }) => {
            setLocalImage("");
            setRemoteImage(target.value);
          }}
        />
      </div>
    );

  return (
    <div className="flex">
      <div className="space-y-4 w-96 p-4">
        <input
          className="w-full p-2 rounded border-2 border-gray-300 focus:border-gray-700 outline-none focus:outline-none transition"
          placeholder="https://images.unsplash.com/photo-1691673236501..."
          value={remoteImage}
          onChange={({ target }) => {
            setLocalImage("");
            setRemoteImage(target.value);
          }}
        />
      </div>

      <div className="h-screen p-4 flex-1 flex items-center justify-center">
        {/* <ImageCropper
        //   rotation={rotation}
        //   onRotationChange={setRotation}
          source={remoteImage || localImage}
          onCrop={setCroppedImage}
          width={1080}
          height={1920}
        /> */}
      </div>
    </div>
  );
}