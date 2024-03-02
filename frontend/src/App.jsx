import React, { useState,useEffect } from "react";
import "./styles/index.css";
import Shape from "./components/Shape";
import { Toaster } from "react-hot-toast";
import { FormContainer } from "./components/FormContainer";
import { useSelector, useDispatch} from "react-redux";
import { Dashboard } from "./components/Dashboard";
import { refreshAccessToken } from "./slices/authSlice";
export const App = () => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const storedRefreshToken = localStorage.getItem("refreshToken");
  const loading = useSelector((state) => state.auth.loading);
  const [backgroundColor, setBackgroundColor] = useState("#5B5EA6");
  const dispatch = useDispatch()

  const numberOfShapes = 20;

  const shapes = Array.from({ length: numberOfShapes }, (_, index) => (
    <Shape key={index} />
  ));


  useEffect(() => {
    const refreshAccessTokenIfNeeded = async () => {
      if (!isAuthenticated && storedRefreshToken) {
        try {
          await dispatch(refreshAccessToken(storedRefreshToken));
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
    };
    refreshAccessTokenIfNeeded();
  }, [dispatch, isAuthenticated, storedRefreshToken]);

  if (isAuthenticated) {
    return (
      <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        <Dashboard setBackgroundColor={setBackgroundColor} />
      </div>
    );
  }

  return (
    <>
      <div className="body" style={{ background: backgroundColor }}>
        <div className="shape-container">{shapes}</div>
        {!loading && (<FormContainer setBackgroundColor={setBackgroundColor} />)}
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default App;