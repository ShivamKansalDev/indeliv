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
    deleteVehicleItem = () => {}
  } = props;
  const deleteSelection: Vehicle = props.deleteSelection;
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
          <h6>Are you sure you wish to delete {deleteSelection?.vehicle_type} ?</h6>
        </div>

        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="light" onClick={()=>{setDeleteModalOpen(false)}}>No</Button>
          <Button variant="primary" onClick={() => {
            setDeleteModalOpen(false);
            deleteVehicleItem();
          }}>Yes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteVehicleModal;