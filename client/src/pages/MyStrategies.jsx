import React from 'react'

const MyStrategies = () => {
  const [open, setOpen] = useState(null);

  const toggle = (i) => {
    setOpen(open === i ? null : i);
  };

  const data = [
    {
      title: "Fees",
      content:
        "Performance fee is calculated based on profit threshold...",
    },
    {
      title: "Trading and allocation",
      content:
        "Orders are based on equity and strategy allocation...",
    },
    {
      title: "Attracting investors",
      content:
        "Share your strategy link to attract investors...",
    },
    {
      title: "Privacy",
      content:
        "You can hide your strategy from the catalog...",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">FAQ</h2>

      {data.map((item, i) => (
        <div key={i} className="border rounded-lg">
          <button
            onClick={() => toggle(i)}
            className="w-full flex justify-between p-4 text-sm font-medium"
          >
            {item.title}
            <span>{open === i ? "-" : "+"}</span>
          </button>

          {open === i && (
            <div className="p-4 pt-0 text-sm text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyStrategies
