import { Button, Modal } from "react-bootstrap";
import { User } from "./UserBody";
import { useEffect } from "react";

type Props = {}

const DeleteModal = (props: any) => {
  const {
    deleteOpen = false,
    setDeleteOpen = () => {},
    setSelectedUser = () => {},
    deleteUser = () => {}
  } = props;
  const user: User = props.selectedUser;

  return (
    <Modal show={deleteOpen} 
    className="delete-modal" centered
    onHide={()=> {
      setDeleteOpen(!deleteOpen)
      setSelectedUser()
    }}
>
      <div className="p-3">
        <div className="flex d-flex justify-content-center user_image">
          <img src={user?.image_path || "/assets/image/no_image.jpeg"} className="rounded_image w_100" alt="Rajat" style={{width:"100px",height:"100px"}}/>
        </div>

        <div className="text-center my-3">
          <h6 className="">Are you sure you want to delete</h6> 
          <h6> {user?.name}?</h6>
        </div>

      </div>
        <div className="d-flex justify-content-end generic-modal-footer">
          <Button className="me-2 generic_cancel_button no_button border_radius_8" variant="light" onClick={()=>{setDeleteOpen(); setSelectedUser()}}>No</Button>
          <Button variant="danger" className="delete_button border_radius_8" onClick={deleteUser}>Delete</Button>
        </div>
    </Modal>
  );
};

export default DeleteModal;