import "./EndPage.css"

interface EndPageProps {
    socket: any;
    room_id: string;
    ranking: any;
}

const EndPage: React.FC<EndPageProps> = ( {socket, room_id, ranking} ) => {
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
        </div>
    )
}

export default EndPage;