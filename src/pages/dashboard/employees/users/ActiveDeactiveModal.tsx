import { Button, Modal } from "react-bootstrap";
import { User } from "./UserBody";

type Props = {}

const ActiveDeactiveModal = (props: any) => {
  const {
    deactivateOpen = false,
    setDeactivateOpen = () => {},
    setSelectedUser = () => {},
    updateUserStatus = () => {}
  } = props; 
  const user: User = props.selectedUser;
  return (
    <Modal show={deactivateOpen} 
    className="deactivate-modal" centered
    
    onHide={()=> {
      setDeactivateOpen(!deactivateOpen)
      setSelectedUser()
    }}
>
      <div className="p-3">
        <div className="flex d-flex justify-content-center">
          <img src={user?.image_path || "/assets/image/no_image.jpeg"} alt="Rajat" style={{width:"100px",height:"100px"}}/>
        </div>

        <div className="flex d-flex justify-content-center my-3">
          <h6>{user?.is_active ? "Are you sure you want to deactivate" : "Are you sure you want to activate"}
            
          <p style={{textAlign:"center"}}>{user?.name}?</p>
             </h6>
        </div>

      </div>
      <div className="d-flex justify-content-end generic-modal-footer generic-modal-footer3 ">
        <Button className="me-2 generic_cancel_button no_button border_radius_8" variant="light" onClick={()=>{setDeactivateOpen(); setSelectedUser();}}>No</Button>
        <Button variant="primary" className="yes_button border_radius_8" onClick={() => {
          updateUserStatus();
          setDeactivateOpen(false);
        }}>Yes</Button>
      </div>
    </Modal>
  );
};

export default ActiveDeactiveModal;