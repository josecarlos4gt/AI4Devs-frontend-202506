import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Position, getAllPositions } from '../services/positionService';
import { useNavigate } from 'react-router-dom';

const Positions: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        title: '',
        deadline: '',
        status: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        loadPositions();
    }, []);

    const loadPositions = async () => {
        try {
            const data = await getAllPositions();
            setPositions(data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar las posiciones');
            setLoading(false);
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredPositions = positions.filter(position => {
        const titleMatch = position.title.toLowerCase().includes(filters.title.toLowerCase());
        const deadlineMatch = !filters.deadline || position.applicationDeadline?.includes(filters.deadline);
        const statusMatch = !filters.status || position.status === filters.status;
        return titleMatch && deadlineMatch && statusMatch;
    });

    const handleViewProcess = (id: number) => {
        navigate(`/positions/${id}/kanban`);
    };

    const handleEdit = (id: number) => {
        navigate(`/positions/${id}/edit`);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Posiciones</h2>
                <Button variant="success" onClick={() => navigate('/positions/new')}>
                    Nueva Posición
                </Button>
            </div>
            
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Control 
                        type="text" 
                        placeholder="Buscar por título"
                        name="title"
                        value={filters.title}
                        onChange={handleFilterChange}
                    />
                </Col>
                <Col md={4}>
                    <Form.Control 
                        type="date" 
                        placeholder="Buscar por fecha"
                        name="deadline"
                        value={filters.deadline}
                        onChange={handleFilterChange}
                    />
                </Col>
                <Col md={4}>
                    <Form.Select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                    >
                        <option value="">Estado</option>
                        <option value="active">Activo</option>
                        <option value="paused">Pausado</option>
                        <option value="closed">Cerrado</option>
                        <option value="draft">Borrador</option>
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                {filteredPositions.map((position) => (
                    <Col md={4} key={position.id} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>{position.title}</Card.Title>
                                <Card.Text>
                                    <strong>Ubicación:</strong> {position.location}<br />
                                    <strong>Fecha límite:</strong> {new Date(position.applicationDeadline).toLocaleDateString()}<br />
                                    <strong>Tipo:</strong> {position.employmentType || 'No especificado'}<br />
                                    {position.salaryMin && position.salaryMax && (
                                        <>
                                            <strong>Rango salarial:</strong> ${position.salaryMin} - ${position.salaryMax}<br />
                                        </>
                                    )}
                                </Card.Text>
                                <span className={`badge ${
                                    position.status === 'active' ? 'bg-success' :
                                    position.status === 'paused' ? 'bg-warning' :
                                    position.status === 'closed' ? 'bg-danger' :
                                    'bg-secondary'
                                } text-white mb-3`}>
                                    {position.status === 'active' ? 'Activo' :
                                     position.status === 'paused' ? 'Pausado' :
                                     position.status === 'closed' ? 'Cerrado' :
                                     'Borrador'}
                                </span>
                                <div className="mt-auto d-flex justify-content-between">
                                    <Button variant="primary" onClick={() => handleViewProcess(position.id!)}>
                                        Ver proceso
                                    </Button>
                                    <Button variant="secondary" onClick={() => handleEdit(position.id!)}>
                                        Editar
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {filteredPositions.length === 0 && (
                <div className="text-center mt-4">
                    <p>No se encontraron posiciones que coincidan con los filtros.</p>
                </div>
            )}
        </Container>
    );
};

export default Positions;