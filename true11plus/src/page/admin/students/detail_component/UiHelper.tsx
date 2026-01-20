import { Navigate, useParams } from 'react-router-dom';

const StudentRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/students/${id}/dashboard`} replace />;
};

export default StudentRedirect;