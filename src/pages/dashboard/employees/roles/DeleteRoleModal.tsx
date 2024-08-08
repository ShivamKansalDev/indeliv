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
    deleteRoleHandler = () => {},
  } = props;
  const role: Role = props.role;
  return (
    <Modal
      show={deleteModalOpen}
      className="deactivate-modal"
      centered
      onHide={() => {
        setDeleteModalOpen(!deleteModalOpen);
      }}
    >

      <div className="p-3">
        <div className="flex d-flex justify-content-center">
          <div style={{backgroundColor: "#FEF3F2", borderRadius:"100%", height:"100px", width:"100px", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <img src="/assets/Icon/Users Delete.svg" alt="user" style={{width:"50px",height:"50px"}} />
          </div>
        </div>

        <div className="flex d-flex justify-content-center my-3">
          <h6>Are you sure you want to delete role 
      <p style={{textAlign:"center"}}>{role?.name}?</p>

          </h6>
        </div>
      </div>
      <div className="d-flex justify-content-end generic-modal-footer">
        <Button
          className="me-2 generic_cancel_button no_button border_radius_8"
          variant="light"
          onClick={() => {
            setDeleteModalOpen(false);
          }}
        >
          No
        </Button>
        <Button
          variant="primary"
          className="yes_button border_radius_8"
          onClick={deleteRoleHandler}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteRoleModal;
