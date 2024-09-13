import { useParams } from 'react-router-dom';

export default function Game() {
    const id = useParams().ID;

    return (
        <>
        <h1>Game</h1>
        </>
    )
}