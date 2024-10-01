import { useParams } from 'react-router-dom';

export default function Game() {
    const { ID } = useParams();

    return (
        <>
        <h1>Game</h1>
        </>
    )
}