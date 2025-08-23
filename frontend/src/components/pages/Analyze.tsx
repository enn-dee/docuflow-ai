import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../ui/button';

const Analyze = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate()

    return (
        <div>
            {/* save it's history and show ip, for job description*/}
            <Button onClick={() => navigate(-1)}>Dashboard</Button>
            Analyze
            <h1>id: {id}</h1>
        </div>
    )
}

export default Analyze