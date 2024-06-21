import React, { useState, useEffect, useRef } from 'react';
import cloud from './cloud.png'; 
import ReactDOM from "react-dom";
import API_BASE_URL from './apiConfig';
import { Toaster, toast } from 'sonner'
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { SketchPicker } from 'react-color'; // Importing SketchPicker from react-color
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { jwtDecode } from "jwt-decode";
import 'react-datepicker/dist/react-datepicker.css';




export default function CreateTaskModal ( {open, onClose})  {
  const [isOpen, setIsOpen]= useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff'); // Initial color value

     // State variables to manage dropdown behavior
     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     const [selectedOption, setSelectedOption] = useState('');
     const [selectedDate, setSelectedDate] = useState(null);
     const [selectedDate1, setSelectedDate1] = useState(null);
     const dropdownRef = useRef(null);
     
     

  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('access_token');
  const decodedToken = jwtDecode(access_token);
  const userId = decodedToken.userId;
  const navigate = useNavigate()
  const onClickHandler = () => navigate(`/pageFrontView`)

   // Function to toggle dropdown visibility
   const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    
  };

     // Function to handle date selection
     const handleDateSelect = (date) => {
      setSelectedDate(date);
      setIsDropdownOpen(false);
  };


  //Second Dropdown

        // State variables to manage dropdown behavior
        const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
        const [selectedOption1, setSelectedOption1] = useState('');
        const dropdownRef1 = useRef(null);

      
        // Function to toggle dropdown visibility
        const toggleDropdown1 = () => {
          setIsDropdownOpen1(!isDropdownOpen1);
        };
      
        // Function to handle option selection
        const handleOptionSelect1 = (option) => {
          setSelectedOption1(option);
          setIsDropdownOpen1(false);
          
        };

                // Function to handle date selection
     const handleDateSelect1 = (date) => {
        setSelectedDate1(date);
        setIsDropdownOpen1(false);
    };
  

        


        
         // Close dropdown when clicking outside of it 1
 useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdown when clicking outside of it 2
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) {
            setIsDropdownOpen1(false);
        }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setShowPicker(!showPicker); // Toggle color picker visibility
  };

  const handleColorChange = (color) => {
    setSelectedColor(color.hex); // Update selected color
  };
  

  const [formData, setFormData] = useState({
      task: '',
      // color: selectedColor,
      // startDate: selectedDate,
      // endDate: selectedDate1,
  
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    createTask(formData);

   
  };

  const projectId = localStorage.getItem('nProject');

 
  const createTask = async (data) => {
    console.log(data);

    setLoading(true);
    try {
      const response = await axios.post(API_BASE_URL+'/api/task' +projectId,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        console.log(response.status);
        console.log(response);    
        console.log('Task created successfully');
      } else {
        const result = await response.json();
        setLoading(false);
        toast.error(result['error']);
          console.error('Error:', result['error']);        
      }
    } catch (error) {
      setLoading(false);
      console.error('An error occurred:', error);
      console.log(error.response.data);
    }
  };

  if(!open) return null

   return ReactDOM.createPortal (
      <>
        <div className='modalOv'>
           <div className='modalStTask'>
                <p className='closeIcon' type='button' onClick={onClose} >X</p>
              <p className='taskHeader'>Create Task</p>
              <p>Here you can create and assign task</p>
              <hr className='dashHr'></hr>
              <div className='creatTask'>
              {/* <form onSubmit={handleSubmit}> */}
                <div className='taskList'>
                    {/* <p className='timeTxt'>Task</p> */}
                    <label htmlFor="test" className='timeTxt'>Task</label>
                    <input 
                    className='inpTask'
                    type="test"
                   id="task"
                   value={formData.task}
                  onChange={handleChange}
                    />
                </div>
                <div className='taskColor'>
                    <p className='timeTxt'>Color</p>
                    {/* <input className='inpTask'></input> */}
                    <input
          id="color"
          className='inpColor'
          placeholder='Select Color'
          readOnly
          value={selectedColor} // Display selected color in the input field
        />
        <button
          className="btn btn-primary forColor"
          onClick={handleButtonClick}
        >
          {showPicker ? 'Add Color' : 'Select Color'}
        </button>
      </div>
      {showPicker && (
        <div className="pickerStylesT">
          <SketchPicker
            color={selectedColor}
            onChange={handleColorChange}
            presetColors={[]}
            disableAlpha
          />
        </div>
      )}
                <div className='taskDate'>
                    <p className='timeTxt'>Start Date</p>
                    <div ref={dropdownRef} className="dropdown1">
                 <div className={`select1 ${isDropdownOpen ? 'select-clicked2' : ''}`} onClick={toggleDropdown}>
                  <span classname="selected">{selectedDate ? selectedDate.toLocaleDateString() : "Start Date"}</span>
                    <div class="caret1"></div>
                 </div>
                 {isDropdownOpen && (
                <div className="calendar-dropdownT">
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateSelect}
                        inline
                    />
                </div>
            )}                                
                </div>
                </div>
                <div className='taskDate'>
                    <p className='timeTxt'>End Date</p>
                    <div ref={dropdownRef1} className="dropdown1">
                 <div className={`select1 ${isDropdownOpen1 ? 'select-clicked1' : ''}`} onClick={toggleDropdown1}>
                  <span classname="selected">{selectedDate1 ? selectedDate1.toLocaleDateString() : "End Date"}</span>
                    <div class="caret1"></div>
                 </div>
                 {isDropdownOpen1 && (
                <div className="calendar-dropdownT">
                    <DatePicker
                        selected={selectedDate1}
                        onChange={handleDateSelect1}
                        inline
                    />
                </div>
            )}    
                                        
                </div>
                
                </div>
                {/* </form> */}
              </div>
         
           <div className='taskButtonDiv'><button type="submit" className="btn btn-primary curveImage" disabled={loading} onClick={handleSubmit}>{ loading && <FontAwesomeIcon icon={faCircleNotch} className='fa-spin'/>}
                { !loading && <span>Proceed</span>}
                
              </button>
                    </div>
           </div> 
           
             <Toaster  position="top-right" />
        </div>
        </>,
        document.getElementById('portal')
     );
}