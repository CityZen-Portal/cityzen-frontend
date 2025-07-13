import { useNavigate } from 'react-router-dom'
import Card from "components/card";

const HelpCard = ({ title, description, Icon, link }) => {
    const navigate = useNavigate();
    
    return (
      <Card
        extra={`flex flex-col w-full h-full !p-3 sm:!p-4 lg:!p-6 3xl:p-![18px] bg-white cursor-pointer hover:shadow-lg transition-shadow duration-300`}
      >
        <div className="h-full w-full text-center flex items-center justify-center p-2 sm:p-3 lg:p-4" 
          onClick={() => {
            navigate(link)
            window.scrollTo(0, 0);
          }}>
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 lg:gap-6">
            <div className="inline-flex items-center justify-center rounded-full bg-purple-100 shadow-lg shadow-purple-300 p-3 sm:p-4 lg:p-5">
              <Icon className="text-2xl sm:text-3xl lg:text-4xl text-purple-600" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-navy-700 dark:text-white text-center px-2">{title}</h2>
            <p className="mt-1 text-xs sm:text-sm lg:text-base font-medium text-gray-600 md:mt-2 text-center px-2 leading-relaxed">{description}</p>
          </div>
        </div>
      </Card>
    );
};

export default HelpCard;