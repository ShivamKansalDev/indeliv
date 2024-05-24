import "./image-upload.scss";
import { ReactComponent as LeftArrow } from "@/assets/svgs/left-arrow.svg";
import { ReactComponent as Download } from "@/assets/svgs/Download-svg.svg";
import { ReactComponent as Camera } from "@/assets/svgs/camera.svg";
import { ReactComponent as Close } from "@/assets/svgs/Close.svg";
import useGoBackOrRedirect from "@/utils/hooks/goBackOrRedirect";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetInvoiceDetailsQuery } from "@/state/slices/invoices/invoicesApiSlice";
interface ImageFiles {
  credit_image: string;
  cheque_image: string;
}
// interface ImageFiles {
//   [key: string]: string; // Allows any string as a key with string values
// }
interface UploadImageProps {
  setisImageUpload: (value: boolean) => void; // State updater for isImageUpload
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void; // File change handler
  fileImage: ImageFiles;
  setFileImage: (newImage: ImageFiles) => void;
  imageName: string; // Name of the file input
}
const UploadImage: React.FC<UploadImageProps> = ({ setisImageUpload, handleChange, fileImage, setFileImage, imageName }) => {
  const { goBackOrRedirect } = useGoBackOrRedirect();
  const [openImage, setOpenImage] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const handleImageChange = () => {
    let img = document.getElementById("upload-image");
    img?.click();
  }
  const { id } = useParams();
  // const { data: invoiceData, isLoading, refetch } = useGetInvoiceDetailsQuery(
  //   id,
  //   {
  //     // skip: isNaN(invoiceNo), // Skip the query if batchId is NaN
  //   }
  // );
  const handleUpload = () => {
    setisImageUpload(false);
  };
  const imageKey = imageName === "credit_image" ? "credit_image" : "cheque_image";
  const hasImage = Boolean(fileImage[imageKey]);
  function handleCancel() {
    if (imageKey == "credit_image") {
      setFileImage({
        ...fileImage,
        credit_image: ""
      })
    }
    else {
      setFileImage({
        ...fileImage,
        cheque_image: ""
      })
    }
  }


  return (
    <>
      <div className="d-flex justify-content-center py-mb-3">
        <div className="main-div">
          <div className="header p-md-3">
            <div className="d-flex">
              <div className="back-link" onClick={handleUpload}>
                <LeftArrow />
              </div>
              <span> Upload image</span>
            </div>
            <div className="download-btn-div">
              <a
                href={fileImage[imageKey]}
                download={imageKey}
              >
                <Download />
              </a>
            </div>
          </div>
          <div className="body p-md-4 pt-4">
            <div className="position-relative">
              <div className="image">
                <div className="upload-image-div">
                  {
                    Boolean(hasImage) ?
                      <>
                        <img src={hasImage ? fileImage[imageKey] : ""} className="img-fluid h-100 w-100" alt="" />
                        <div className="img-overlay"></div>
                      </>
                      :
                      <div className="upload-image-child" onClick={() => handleImageChange()}>
                        <input type="file" id="upload-image" className="d-none" name={imageName} onChange={(e) => handleChange(e, imageName)} />
                        <div className="text-center">
                          <Camera />
                          <p>Camera</p>
                        </div>
                      </div>
                  }
                </div>
              </div>
              {
                hasImage && hasImage ?
                  <div className="close-btn-div" onClick={handleCancel}>
                    <Close />
                  </div> : <></>
              }
            </div>
            <div className="row mx-0 px-0 pt-4 bottom-btns">
              <div className="col-6 p-0 pe-1 ">
                <button type="button" className="w-100 btn-retake me-1" onClick={() => handleImageChange()}>
                  <input type="file" id="upload-image" name={imageName} className="d-none" onChange={(e) => handleChange(e, imageName)} />
                  Retake
                </button>
              </div>
              <div className="col-6 p-0 ps-1">
                {Boolean(fileImage[imageKey]) ?
                  // <button type="button" className="w-100 btn-save" onClick={() => navigate(`${location?.pathname?.includes("/collection/") ? "/dashboard/collection/payment_collection/" : "/dashboard/payment_collection/"}` + invoiceData?.id)}>Save</button>
                  <button type="button" className="w-100 btn-save" onClick={handleUpload}>Save</button>
                  :
                  <button type="button" className="w-100 btn-save" style={{ background: "#98A2B3", color: "white" }}>Save</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default UploadImage;