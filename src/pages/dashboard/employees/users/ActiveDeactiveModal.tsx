import { Button, Modal } from "react-bootstrap";

type Props = {}
interface User{
  id: number,
  first_name: string,
  last_name: string,
  phone: string,
  email: string,
  email_verified_at: null | string,
  role_id: number,
  image: null | string,
  is_active: boolean,
  created_at: string,
  updated_at: string,
  name: string,
  role_name: string,
  image_path: string
}

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