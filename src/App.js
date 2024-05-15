import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

// MARK: App()
function App() {
  const [option, setOptions] = useState([]); // get languages
  const [lang1, setLang1] = useState(''); // selected language
  const [lang2, setLang2] = useState(''); // get data for the target selector
  const [input, setInput] = useState(''); // file input
  const [output, setOutput] = useState('');
  const [state, setState] = useState('');
  const [filename, setFilename] = useState(''); // store file with contents in state

  // MARK: handleFile()
  // when onChange is triggered, get name and store in filename state
  const handleFile = (e) => {
    console.log(e.target.files[0]);
    console.log(e.target.files[0].name);
    setFilename(e.target.files[0].name);
  };

  // MARK: showFile()
  // read file's contents and store in input state
  const showFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const test = e.target.result;
      console.log(test);
      setInput(test);
    };
    reader.readAsText(e.target.files[0]);
  };

  // MARK: useEffect()
  useEffect(() => {
    axios.get("https://libretranslate.de/languages", {
      headers: {
        'accept': 'application/json'
      }
    }).then((res) => {
      console.log(res.data);
      setOptions(res.data); // set the options state with Language data from API
    });
  }, []);

  // MARK: translate()
  const translate = (e) => {
    e.preventDefault();

    // parameter for all data being sent
    const params = new URLSearchParams();
    params.append('q', input); // hold text to translate
    params.append('source', lang1); // input language
    params.append('target', lang2); // output language
    params.append('api_key', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    // send POST request through axios to API
    axios.post("https://libretranslate.de/translate", params, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => {
      console.log(res.data); // the object data of translated text
      let valo = `${res.data.translatedText}`; // this is the translated text from data object
      setOutput(valo); // store data in an output state
      console.log(output);
    });

    // send filename and translated text to Express app
    params.append("text", output);
    params.append("filename", filename);

    axios.post("http://localhost:3001", params, {
    }).then((res) => {
      console.log('success :', res.data);
    }).catch((error) => {
      console.log('error', error);
    });

    // download the file
    // store the response in state
    axios.get("http://localhost:3001").then(function (response) {
      setState(response);
      console.log('this is:', response);
    }, []);
  };

  // MARK: return (
  return (
    <div className="App">
      <div className='container-header'>
        <h2>Subtitle Translator</h2>
      </div>
      <div className='container-content'>
        <div className='container-body'>
          <h2>Enter subtitle file below</h2>

          {/* events for the file input  */ }
          <input
            type='file'
            name='file'
            accept='.srt'
            onChange={ handleFile }
            onInput={ showFile } />
        </div>

        <div className='container-select'>

          {/* map the request data  */ }
          <h2 className='select1'>Select input language { lang1 } </h2>
          <select className='selector1' name='lang' id='lang' onChange={ e => setLang1(e.target.value) }>
            { option.map(opt => (<option key={ opt.code } value={ opt.code } > { opt.name }</option>)) }
          </select>

          {/* getting the data  */ }
          <h2 className='select2'>Select output language { lang2 } </h2>
          <select className='selector2' onChange={ e => setLang2(e.target.value) }>
            { option.map(opt => (<option key={ opt.code } value={ opt.code } > { opt.name }</option>)) }
          </select>
        </div>

        {/* add translate feature */ }
        <div className='container-button'>
          <button onClick={ translate }>translate</button>
        </div>

        {/* on click, redirect to port 3001, but the port send subtitle file for download */ }
        <div className='container-button'>
          <a href='http://localhost:3001'>
            <button>Download</button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
