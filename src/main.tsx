import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter ,RouterProvider} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store.ts';
import './index.css';
import App from './App.tsx';
import { AuthLayout,Login, Signup } from './components/index.ts';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: (
            <AuthLayout authentication={false}>
                <Login />
            </AuthLayout>
        ),
    },
    {
      path: "/signup",
      element: (
          <AuthLayout authentication={false}>
              <Signup/>
          </AuthLayout>
      ),
  },
    ]
    
},
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
