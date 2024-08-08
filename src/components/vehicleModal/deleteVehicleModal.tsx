import { Button, Modal } from "react-bootstrap";
 

interface Vehicle {
  id: number;
  name: string;
  vehicle_type_id: number;
  created_at: string;
  updated_at: string;
  vehicle_type: string;
}
const DeleteVehicleModal = (props: any) => {
  const {
    deleteModalOpen = false,
    setDeleteModalOpen = () => {},
    deleteVehicleItem = () => {},
    setDeleteSelection = () => {}
  } = props;
  const deleteSelection: Vehicle = props.deleteSelection;
  return (
    <Modal show={deleteModalOpen} 
    className="deactivate-modal" centered
    onHide={()=> {
      setDeleteModalOpen(!deleteModalOpen)
      setDeleteSelection(null)
    }}
>
      <div className="p-3">
        <div className="flex d-flex justify-content-center">
        <div style={{backgroundColor: "#FEF3F2", borderRadius:"100%", height:"80px", width:"80px", display:"flex", justifyContent:"center", alignItems:"center"}}>
            {(deleteSelection?.vehicle_type.toLowerCase() === "scooter")&& (
              <img src="/assets/Icon/Scooter.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "motor bike")&& (
              <img src="/assets/Icon/Motor Bike.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "three-wheeled")&& (
              <img src="/assets/Icon/Three-wheeled.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "car")&& (
              <img src="/assets/Icon/Car.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "truck")&& (
              <img src="/assets/Icon/Truck.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "refrigerated truck")&& (
              <img src="/assets/Icon/Refrigerated Truck.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "refrigerated van")&& (
              <img src="/assets/Icon/Refrigerated vans.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "mini truck")&& (
              <img src="/assets/Icon/Mini Truck.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "pick-up truck")&& (
              <img src="/assets/Icon/Pick-up trucks.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            {(deleteSelection?.vehicle_type.toLowerCase() === "van")&& (
              <img src="/assets/Icon/Van.svg" alt="user_image"   style={{width:"100%",height:"42px", filter:"invert(100%) sepia(100%) saturate(100) hue-rotate(-5deg) brightness(92%) contrast(93%)"}} />
            )}
            </div>
        </div>

        <div className="flex d-flex justify-content-center my-3">
          <h6>Are you sure you wish to delete 
          <p style={{textAlign:"center"}}> {deleteSelection?.vehicle_type} - {deleteSelection?.name} ?</p>
        
            </h6>
        </div>

      </div>
      <div className="d-flex justify-content-end generic-modal-footer">
        <Button className="me-2 edit_cancel_button border_radius_8 no_button" variant="light" onClick={()=>{setDeleteModalOpen(false); setDeleteSelection(null);}}>No</Button>
        <Button variant="primary" className="yes_button border_radius_8" onClick={() => {
          setDeleteModalOpen(false);
          deleteVehicleItem();
        }}>Yes</Button>
      </div>
    </Modal>
  );
};

export default DeleteVehicleModal;