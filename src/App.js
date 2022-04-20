import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import {faArrowUp, faL, faPlay} from '@fortawesome/free-solid-svg-icons';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faPause} from '@fortawesome/free-solid-svg-icons';
import {faArrowsRotate} from '@fortawesome/free-solid-svg-icons'


function App() {
  const [duration, setDuration] = useState(5);
  const [breakT, setBreakT] = useState(3);
  const [sessionT, setSessionT] = useState(5);
  const [on, setOn] = useState(false);
  const [typp, setTypp] = useState("Session");



  const titleStyle = {
    color: 'white',
    fontSize: '3.5em'
    
  }

  const controllerStyle = {
    color: 'white',
    fontSize: '1.5em'
    
  }

  const timeDisplayStyle ={
    color:'white',
    fontSize: '2.5em'
  }

  const timer = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = (time%60)

    return (
      (minutes < 10 ? '0'+minutes : minutes) + ':' +  (seconds <10 ? '0'+seconds : seconds)
    )
  }

  const start = () =>{
    
    if (duration > 0) {
      setDuration((duration) => duration - 1);
    }
    if (duration === 0) {
      if (typp === "Session") {
        console.log(duration);
        setTypp("Break");
        setDuration(breakT);
        playSound();
      } else {
        setDuration(sessionT);
        setTypp("Session");
        playSound();
      }
    }
  }

  useEffect(()=>{
    if (on) {
      const interval = setInterval(start, 1000);
      return () => clearInterval(interval);
    }

  }); 

  const changePause = () =>{
    if (on==false){
      setOn(true);
    }
    else{
      setOn(false);
    }
  }

  const changeTime = (actual,type) => {
    if(type == 'break'){
      if(breakT <= 60 && actual < 0){
        return;
      }
        setBreakT((prev)=>prev+actual);
    }
    else{
      if(sessionT <= 60 && actual < 0){
        return;
      }
      setSessionT((prev)=>prev+actual);
      if(!on){

        setDuration((prev)=>prev+actual);
        }
    }
  }

  const playSound = () =>{
    const sound = document.getElementById("clip");
    sound.play();
  }
  
  const restart = () => {
    setDuration(25*60);
    setBreakT(5*60);
    setSessionT(25*60);
    setOn(!on);
    let interval=localStorage.getItem("intervalo");
    clearInterval(interval);
  }

  return (
    <div className="App">
      <div className='container'>
        <div className='row justify-content-center text-center m-5'>         
          <h5 style={titleStyle}>Pomodoro Clock</h5>
          <div className='col col-lg-5' style={controllerStyle}>
            <Controller title={"Break Length"} changeTime={changeTime} type="break" conTime={breakT} timer={timer}></Controller>
          </div>
          <div className='col col-lg-5'style={controllerStyle}>           
            <Controller title={"Session Length"} changeTime={changeTime} type="session" conTime={sessionT} timer={timer}></Controller>
          </div>
        </div>
        <div className='row justify-content-center text-center'>
          <div className='col-md-6' style={controllerStyle}>
            <h3>{typp}</h3>
          </div>
        </div>
        <div className='row justify-content-center text-center m-5'>
          <div className='col-md-12' style={timeDisplayStyle}>
            {timer(duration)}
          </div>
          <div className='row justify-content-center' style={controllerStyle}>
            <div className='col-2' onClick={changePause}>
              {
                on ?
                <FontAwesomeIcon icon={faPause}></FontAwesomeIcon>
                :
                <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>
              }

            </div>
            <div className='col-2' onClick={restart}>
              <FontAwesomeIcon icon={faArrowsRotate}></FontAwesomeIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Controller({title, breakduration, changeTime, type, conTime, timer}){
return(
  <div className='container'>
    <div className='row justify-content-center'>
      <div className='col-md-8 conController'>
      <FontAwesomeIcon icon={faArrowUp} onClick={() => changeTime(60,type)}></FontAwesomeIcon>
        {title}
      <FontAwesomeIcon icon={faArrowDown} onClick={() => changeTime(-60,type)}></FontAwesomeIcon>
      </div>
    </div>
    <div className='row justify-content-center'>
      <div className='col-md-8'>
        {timer(conTime)}
      </div>
      <audio id="clip" src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'/>
    </div>
  </div>
);
}

export default App;
