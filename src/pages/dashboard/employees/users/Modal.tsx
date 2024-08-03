import { Button, Modal, Form } from "react-bootstrap";
import { useCallback, useRef, useState } from "react";
import { openDefaultEditor } from "@pqina/pintura";

import { User, UserDetails } from "./UserBody";
import "@pqina/pintura/pintura.css";
import "./Modal.css";
// Import the editor styles
import "@pqina/pintura/pintura.css";

// Import the editor default configuration
import { getEditorDefaults } from "@pqina/pintura";

// Import the editor component from `react-pintura`
import { PinturaEditor } from "@pqina/react-pintura";
import ImageCropper from "./ImageCropper";
import AppSlider from "./AppSlider";

const ImageCropModal = (props: any) => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  const handleOnZoom = useCallback((zoomValue: number) => {
    setZoom(zoomValue);
  }, []);

  const { 
    cropOpen = false, 
    setCropOpen = () => {},
    setUserDetails = () => {},
    setCroppedImage = () => {}
} = props;
  const user: User = props.selectedUser;
  const userDetails: UserDetails = props.userDetails;
  const [tempImage, setTempImage] = useState<Blob>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // get default properties
  const editorConfig = getEditorDefaults();

//   const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
//     // console.log(croppedArea, croppedAreaPixels)

//     // Create a Blob from the cropped area pixels
//     const blob = new Blob([croppedAreaPixels], { type: "image/jpeg" });
//     // Convert the Blob to a URL
//     const imageUrl = URL.createObjectURL(blob);

//     // Display the cropped image URL
//     console.log("Cropped image URL:", imageUrl);
 
//   };



const editorRef = useRef<PinturaEditor>(null);

// const handleProcess = (output: { dest: any; }) => {
//     const imageData = output.dest;
//     // console.log("SELECTED IMAGE: ", updateImageDetails)
//     saveCroppedImage(imageData);
//     setCropOpen(false); // Close the modal after processing
// };

// const saveCroppedImage = (blob: Blob | MediaSource) => {
//     // Create a URL for the blob
//     const url = URL.createObjectURL(blob);
//     console.log("SAVED CROPPED IMAGE: ", blob, "\n\n", url)
//     setCroppedImage(blob);
//     setUserDetails({
//         ...userDetails,
//         image: url
//     })
// };



  return (
    <Modal
      show={cropOpen}
      className="delete-modal bgcol"
      size='lg'
    
      centered
      onHide={() => {
        setCropOpen(!cropOpen);
      }}
    >
      <div className= "p-4">
        <input type="file" onChange={handleFileChange} />

        <div className={` ${selectedImage ? "mt-4 cropperPadding" :"mt-0"}`} >
          {selectedImage ? (
            <div className="">
              {/* <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={8 / 6}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropSize={{ width: 132, height: 132 }}
              /> */}
              {/* <PinturaEditor
                {...editorConfig}
                src={selectedImage}
                imageCropAspectRatio={1}
                onProcess={handleProcess}
                ref={editorRef}


            ></PinturaEditor> */}
        
            <div className="modal-body">
              <ImageCropper
                source={selectedImage}
                onCrop={setTempImage}
                width={800}
                height={800}
                zoom={zoom}
                onZoomChange={handleOnZoom}
              />
            </div>
            <div className="pt-4">
              <AppSlider
                min={1}
                max={3}
                value={zoom}
                label="Zoom"
                defaultValue={1}
                onChange={handleOnZoom}
              />
            </div>
            <div className="modal_Cropperbutton">
              <button
                className="p-2" style={{borderRadius:"8px",backgroundColor:"#0d6efd",borderWidth:"0px",width:"100px"}}
                onClick={() => {
                  if(tempImage){
                    setCroppedImage(tempImage);
                    const url = URL.createObjectURL(tempImage);
                    setUserDetails({
                        ...userDetails,
                        image: url
                    })
                    setCropOpen(false);
                  }
                }}
              >
                <span style={{color:"white"}}>Crop</span>
              </button>
            </div>
            </div>
          ) : (
            <div className="text-center my-3">
              <h6 className="">No image</h6>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropModal;
