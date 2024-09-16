import React from 'react';
import { Table, Button } from 'antd';
import { RedoOutlined } from '@ant-design/icons';

const NonActiveProduct = () => {
  const nonActiveProducts = [
    { id: 1, name: 'Inactive Product 1', price: 19.99, stock: 100 },
    { id: 2, name: 'Inactive Product 2', price: 29.99, stock: 50 },
    { id: 3, name: 'Inactive Product 3', price: 39.99, stock: 75 },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<RedoOutlined />} onClick={() => console.log('Reactivate', record.id)} />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Non-Active Products</h2>
      <Table columns={columns} dataSource={nonActiveProducts} rowKey="id" />
    </div>
  );
};

export default NonActiveProduct;
