import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useOrder } from '../../context/OrderContext';

const DeliveredOrderList = () => {
  const { deliveredOrders, isLoading, fetchDeliveredOrders, getOrderDetails } = useOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchDeliveredOrders();
  }, [fetchDeliveredOrders]);

  const showModal = async (orderId) => {
    try {
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
      setIsModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch order details');
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'User ID',
      dataIndex: 'web_user_id',
      key: 'web_user_id',
      width: 100,
    },
    {
      title: 'Customer',
      dataIndex: 'full_name',
      key: 'full_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity) => (quantity ? quantity : 'N/A'),
    },
    {
      title: 'Product ID',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 100,
      render: (product_id) => (product_id ? product_id : 'N/A'),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 120,
      render: (created_at) => (created_at ? new Date(created_at).toLocaleDateString() : 'N/A'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showModal(record.id)} />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Delivered Order List</h2>
      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={deliveredOrders} 
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
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p><strong>Order ID:</strong> {selectedOrder.id || 'N/A'}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.full_name || 'N/A'}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity || 'N/A'}</p>
            <p><strong>Product ID:</strong> {selectedOrder.product_id || 'N/A'}</p>
            <p><strong>Date:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}</p>
            <p><strong>Mobile Number:</strong> {selectedOrder.mobilenumber || 'N/A'}</p>
            <p><strong>Emirates:</strong> {selectedOrder.selected_emirates || 'N/A'}</p>
            <p><strong>Delivery Address:</strong> {selectedOrder.delivery_address || 'N/A'}</p>
            <p><strong>Selected Attributes:</strong> {selectedOrder.selected_attributes || 'N/A'}</p>
            <p><strong>User ID:</strong> {selectedOrder.web_user_id || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeliveredOrderList;