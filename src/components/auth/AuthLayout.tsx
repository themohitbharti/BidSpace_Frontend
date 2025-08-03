import { useEffect, useState, ReactNode } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store/store";
import AppLoader from "../common/AppLoader";

interface ProtectedProps {
  children: ReactNode;
  authentication?: boolean;
}

const Protected = ({ children, authentication = true }: ProtectedProps) => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    // Only redirect if authentication is required AND user is not logged in
    if (authentication && !authStatus) {
      navigate("/login");
    }

    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <AppLoader/> : <>{children}</>;
};

export default Protected;
