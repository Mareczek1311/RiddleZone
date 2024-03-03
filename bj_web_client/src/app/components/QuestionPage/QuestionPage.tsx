import "./QuestionPage.css";

interface QuestionPageProps {
    socket: any;
    room_id: string;
    currQuestion: string[];
    waitForPlayers: boolean;
    correct_answer: string;
}


const QuestionPage: React.FC<QuestionPageProps> = ({socket, room_id, currQuestion, waitForPlayers, correct_answer}) => {
 
    function sendAnswer(answer: string) {
        socket.emit('send_answer', {room_id, answer});
        
    }

    return(
        <div>
            <h1>{currQuestion[0]}</h1>
            {

            waitForPlayers ?
            <div className="question-page-container">
                {
                    "a" === correct_answer ?
                    <div className="question-page-answer-correct">
                        {currQuestion[1]}
                    </div>
                    :
                    <div className="question-page-answer">
                        {currQuestion[1]}
                    </div>
                }
                {
                    "b" === correct_answer ?
                    <div className="question-page-answer-correct">
                        {currQuestion[2]}
                    </div>
                    :
                    <div className="question-page-answer">
                        {currQuestion[2]}
                    </div>
                }
                {
                    "c" === correct_answer ?
                    <div className="question-page-answer-correct">
                        {currQuestion[3]}
                    </div>
                    :
                    <div className="question-page-answer">
                        {currQuestion[3]}
                    </div>
                }
                {
                    "d" === correct_answer ?
                    <div className="question-page-answer-correct">
                        {currQuestion[4]}
                    </div>
                    :
                    <div className="question-page-answer">
                        {currQuestion[4]}
                    </div>
                }
            </div>

            :
            <div className="question-page-container">
                <div className="question-page-answer">
                    <button onClick={() => {sendAnswer("a")}} className="question-page-answer-button">{currQuestion[1]}</button>
                </div>
                <div className="question-page-answer">
                    <button onClick={() => {sendAnswer("b")}} className="question-page-answer-button">{currQuestion[2]}</button>
                </div>
                <div className="question-page-answer">
                    <button onClick={() => {sendAnswer("c")}} className="question-page-answer-button">{currQuestion[3]}</button>
                </div>
                <div className="question-page-answer">
                    <button onClick={() => {sendAnswer("d")}} className="question-page-answer-button">{currQuestion[4]}</button>
                </div>
            </div>
            }

        </div>
    )
}

export default QuestionPage;