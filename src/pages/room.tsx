import { useParams } from 'react-router-dom';

export default function Room() {
    const id = useParams().ID;

    return (
        <>
            <h1>Room</h1>
        </>
    )
}