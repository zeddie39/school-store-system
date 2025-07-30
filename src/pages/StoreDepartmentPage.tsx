import React from 'react';
import { useParams } from 'react-router-dom';

const StoreDepartmentPage: React.FC = () => {
  const { department } = useParams<{ department: string }>();
  // Mock items for demonstration
  const items = [
    { id: 1, name: 'Biology Textbook', added: '2025-07-01', description: 'Standard biology curriculum textbook', quantity: 50, supplier: 'Textbook Publishers Ltd.' },
    { id: 2, name: 'Lab Microscope', added: '2025-06-15', description: 'Optical microscope for lab use', quantity: 10, supplier: 'Lab Equip Co.' },
    { id: 3, name: 'Football', added: '2025-07-10', description: 'Official size football', quantity: 20, supplier: 'Sports Supplies Ltd.' },
  ];

  const [selectedItem, setSelectedItem] = React.useState<any | null>(null);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Store Department: {department}</h1>
      <p className="mb-6">This is the store department page for <strong>{department}</strong>.</p>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-lg mb-8">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-primary/10 font-semibold">
              <th className="p-4 text-left">Item Name</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Supplier</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{item.supplier}</td>
                <td className="p-4">
                  <button
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80"
                    onClick={() => setSelectedItem(item)}
                  >
                    View Item
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative" style={{ border: '2px solid #007bff', zIndex: 10000 }}>
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-primary"
              onClick={() => setSelectedItem(null)}
              style={{ fontSize: 24, fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
            <div className="mb-2"><strong>Date Added:</strong> {selectedItem.added}</div>
            <div className="mb-2"><strong>Description:</strong> {selectedItem.description}</div>
            <div className="mb-2"><strong>Quantity:</strong> {selectedItem.quantity}</div>
            <div className="mb-2"><strong>Supplier:</strong> {selectedItem.supplier}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDepartmentPage;
