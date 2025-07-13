import React from 'react'
import { useNavigate } from 'react-router-dom'

const Button = ({ Icon, text, link }) => {
  const navigate = useNavigate()
  return (
    <button
      className='flex items-center gap-x-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500 dark:text-black hover:bg-blue-200 dark:hover:bg-blue-600 transition-all'
      onClick={() => {
        navigate(link);
        window.scrollTo(0, 0);
      }}
    >
        <Icon className="text-base" />
        {text}
    </button>

  )
}

export default Button