
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== passwordConfirm) {
      return setError('Mật khẩu xác nhận không khớp.');
    }

    try {
      await api.patch(`/users/reset-password/${token}`, { password, passwordConfirm });
      setMessage('Mật khẩu của bạn đã được thay đổi thành công! Vui lòng đăng nhập lại.');
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <div className="p-4 border rounded">
            <h2 className="mb-4 text-center">Đặt Lại Mật Khẩu</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>Mật khẩu mới</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Nhập mật khẩu mới" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Xác nhận mật khẩu mới" 
                  value={passwordConfirm} 
                  onChange={e => setPasswordConfirm(e.target.value)} 
                  required 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Đổi Mật Khẩu
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
