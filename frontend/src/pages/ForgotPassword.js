
import { useState } from 'react';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/users/forgot-password', { email });
      setMessage('Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.');
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="p-4 border rounded">
            <h2 className="mb-4 text-center">Quên Mật Khẩu</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Địa chỉ email</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="Nhập email của bạn để tìm tài khoản" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Gửi Hướng Dẫn
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
