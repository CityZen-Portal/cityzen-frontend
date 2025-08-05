import { useNavigate } from 'react-router-dom'
import Card from "components/card";
import { motion } from 'framer-motion';

const HelpCard = ({ title, description, Icon, link, color = 'from-blue-500 to-blue-600' }) => {
    const navigate = useNavigate();
    
    return (
        <motion.div whileHover={{ y: -5 }}>
            <Card
                extra={`flex flex-col w-full h-full !p-0 bg-white overflow-hidden cursor-pointer group`}
            >
                <div 
                    className="h-full w-full"
                    onClick={() => {
                        navigate(link)
                        window.scrollTo(0, 0);
                    }}
                >
                    <div className="relative h-full">
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}></div>
                        
                        <div className="flex flex-col items-center justify-center gap-4 p-6 sm:p-8 pt-10">
                            <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${color} p-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className="text-3xl" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center dark:text-white">{title}</h2>
                            <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">{description}</p>
                            
                            <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                                <span className="font-medium">Get started</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default HelpCard;