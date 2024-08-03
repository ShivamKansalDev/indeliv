import { Button, Modal } from "react-bootstrap";
 

interface Role {
  id: number;
  name: string;
  users: number;
}

const DeleteRoleModal = (props: any) => {
  const {
    deleteModalOpen = false,
    setDeleteModalOpen = () => {},
    deleteRoleHandler = () => {}
  } = props;
  const role: Role = props.role;
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
          <h6>Are you sure you want to delete role {role?.name}?</h6>
        </div>

      </div>
      <div className="d-flex justify-content-end generic-modal-footer">
        <Button className="me-2 generic_cancel_button no_button border_radius_8" variant="light" onClick={()=>{setDeleteModalOpen(false)}}>No</Button>
        <Button variant="primary" className="yes_button border_radius_8" onClick={deleteRoleHandler}>Delete</Button>
      </div>
    </Modal>
  );
};

export default DeleteRoleModal;