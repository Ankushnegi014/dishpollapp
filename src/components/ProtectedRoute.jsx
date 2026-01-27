import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ element }) {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    if(!token) {
        navigate('/login')
    }
    return element;
}