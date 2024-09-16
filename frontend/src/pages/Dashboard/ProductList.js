import React from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const { products, updateProduct, getProductById, selectedProduct, setSelectedProduct, isLoading } = useProduct();

  const handleDeactivate = async (id) => {
    try {
      await updateProduct(id, { is_active: false });
      message.success('Product deactivated successfully');
    } catch (error) {
      message.error('Failed to deactivate product');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      await getProductById(id);
    } catch (error) {
      message.error('Failed to fetch product details');
    }
  };

  const columns = [
    {
      title: 'English Name',
      dataIndex: 'en_title',
      key: 'en_title',
    },
    {
      title: 'Arabic Name',
      dataIndex: 'ar_title',
      key: 'ar_title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/edit-product/${record.id}`}>
            <Button icon={<EditOutlined />} />
          </Link>
          <Button icon={<EyeInvisibleOutlined />} onClick={() => handleDeactivate(record.id)} />
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record.id)} />
        </Space>
      ),
    },
  ];

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <Table 
        columns={columns} 
        dataSource={products.filter(product => product.is_active)} 
        rowKey="id" 
        loading={isLoading}
      />
      <Modal
        title="Product Details"
        visible={!!selectedProduct}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <div>
            <p><strong>English Title:</strong> {selectedProduct.en_title}</p>
            <p><strong>Arabic Title:</strong> {selectedProduct.ar_title}</p>
            <p><strong>Price:</strong> ${parseFloat(selectedProduct.price).toFixed(2)}</p>
            <p><strong>Stock:</strong> {selectedProduct.quantity}</p>
            <p><strong>English Description:</strong> {selectedProduct.en_description}</p>
            <p><strong>Arabic Description:</strong> {selectedProduct.ar_description}</p>
            <h3>English Attributes:</h3>
            <ul>
              {selectedProduct.en_attributes.map((attr, index) => (
                <li key={index}>
                  {attr.attribute_name}: {attr.values.join(', ')}
                </li>
              ))}
            </ul>
            <h3>Arabic Attributes:</h3>
            <ul>
              {selectedProduct.ar_attributes.map((attr, index) => (
                <li key={index}>
                  {attr.attribute_name}: {attr.values.join(', ')}
                </li>
              ))}
            </ul>
            <p><strong>Is Deal:</strong> {selectedProduct.is_deal ? 'Yes' : 'No'}</p>
            <p><strong>Is Hot Deal:</strong> {selectedProduct.is_hot_deal ? 'Yes' : 'No'}</p>
            <p><strong>VAT Included:</strong> {selectedProduct.vat_included ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;