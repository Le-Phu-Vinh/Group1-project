import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Import api service
import { Form, Button, Container, Row, Col, Card, Image, Alert, Spinner } from 'react-bootstrap';

function Profile() {
  const { user, login } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user profile from server when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/users/profile');
        const userData = res.data; // Backend returns data directly, not wrapped in 'user'
        setName(userData.name || '');
        setEmail(userData.email || '');
        // Update context with fresh data
        login(userData, localStorage.getItem('token'));
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Use api service instead of axios directly
      const res = await api.put('/users/profile', { name, email });
      const updatedUser = res.data; // Backend returns data directly
      login(updatedUser, localStorage.getItem('token'));
      setMessage('Cập nhật thông tin thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật thông tin.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-3">Đang tải thông tin người dùng...</p>
      </Container>
    );
  }

  if (!user) return <div className="text-center mt-5">Không tìm thấy thông tin người dùng.</div>;

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={8}>
          <h2 className="mb-4 text-center">Trang Cá Nhân</h2>
          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Card className="mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={4} className="text-center mb-3 mb-md-0">
                  <Image 
                    src={user.avatarUrl || 'https://via.placeholder.com/150'} 
                    roundedCircle 
                    fluid 
                    alt={user.name}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </Col>
                <Col md={8}>
                  <Card.Title as="h3">{user.name}</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {user.email} <br/>
                    <strong>Vai trò:</strong> {user.role}
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title as="h4">Cập nhật thông tin</Card.Title>
              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-3" controlId="profileName">
                  <Form.Label>Tên</Form.Label>
                  <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên mới" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="profileEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Nhập email mới" />
                </Form.Group>
                <Button variant="primary" type="submit">Cập nhật</Button>
              </Form>
            </Card.Body>
          </Card>


        </Col>
      </Row>
    </Container>
  );
}
export default Profile;
