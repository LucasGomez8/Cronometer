import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
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
  const [breakOn, setBreakOn] = useState(false);
  const [audio, setAudio] = useState(
    new Audio("./assets/breakAudio.mp3")
  )

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  }



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
      if(on==false){

        setDuration((prev)=>prev+actual);
        }
    }
  }

  const start = () =>{
    let sec= 1000;
    let datsec = new Date().getTime();
    let datnextsec = new Date().getTime()+sec;
    let isBreak=breakOn;
    if(!on){
      let interval = setInterval(()=>{
        datsec = new Date().getTime();
          if(datsec>datnextsec){
            
            setDuration((prev)=>{
              if(prev <=0 && !breakOn){
                playSound();
                isBreak=true;
                setBreakOn(true);
                return breakT;
              }
              else if (prev <=0 && breakOn){
                playSound();
                isBreak=false;
                setBreakOn(false);
                return sessionT;
              }
               return prev - 1;
              });
            datnextsec+=sec;
          }
      
      },30);
    localStorage.clear();
    localStorage.setItem("intervalo",interval);
    }
    if(on){
      clearInterval(localStorage.getItem("intervalo"));
    }
    setOn(!on);
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
          <div className='col-md-6'>
            <h3>{breakOn ? 'Break' : 'Session'}</h3>
          </div>
        </div>
        <div className='row justify-content-center text-center m-5'>
          <div className='col-md-12' style={timeDisplayStyle}>
            {timer(duration)}
          </div>
          <div className='row justify-content-center' style={controllerStyle}>
            <div className='col-2' onClick={start}>
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
    </div>
  </div>
);
}

export default App;
