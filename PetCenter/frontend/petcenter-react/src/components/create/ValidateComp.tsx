import { Form, Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { scrollToTop } from "../../assets/functions/scrollToTop";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Info } from "react-bootstrap-icons";
import { address } from "../../assets/api/address"; // address for api request

export default function ValidateComp() {

    const [validated, setValidated] = useState(false); // to validate form

    const [name, setName] = useState<string>(''); // form datas --- from here
    const [description, setDescription] = useState<string>('');
    const [species, setSpecies] = useState<string>('');
    const [image, setImage] = useState<File | null>(null); // to here

    const [isCreated, setIsCreated] = useState<boolean>();
    const [checked, setChecked] = useState<boolean>(false);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        // to scroll to top
        scrollToTop();
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) { 
            event.stopPropagation();
            setValidated(true);
            return;
        }
    
        const formData = new FormData(); 
        formData.append('name', name); 
        formData.append('description', description);
        formData.append('species', species);
        if (image) {
            formData.append('image', image);
        }
    
        /* console.log('Formdata', formData) */

        try {
            const response = await axios.post(address, formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            setIsCreated(true);
            toast.current?.show({ severity: 'info', summary: 'Created', detail: 'Pet created successfully', life: 3000 });
            console.log(response.data);
    
            if(checked) {
                setIsCreated(false);
            } else {
                setTimeout(() => {
                    navigate('/');
                    setIsCreated(false);
                }, 2000);
            }
            
            
        } catch (error) {
            console.error(error);
            toast.current?.show({ severity: 'warn', summary: 'Rejected', detail: 'Action rejected', life: 3000 });
        }
    
        setValidated(false);
        setName('');
        setDescription('');
        setSpecies('');
        setImage(null); // reset states after sending datas
    }
    

    return (
        <>
            <h2 className="mt-4">Set informations about a new Pet!</h2>
            {isCreated && (
                <p className='opacity-75'>You will be redirected shortly...</p>
            )}
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="my-5 p-2 border border-2 border-warning rounded-2 shadow">
                <Row className="mb-3">
                    <div className="d-flex">
                        <Checkbox onChange={() => setChecked(!checked)} checked={checked}></Checkbox>
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-info`}>
                                    Tick this box if you intend to create several pets promptly
                                </Tooltip>
                            }
                        >
                            <p className="d-flex align-items-center ">
                                <Info className="bg-dark text-light mx-1" />
                                More pets
                            </p>
                        </OverlayTrigger>
                    </div>
                    <Form.Group as={Col} md="4" controlId="validationCustom01">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter the name..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter the description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="4" controlId="validationCustom02">
                        <Form.Label>Species</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Enter the species..."
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="12" controlId="validationCustom02" className="mt-4">
                        <Form.Control
                            type="file"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage(e.target.files?.[0] ?? null)} 
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Button className="wiggle" variant="warning" type="submit">Create</Button>
            </Form>
            <Toast ref={toast} />
        </>
    )
}
