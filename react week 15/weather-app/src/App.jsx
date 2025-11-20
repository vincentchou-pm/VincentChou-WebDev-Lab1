import { useState } from 'react'
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(1);     
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);

  const API_KEY = "8adbfb04e6054d9789763919252011";

  const getWeather = async (cityInput = city, dayInput = days) => {
    if (!cityInput) return alert("Masukkan Nama Kota!");
    if (dayInput < 1 || dayInput > 14) return alert("Hari harus 1 - 14");

    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityInput}&days=${dayInput}&lang=id`
      );

      setForecast(response.data);

      setHistory((prev) => [...prev, { city: cityInput, days: dayInput }]);

    } catch (error) {
      alert("Kota tidak ditemukan!");
    }
  };

  const selectHistory = (item) => {
    setCity(item.city);
    setDays(item.days);
    getWeather(item.city, item.days);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">

      <h1 className="text-3xl font-semibold text-blue-600 mb-8">Aplikasi Ramalan Cuaca</h1>

      <div className="mb-6 flex space-x-4">
        
        <input
          type="text"
          placeholder="Masukkan Nama Kota..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="number"
          min="1"
          max="14"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className="px-4 py-2 w-24 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Hari"
        />

        <button
          onClick={() => getWeather()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Cek Cuaca
        </button>
      </div>

      {/* HASIL FORECAST */}
      {forecast && (
        <div className="bg-white p-6 rounded-md shadow-md w-[400px]">

          <h2 className="text-2xl font-semibold mb-4 text-center">
            {forecast.location.name}, {forecast.location.country}
          </h2>

          <h3 className="text-xl font-semibold mb-3">Ramalan {days} Hari</h3>

          <div className="space-y-4">
            {forecast.forecast.forecastday.map((day, index) => (
              <div key={index} className="p-4 border rounded-md shadow-sm bg-gray-50">
                
                <p className="font-semibold text-lg">{day.date}</p>

                <p>Suhu rata-rata: {day.day.avgtemp_c}°C</p>
                <p>Kondisi: {day.day.condition.text}</p>

                {/* Per jam hanya utk hari pertama */}
                {index === 0 && (
                  <div className="mt-2">
                    <p className="font-semibold">Detail per jam:</p>
                    <ul className="list-disc list-inside">
                      {day.hour.slice(0, 6).map((hour, idx) => (
                        <li key={idx}>
                          {hour.time} — {hour.temp_c}°C ({hour.condition.text})
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-500">* 6 jam pertama</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-8 w-80">
          <h3 className="text-xl font-semibold mb-4 text-center">History Pencarian</h3>
          <ul className="list-disc list-inside space-y-2">
            {history.map((item, index) => (
              <li 
                key={index} 
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => selectHistory(item)}
              >
                {item.city} - {item.days} hari
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default App;
