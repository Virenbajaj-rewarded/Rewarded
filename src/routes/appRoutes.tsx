import { Routes, Route } from 'react-router-dom';
import {
  publicRoutes,
  protectedRoutes,
  specialRoutes,
  createProtectedRoutes,
  createPublicRoutes,
} from './routeConfig';

const AppRoutes = () => {
  const allRoutes = [
    ...createPublicRoutes(publicRoutes),
    ...createProtectedRoutes(protectedRoutes),
    ...specialRoutes,
  ];

  return (
    <Routes>
      {allRoutes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
