import React from 'react';
import { Table, Button, Space } from 'antd';
import { EditOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const ProductList = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 19.99, stock: 100 },
    { id: 2, name: 'Product 2', price: 29.99, stock: 50 },
    { id: 3, name: 'Product 3', price: 39.99, stock: 75 },
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
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => console.log('Edit', record.id)} />
          <Button icon={<EyeInvisibleOutlined />} onClick={() => console.log('Deactivate', record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => console.log('Edit', product.id)} />
                    <Button icon={<EyeInvisibleOutlined />} onClick={() => console.log('Deactivate', product.id)} />
                  </Space>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;