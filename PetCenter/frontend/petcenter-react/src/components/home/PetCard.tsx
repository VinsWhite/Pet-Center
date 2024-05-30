import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { Pen, Trash } from 'react-bootstrap-icons';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Pet } from '../../assets/interface/PetInterface';
import defaultPet from '../../assets/img/defaultPet.jpg';

interface PetCardProps {
    pet: Pet;
    onDelete: (petId: number) => void;
    onUpdate: (updatedPet: Pet) => void;
    deleteCheckBox: boolean;
    editCheckBox: boolean;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onDelete, deleteCheckBox, editCheckBox, onUpdate }) => {
    const toast = useRef<Toast>(null);
    const [show, setShow] = useState<boolean>(false);
    const [validated, setValidated] = useState(false);
    const [name, setName] = useState(pet.name);
    const [species, setSpecies] = useState(pet.species);
    const [description, setDescription] = useState(pet.description);

    // Ensure the image path is constructed correctly
    const imagePath = pet.imagePath ? pet.imagePath.split('\\').join('/') : ''; // Handle Windows path separator
    const imageUrl = `http://localhost:3000/${imagePath}`;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const response = await axios.patch(`http://localhost:3000/pet/${pet._id}`, {
                name,
                species,
                description,
                imagePath
            });
            const updatedPet = response.data;
            toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Pet updated successfully', life: 3000 });
            setShow(false);
            onUpdate(updatedPet);
        } catch (error) {
            console.error('Error updating pet: ', error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update pet', life: 3000 });
        }
    };

    const handleClose = () => setShow(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/pet/${pet._id}`);
            toast.current?.show({ severity: 'info', summary: 'Deleted', detail: 'Pet deleted successfully', life: 3000 });
            onDelete(pet._id);
        } catch (error) {
            console.error('Error deleting pet: ', error);
        }
    };

    const handleEdit = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className='fw-bold'>Edit {pet.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom01">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom02">
                                <Form.Label>Species</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={species}
                                    onChange={(e) => setSpecies(e.target.value)}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="12" controlId="validationCustomDescription">
                                <Form.Label>Description</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a description.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Row>
                        <Button variant="warning" className='text-light' type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <NavLink to="#" className="text-decoration-none">
                <Card className={`text-center services mt-3 shadow position-relative ${editCheckBox ? 'constantWiggle' : ''} ${deleteCheckBox ? 'constantWiggle' : ''}`}>
                    <div>
                        {imagePath ? (
                            <Card.Img variant="top" src={imageUrl} />
                        ) : (
                            <Card.Img variant="top" src={defaultPet} />
                        )}
                    </div>
                    <Card.Body>
                        <p onClick={handleDelete} className={`text-dark d-flex position-absolute top-0 end-0 p-1 justify-content-end ${deleteCheckBox ? 'd-block' : 'd-none'}`}>
                            <Trash />
                        </p>
                        <p onClick={handleEdit} className={`text-dark d-flex position-absolute top-0 end-0 p-1 justify-content-end ${editCheckBox ? 'd-block' : 'd-none'}`}>
                            <Pen />
                        </p>
                        <Card.Title className="fw-semibold mt-3 fs-3">{pet.name}</Card.Title>
                        <Card.Text>{pet.description}</Card.Text>
                        <Card.Text className="text-services fw-bold bg-light mx-5">{pet.species}</Card.Text>
                    </Card.Body>
                </Card>
            </NavLink>
            <Toast ref={toast} />
        </>
    );
};

export default PetCard;
