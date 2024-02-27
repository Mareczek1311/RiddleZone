import "./EndPage.css"

interface EndPageProps {
    socket: any;
    room_id: string;
    ranking: any;
    playerData: [boolean, boolean, string];
}

const EndPage: React.FC<EndPageProps> = ( {socket, room_id, ranking, playerData} ) => {
    return (
        <div className="EndPage">
            <h1>GAME IS ENDED</h1>

            <div>
                <h2>Ranking</h2>
                <ol>
                    {ranking.map((player: any) => {
                        return <li>{player[0]} - {player[1]}</li>
                    })}
                </ol>
            </div>
            {
                playerData[0] ? 
                <button onClick={() => {
                    socket.emit("restart_game", room_id);
                }}>Restart game</button>
                : 
                <h2>Waiting for the host to restart the game</h2>
            }
        </div>
    )
}

export default EndPage;