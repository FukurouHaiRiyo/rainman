import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthUserContext';
import { Container, Row, Col, Button } from 'reactstrap';

const LoggedIn: React.FC = () => {
  const { authUser, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authUser) {
      router.push('/');
    }
  }, [authUser, router]);

  return (
    <Container>
      {loading ? (
        <Row>
          <Col>Loading...</Col>
        </Row>
      ): (
        <>
          <Row>
            <Col>
              {authUser && <div>{authUser.email}</div>}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={signOut}>Sign out</Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}

export default LoggedIn;