import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Input from './components/input'

function App() {

  // *reminder
  
  // const getData = () => {
  //   axios('/api').then((res) => console.log(res))
  // }
  // getData()

  // or
  const [data, setData] = useState({});
  console.log(data);
  useEffect(() => {
    axios('/api').then((res) => {
      setData(res.data);
    });
  }, []);
  console.log(data);
  
  // *reminder
  // const dataList = Object.entries(data).map(([key, value]) => <p>{`${key}: ${value}`}</p>);

  return (
    <>
      Hello React World!
      {/* {dataList} */}
      <Input />
    </>  
  );
}

export default App;
