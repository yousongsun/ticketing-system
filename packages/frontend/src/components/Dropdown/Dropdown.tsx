import React from 'react';

// Declare default dropdown properties
interface DropdownProps {
  options: { value: string; label: string }[];
  placeholderText?: string;
}

// Dropdown component updating with selected option
export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholderText = 'Select an Option',
}) => {
  // State to manage dropdown open/close status and selected options from user
  const [isOpen, setOpen] = React.useState(false);
  const outsideRef = React.useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null,
  );

  // Close dropdown if user clicks outside of it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        outsideRef.current &&
        !outsideRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Changing dropdown button text if user selects an option
  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    setOpen(false);
  };
  const selectedLabel = options.find(
    (option) => option.value === selectedOption,
  );

  // General Structure of the dropdown
  return (
    <div ref={outsideRef}>
      <button type="button" onClick={() => setOpen(!isOpen)}>
        {selectedLabel ? selectedLabel.label : placeholderText}
      </button>

      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
