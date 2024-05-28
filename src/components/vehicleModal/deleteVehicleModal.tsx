import { Button, Modal } from "react-bootstrap";
 

interface User {
    id: number;
    image: string;
    name: string;
    mobile: string;
    role: string;
    isActive: boolean;
    isSuspended: boolean;
  }
const DeleteVehicleModal = (props: any) => {
  const {
    deleteModalOpen = false,
    setDeleteModalOpen = () => {}
  } = props;
  const user: User = props.role;
  return (
    <Modal show={deleteModalOpen} 
    className="deactivate-modal" centered
    onHide={()=> {
      setDeleteModalOpen(!deleteModalOpen)
    }}
>
      <div className="p-3">
        <div className="flex d-flex justify-content-center">
          <img src="/assets/Icon/Users Delete.svg" alt="user" className=""/>
        </div>

        <div className="flex d-flex justify-content-center my-3">
          <h6>Are you sure you wish to delete {user?.name} ?</h6>
        </div>

        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="light" onClick={()=>{setDeleteModalOpen(false)}}>No</Button>
          <Button variant="primary">Yes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteVehicleModal;