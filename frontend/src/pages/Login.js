import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      const { user, token } = res.data; 
      login(user, token); 
      navigate('/profile'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Sai email hoặc mật khẩu');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="p-4 border rounded">
            <h2 className="mb-4 text-center">Đăng Nhập</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
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
                Đăng Nhập
              </Button>
            </Form>
            <div className="mt-3 text-center">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>
          </div>
           <div className="mt-3 text-center p-3 border rounded">
             Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default Login;