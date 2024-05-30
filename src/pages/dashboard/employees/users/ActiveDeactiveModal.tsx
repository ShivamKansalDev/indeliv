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
          <img src="/assets/image/user.png" alt="Rajat" className=""/>
        </div>

        <div className="flex d-flex justify-content-center my-3">
          <h6>{user?.is_active ? "Deactivate" : "Activate"} {user?.name}?</h6>
        </div>

        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="light" onClick={()=>{setDeactivateOpen(false)}}>No</Button>
          <Button variant="primary" onClick={() => {
            updateUserStatus();
            setDeactivateOpen(false);
          }}>Yes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActiveDeactiveModal;