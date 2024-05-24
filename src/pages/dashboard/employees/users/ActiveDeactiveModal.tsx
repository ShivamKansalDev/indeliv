import { Button, Modal } from "react-bootstrap";

type Props = {}

interface User{
  id: number;
  image: string;
  name: string;
  mobile: string;
  role: string;
  isActive: boolean;
  isSuspended: boolean;
}

const ActiveDeactiveModal = (props: any) => {
  const {
    deactivateOpen = false,
    setDeactivateOpen = () => {},
    setSelectedUser = () => {}
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
          <h6>{user?.isActive ? "Deactivate" : "Activate"} {user?.name}?</h6>
        </div>

        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="light" onClick={()=>{setDeactivateOpen(false)}}>No</Button>
          <Button variant="primary">Yes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ActiveDeactiveModal;