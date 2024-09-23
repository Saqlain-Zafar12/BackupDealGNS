import React, { useEffect } from 'react';
import { Table, Button, Space, message, Modal, Image } from 'antd';
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useProduct } from '../../context/ProductContext';
import { Link } from 'react-router-dom';

const ProductList = () => {
  const { 
    products, 
    deleteProduct, 
    getProductById, 
    selectedProduct, 
    setSelectedProduct, 
    isLoading, 
    fetchProducts 
  } = useProduct();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  const backendUrl = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000').replace(/\/api\/v1$/, '');
  const handleDeactivate = async (id) => {
    try {
      await deleteProduct(id);
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
      title: 'Max Quantity Per User',
      dataIndex: 'max_quantity_per_user',
      key: 'max_quantity_per_user',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
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
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={products} 
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
      <Modal
        title="Product Details"
        visible={!!selectedProduct}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedProduct && (
          <div>
            <h3>Main Image:</h3>
            {selectedProduct.image_url ? (
              <Image
                width={200}
                src={`${backendUrl}/${selectedProduct.image_url}`}
                alt={selectedProduct.en_title}
              />
            ) : (
              <p>No main image available</p>
            )}

            <h3>Tab Images:</h3>
            {selectedProduct.tabs_image_url && Object.keys(selectedProduct.tabs_image_url).length > 0 ? (
              <Image.PreviewGroup>
                <Space>
                  {Object.values(selectedProduct.tabs_image_url).map((url, index) => (
                    <Image
                      key={index}
                      width={100}
                      src={`${backendUrl}/${url}`}
                      alt={`Tab image ${index + 1}`}
                    />
                  ))}
                </Space>
              </Image.PreviewGroup>
            ) : (
              <p>No tab images available</p>
            )}

            <p><strong>English Title:</strong> {selectedProduct.en_title}</p>
            <p><strong>Arabic Title:</strong> {selectedProduct.ar_title}</p>
            <p><strong>Price:</strong> ${parseFloat(selectedProduct.price).toFixed(2)}</p>
            <p><strong>Stock:</strong> {selectedProduct.quantity}</p>
            <p><strong>English Description:</strong> {selectedProduct.en_description}</p>
            <p><strong>Arabic Description:</strong> {selectedProduct.ar_description}</p>
            <h3>Attributes:</h3>
            {selectedProduct.attributes && Array.isArray(selectedProduct.attributes) ? (
              <ul>
                {selectedProduct.attributes.map((attr, index) => (
                  <li key={index}>
                    {attr.attribute_id}: {attr.values.join(', ')}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attributes available</p>
            )}
            <p><strong>Is Deal:</strong> {selectedProduct.is_deal ? 'Yes' : 'No'}</p>
            <p><strong>Is Hot Deal:</strong> {selectedProduct.is_hot_deal ? 'Yes' : 'No'}</p>
            <p><strong>VAT Included:</strong> {selectedProduct.vat_included ? 'Yes' : 'No'}</p>
            <p><strong>Max Quantity Per User:</strong> {selectedProduct.max_quantity_per_user}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;