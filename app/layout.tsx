import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          transition={Slide}
          theme="colored"
        />
      </body>
    </html>
  );
}
