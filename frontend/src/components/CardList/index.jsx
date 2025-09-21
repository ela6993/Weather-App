import Card from "../Card";

function CardList({ listdata }) {
  return (
    <div className="mt-6 flex gap-4 flex-wrap justify-center">
      {listdata.map((a) => (
        <Card key={a.id} info={a} />
      ))}
    </div>
  );
}

export default CardList;
