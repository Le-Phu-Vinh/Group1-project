import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/signup', { name, email, password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="p-4 border rounded">
            <h2 className="mb-4 text-center">Đăng Ký Tài Khoản</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Tên của bạn</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Nhập tên" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Địa chỉ email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Nhập email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Nhập mật khẩu" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Đăng Ký
              </Button>
            </Form>
          </div>
          <div className="mt-3 text-center p-3 border rounded">
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Register;