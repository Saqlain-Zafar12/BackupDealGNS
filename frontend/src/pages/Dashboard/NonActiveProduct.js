import React from 'react';
import { Table, Button, message } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';

const NonActiveProduct = () => {
  const { products, updateProduct, isLoading } = useProduct();

  const handleReactivate = async (id) => {
    try {
      await updateProduct(id, { is_active: true });
      message.success('Product reactivated successfully');
    } catch (error) {
      message.error('Failed to reactivate product');
    }
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_product_name',
      key: 'en_product_name',
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_product_name',
      key: 'ar_product_name',
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
        <Button icon={<RedoOutlined />} onClick={() => handleReactivate(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Non-Active Products</h2>
      <Table 
        columns={columns} 
        dataSource={products.filter(product => !product.is_active)} 
        rowKey="id" 
        loading={isLoading}
      />
    </div>
  );
};

export default NonActiveProduct;
