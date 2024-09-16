import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const DeliveredOrderList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const deliveredOrders = [
    { id: 1, customerName: 'George Harris', total: 69.97, items: 3, date: '2023-05-07' },
    { id: 2, customerName: 'Ivy Jackson', total: 99.98, items: 4, date: '2023-05-08' },
    { id: 3, customerName: 'Kevin Lee', total: 59.99, items: 2, date: '2023-05-09' },
  ];

  const showModal = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
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
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Delivered Order List</h2>
      <Table columns={columns} dataSource={deliveredOrders} rowKey="id" />
      <Modal
        title="Order Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <div>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
            <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
            <p><strong>Items:</strong> {selectedOrder.items}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeliveredOrderList;