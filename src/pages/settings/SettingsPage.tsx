import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/settings/general', { replace: true });
  }, [navigate]);

  return null;
};

export default SettingsPage;
