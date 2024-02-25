import "./QuestionPage.css";

interface QuestionPageProps {
    socket: any;
    room_id: string;
    currQuestion: string[];
}


const QuestionPage: React.FC<QuestionPageProps> = ({socket, room_id, currQuestion}) => {

    function sendAnswer(answer: string) {
        socket.emit('send_answer', room_id, answer);
    }

    return(
        <div>
            <h1>{currQuestion[0]}</h1>

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

        </div>
    )
}


export default QuestionPage;