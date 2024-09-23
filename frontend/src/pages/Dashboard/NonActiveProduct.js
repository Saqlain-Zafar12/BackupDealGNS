import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';

const NonActiveProduct = () => {
  const { nonActiveProducts, reactivateProduct, isLoading, fetchProducts } = useProduct();
  const [reactivatingId, setReactivatingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleReactivate = async (id) => {
    setReactivatingId(id);
    try {
      await reactivateProduct(id);
      message.success('Product reactivated successfully');
      fetchProducts(); // Fetch updated data after reactivation
    } catch (error) {
      message.error('Failed to reactivate product: ' + (error.response?.data?.message || error.message));
    } finally {
      setReactivatingId(null);
    }
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_title',
      key: 'en_title',
      width: 150,
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_title',
      key: 'ar_title',
      width: 150,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button 
          icon={<RedoOutlined />} 
          onClick={() => handleReactivate(record.id)}
          loading={reactivatingId === record.id}
        />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Non-Active Products</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={nonActiveProducts} 
          rowKey="id" 
          loading={isLoading}
          scroll={{ x: 'max-content' }}
          pagination={{
            responsive: true,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </div>
    </div>
  );
};

export default NonActiveProduct;
