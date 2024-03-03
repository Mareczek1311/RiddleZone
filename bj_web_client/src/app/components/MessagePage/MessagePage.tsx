import "./MessagePage.css"
import { motion } from "framer-motion";

interface MessagePageProps {
    message: string;
}

const MessagePage: React.FC<MessagePageProps> = ({message}) => {
    return (
        <motion.div className="MainSectionLobby">
            <motion.div className="ManageSectionLobby">
                <h1>{message}</h1>
            </motion.div>
        </motion.div>
    )
}

export default MessagePage;
