import React from "react";

function useOutsideAlerter(ref, isOpen, setIsOpen) {
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, isOpen, setIsOpen]);
}

const Dropdown = ({ button, children, classNames, animation, isOpen, setIsOpen }) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, isOpen, setIsOpen);

  return (
    <div ref={wrapperRef} className="relative flex">
      <div className="flex" onClick={() => setIsOpen(!isOpen)}>
        {button}
      </div>
      <div
        className={`${classNames} absolute z-10 ${
          animation ? animation : "origin-top-right transition-all duration-300 ease-in-out"
        } ${isOpen ? "scale-100" : "scale-0"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
