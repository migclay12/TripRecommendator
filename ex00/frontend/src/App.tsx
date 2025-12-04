import { useState } from 'react';
import './App.css'

type Destination = {
  id: string;
  name: string;
  country: string;
  description: string;
}

const mockDestination: Destination[] = [
  {
    id: '1',
    name: 'Burgos',
    country: 'Spain',
    description: 'Su catedral es más bonita que la de León a pesar de cambiarle las putas puertas',
  },
  {
    id: '2',
    name: 'Cadiz',
    country: 'Andalucia',
    description: 'Nadie sabe que decir de este lugar, buena fiesta supongo',
  },
];

function App() {

  const [entryText, setEntryText] = useState('');
  const [exitText, setExitText] = useState('');

  const handleSearch = async () => {
    if (!entryText.trim()) {
      alert('Pleasse write something');
      return ;
    }

    try {
      const response = await fetch('http://localhost:3001/echo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: entryText,
        }),
      });

      const data = await response.json();

      setExitText(data.processedText);
    } catch (error) {
      setExitText('Error al conectar con el backend');
    } 
  };

  return (
    <div className="main-page">
      <header className='main-header'>
        <h1 className='main-title'>Trip Recommendator</h1>
        <p className='main-subtitle'>
          Please describe the trip you would like to make and we will recommend you multiple destinations
        </p>
      </header>

      <main className='app-main'>
        {/* {search bar} */}
        <section className='search-section'>
          <label 
            htmlFor="trip-query"
            className='search-label'
            >
              Where would you like to travel?
            </label>
            <textarea
              id="trip-query"
              className='search-textarea'
              rows={3}
              placeholder='I want a cheap trip to the beach somhere in europe'
              value={entryText}
              onChange={(e) => setEntryText(e.target.value)}
            ></textarea>
            <button
              type='button'
              className='search-button'
              onClick={handleSearch}
            >
              Search trip
            </button>
        </section>

        <section className="search-section">
          <label htmlFor="texto-salida" className="search-label">
            Respuesta del backend:
          </label>
          <textarea
            id="texto-salida"
            className="search-textarea"
            rows={3}
            value={exitText}
            readOnly
            placeholder="Aquí aparecerá la respuesta del backend..."
          />
        </section>

        {/* Results area: list + map */}
        <section className='results-layout'>
          {/* destinationList */}
          <div className='results-list'>
            <h2 className='results-title'>Reccomended destinations: </h2>
            <p className='results-hint'>
              This results are mock tests
            </p>
            <ul className='results-items'>
              {mockDestination.map((dest) => (
                <li
                  key={dest.id}
                  className='destination-card'
                >
                  <h3 className='destination-title'>
                    {dest.name}{' '}
                    <span className='destination-country'>
                      ({dest.country})
                    </span>
                  </h3>
                  <p className='destination-descriprion'>
                    {dest.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Mapview */}
          <div className='map-placeholder'>
            Here goes the map
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
