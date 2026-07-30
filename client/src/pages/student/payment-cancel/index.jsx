import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('currentOrderId');
  }, []);

  return (
    <Card className='max-w-lg mx-auto mt-12'>
      <CardHeader>
        <CardTitle>Payment cancelled</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='mb-4'>
          No payment was taken. You can return to the course and try again.
        </p>
        <Button onClick={() => navigate('/courses')}>Browse courses</Button>
      </CardContent>
    </Card>
  );
}

export default PaymentCancelPage;
