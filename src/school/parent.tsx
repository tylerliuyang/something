import React, { useEffect, useRef, useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { DropdownButton } from 'react-bootstrap';
import { ClassChecker } from './get_class';
import { useParams } from "react-router";

const Parent = () => {
  const [Counter, setCounter] = useState<number>(0);
  const [ClassNums, setClassNums] = useState('');
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [Action, setAction] = useState<string>('select action');
  const [Repeat, setRepeat] = useState<boolean>(false);
  const [Ip, setIp] = useState("https://aaaaa.fly.dev");
  const [Time, setTime] = useState(Math.floor(Date.now()/1000).toString());
  const Resolver = useRef<(value: boolean | PromiseLike<boolean>) => void>((e) => e);
  const FirstPromise = useRef<Promise<boolean>>(new Promise((_,__) => _));


    useEffect(() => {
        let p = new Promise<boolean>((resolve, _) => {Resolver.current = resolve});
        FirstPromise.current = p;
    }, []);

    const promises = useRef<Array<[Promise<boolean>, Promise<boolean>, ((value: boolean | PromiseLike<boolean>) => void)]>>([]);

    for (let i = 0; i < Counter; i++) {
        let resolver: ((value: boolean | PromiseLike<boolean>) => void) = ((e) => e);

        let p = new Promise<boolean>((resolve, _) => {resolver = resolve;})
        if (promises.current.at(i) !== undefined) {
            console.log(i);
            continue
        }
        promises.current.push([p, p, resolver]); // gets promply overwritten used for indexing purposes
        if (i===0) {
                promises.current[0] = [FirstPromise.current, p, resolver]; 
        } else {
            promises.current[i] = [promises.current[i-1][1], p, resolver];
        }
    }
  
  // const { onyen, password } = useParams();
  //   if (onyen != undefined && password != undefined) {
  //     const formData = new FormData();
  //     formData.set('USER', onyen);
  //     formData.set('PASSWORD', password);
  //     fetch("https://aaaaa.fly.dev" + "/api/verify", {
  //       method: 'POST', mode: 'cors', body: formData,
  //       headers: {'Access-Control-Allow-Origin':'*'}
  //     }).then((e) => {console.log(e.text)});
  //   } else {
  //     return <div>please login</div>
  //   }
  

   return (
    <div>
        <h1><b>some things to keep in mind:</b></h1>
        <h2>the desired course <b>must</b> already be in your cart</h2>
        <h2>format courses like "1423 1235" (without quotations)</h2>
        <h2>only run <b>1</b> instance per account</h2>
        <h2>If buggy, try again while logged out of connectcarolina. </h2>
        <h2>if you make a mistake or want to use it again you must refresh</h2>
        <h2>repeat is currently only supported for class lookup, time is only supported for add/swap</h2>
        <h2>Instructions: Fill in all details on the right and select an action.</h2>
        <h2>Instructions: When you are done with one 'action' hit increase actions.</h2>
        <h2>Instructions: You can add as many actions as you want, and when you hit "start" they will run sequentially</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          console.log("SUBMITTED!");
          Resolver.current(true);
        }}
      >
        <input type="button" value={"increase actions"} onClick={(e) => {setCounter(Counter + 1);}}/>
        <input type="button" value={"decrease actions"} onClick={(e) => {setCounter(Counter - 1);}}/>
        <button type="submit">Start!</button>

        <DropdownButton className="d-inline mx-2" title={Action}>
            <Dropdown.Item onClick={(e) => setAction("add")}>add</Dropdown.Item>
            <Dropdown.Item onClick={(e) => setAction("swap")}>swap</Dropdown.Item>
            <Dropdown.Item onClick={(e) => setAction("lookup")}>lookup</Dropdown.Item>
        </DropdownButton>
        <input type="checkbox" onChange={(e) => setRepeat(!Repeat)} value="repeat?"/>repeat? 
        <input placeholder='11039 1234' value={ClassNums} onChange={(e) => {(setClassNums(e.target.value));}}/>
        <input placeholder='username' value={Username} onChange={(e) => {(setUsername(e.target.value));}}/>
        <input placeholder='password' value={Password} onChange={(e) => {(setPassword(e.target.value));}}/>
        <input placeholder='time?' value={Time} onChange={(e) => {(setTime(e.target.value));}}/>
        <input placeholder='setip' value={Ip} onChange={(e) => {(setIp(e.target.value));}}/>
        
        {promises.current.map((arr) => {
            return <ClassChecker reciever={arr[0]} resolver={arr[2]} username={Username} password={Password} action={Action} classnums={ClassNums} repeat={Repeat} ip={Ip} time={Time}/>
        })}
      </form>
    </div>
  );
};

export { Parent }