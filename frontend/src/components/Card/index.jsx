function Card({ info }) {
  return (
    <div className="bg-white text-black rounded-2xl shadow-xl p-4 flex flex-col items-center w-40">
      <p className="text-sm text-gray-500 mb-1">{info.date}</p>
      <img
        className="h-14 w-14 mb-2"
        src={`/gifs/${info.icon}.gif`}
        alt="weather icon"
      />
      <p className="text-xl font-bold">{info.temp.toFixed(1)}°C</p>
      <p className="text-gray-600 capitalize text-sm">{info.description}</p>
    </div>
  );
}

export default Card;
