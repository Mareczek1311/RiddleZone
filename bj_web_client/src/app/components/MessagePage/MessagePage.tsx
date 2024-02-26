import "./MessagePage.css"

interface MessagePageProps {
    message: string;
}

const MessagePage: React.FC<MessagePageProps> = ({message}) => {
    return (
        <div>
            <h1>{message}</h1>
        </div>
    )
}

export default MessagePage;
