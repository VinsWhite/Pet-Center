import { Container, Row, Col, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus } from "react-bootstrap-icons";
import { Pet } from "../../assets/interface/PetInterface"; //  Pet is an interface
import PetCard from "./PetCard";
import { Skeleton } from 'primereact/skeleton';

export default function ServicesComp() {
    const [pets, setPets] = useState<Pet[]>([]); // <Pet[]> specify what state type is, interface array of Pet
    const [loading, setLoading] = useState<boolean>(true);
    const [deleteCheckBox, setDeleteCheckBox] = useState<boolean>(false);
    const [editCheckBox, setEditCheckBox] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('')
    
    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get<{ data: { pet: Pet[] } }>('http://localhost:3000/pet'); // specify the type
            console.log(response.data);

            setTimeout(() => {
                setPets(response.data.data.pet); // set the state
            setLoading(false);
            }, 3000);

            
          } catch (error) {
            console.error(error);
          }
        }
    
        fetchData();
    }, []);

    const handleDeletePet = (petId: number) => {
        const updatedPets = pets.filter(pet => pet._id !== petId);
        setPets(updatedPets);
    };

    const handleUpdatePet = (updatedPet: Pet) => {
        setPets(pets => pets.map(pet => pet._id === updatedPet._id ? updatedPet : pet));
    };

    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    return (
        <>  
            <div className="p-5">
                <h2 className="fw-bold text-services">pets <NavLink className='text-decoration-none text-dark' to='/create'><Plus /></NavLink> </h2>
            </div>

            <Container className="my-3">
                <div className="d-flex justify-content-between">
                    <div>
                        <p 
                            className={`bg-light border p-1 rounded-2 mb-2 d-inline-block delete ${editCheckBox ? 'disabled' : ''}`}
                            onClick={() => setDeleteCheckBox(!deleteCheckBox)}
                        >
                            Delete
                        </p>

                        <p 
                            className={`bg-light border p-1 rounded-2 mb-2 d-inline-block edit ms-2 ${deleteCheckBox ? 'disabled' : ''}`}
                            onClick={() => setEditCheckBox(!editCheckBox)}
                        >
                            Edit
                        </p>
                    </div>
                    <div>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search pets..."
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Form>
                    </div>
                </div>
                <Row>
                    {loading && (
                        <>
                            <Col xs={12} sm={6} md={4}>
                                <Skeleton width="22rem" height="22rem"></Skeleton>
                            </Col>
                            <Col xs={12} sm={6} md={4}>
                                <Skeleton width="22rem" height="22rem"></Skeleton>
                            </Col>
                            <Col xs={12} sm={6} md={4}>
                                <Skeleton width="22rem" height="22rem"></Skeleton>
                            </Col>
                        </>
                    )}
                    {filteredPets.length >= 1 && filteredPets.map((pet, index) => (
                        <Col key={index} xs={12} sm={6} md={4}>
                            <PetCard
                                pet={pet}
                                editCheckBox={editCheckBox}
                                deleteCheckBox={deleteCheckBox}
                                onDelete={handleDeletePet}
                                onUpdate={handleUpdatePet}
                            />
                        </Col>
                    ))}
                    {!loading && filteredPets.length === 0 && (
                        <>
                            <Container>
                                <div className="text-center border border-dark rounded-4 p-4 services mx-3">
                                    <h2>There aren't pets yet...</h2>
                                    <p>Be the first one! Let's create a card!</p>
                                </div>
                            </Container>
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
}
