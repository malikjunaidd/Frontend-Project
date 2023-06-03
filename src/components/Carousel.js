import React, {useRef} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PIC1 from './PIC1.png';
import PIC2 from './PIC2.png';
import PIC3 from './PIC3.png';
import PIC4 from './PIC4.png';
import PIC5 from './PIC5.jpg';
import PIC6 from './PIC6.jpg';
import PIC7 from './PIC7.jpg';
import PIC8 from './PIC8.png';
import './carousal.css'

export const Carousel = () => {
  const sliderRef = useRef(null);
  const NextArrow = (props) => {
    const { onClick } = props;
    return <button className="arrow next" onClick={onClick}></button>;
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return <button className="arrow prev" onClick={onClick}></button>;
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 1500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };
  
  return (

      <Slider {...settings} ref={sliderRef}>
         <div className='hello'>
          <img src={PIC6} alt="Image 6" />
        </div>
        
        <div className='hello' >
          <img src={PIC5} alt="Image 5" />
        </div>
        <div className='hello' >
          <img src={PIC1} alt="Image 1" />
        </div>
        <div className='hello'>
          <img src={PIC2} alt="Image 2" />
        </div>
        <div className='hello'>
          <img src={PIC3} alt="Image 3" />
        </div>
        <div className='hello'>
          <img src={PIC4} alt="Image 4" />
        </div>
        
       
        <div className='hello'>
          <img src={PIC8} alt="Image 8" />
        </div>
        <div className='hello'>
          <img src={PIC7} alt="Image 7" />
        </div>
      </Slider>

  );
};
