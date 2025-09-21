import { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from './components/CardList'

function App() {
  const [message, setMessage] = useState("")
  const [city, setCity] = useState("")
  const [response, setResponse] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  const handleCity = async (e) => {
    e.preventDefault()
    setResponse(null)
    setForecast([])
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:5000/weather", { city_: city })
      const data = res.data

      if (data.error) {
        setError(data.error)
        setResponse(null)
      } else {
        setResponse(data.data1)
        setForecast(data.data2.slice(1))
      }
    } catch (err) {
      setError("Server Connection Error")
    } finally {
      setLoading(false)
    }
  }


  
  return (
    <div className="w-250 h-250 flex rounded-xl flex-col items-center justify-start bg-gradient-to-br from-blue-500 to-indigo-700 p-6 text-white">
      <h1 className="text-4xl font-bold mb-4">🌦️ Weather App</h1>
      <p className="mb-6">{message}</p>

      <form
        className="flex w-full p-2 max-w-md bg-white rounded-lg overflow-hidden shadow-md"
        onSubmit={handleCity}
      >
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={e => setCity(e.target.value)}
          required
          className="flex-grow px-4 py-2 text-black outline-none"
        />
        <button
          type="submit"
          className="bg-yellow-500 rounded-lg hover:bg-yellow-600 px-4 py-2 font-semibold"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-300 font-semibold">{error}</p>
      )}

      {response && (
        <div className="mt-8 bg-white text-black rounded-2xl shadow-xl p-6 flex flex-col items-center w-72">
          <h2 className="text-2xl font-bold mb-2">{response.city}</h2>
          <img
            className="h-20 w-20 mb-2"
            src={`/gifs/${response.icon}.gif`}
            alt="weather icon"
          />
          <p className="text-3xl font-bold">{response.temperature}°C</p>
          <p className="text-gray-600 capitalize">{response.description}</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="mt-10 w-full flex flex-col items-center">
          <p className="text-xl font-bold mb-6 text-white">
            Forecast for the next 5 days
          </p>
          <CardList listdata={forecast} />
        </div>
      )}

      {loading && (
        <p>Loading...</p>
      )}

    </div>
  )
}

export default App
